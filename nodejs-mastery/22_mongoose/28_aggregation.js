/**
 * ============================================================
 * 28_aggregation.js
 * ============================================================
 *
 * Mongoose Aggregation Pipeline
 *
 * Topics:
 *
 *  1. aggregate()
 *  2. $match
 *  3. $project
 *  4. $set / $addFields
 *  5. $unset
 *  6. $sort
 *  7. $skip
 *  8. $limit
 *  9. $count
 * 10. $group
 * 11. Accumulators
 * 12. $unwind
 * 13. $lookup
 * 14. $facet
 * 15. $replaceRoot
 * 16. $replaceWith
 * 17. $expr
 * 18. $cond
 * 19. $switch
 * 20. $ifNull
 * 21. $setUnion
 * 22. $filter
 * 23. $map
 * 24. $reduce
 * 25. $bucket
 * 26. $sortByCount
 * 27. $sample
 * 28. Aggregation pagination
 * 29. Aggregation + lookup
 * 30. Timetable analytics
 *
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

/*
 * ============================================================
 * 1. ENVIRONMENT
 * ============================================================
 */

dotenv.config({
  path: new URL("./.env", import.meta.url),
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

/*
 * ============================================================
 * 2. USER SCHEMA
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  department: {
    type: String,
  },

  age: {
    type: Number,
  },

  salary: {
    type: Number,
  },

  skills: [String],

  active: {
    type: Boolean,

    default: true,
  },
});

/*
 * ============================================================
 * 3. FACULTY SCHEMA
 * ============================================================
 */

const facultySchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  department: {
    type: String,

    required: true,
  },

  designation: {
    type: String,
  },

  experience: {
    type: Number,

    default: 0,
  },
});

/*
 * ============================================================
 * 4. SUBJECT SCHEMA
 * ============================================================
 */

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  code: {
    type: String,

    required: true,
  },

  department: {
    type: String,

    required: true,
  },

  credits: {
    type: Number,

    default: 3,
  },
});

/*
 * ============================================================
 * 5. ROOM SCHEMA
 * ============================================================
 */

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,

    required: true,
  },

  building: {
    type: String,
  },

  capacity: {
    type: Number,

    default: 30,
  },

  type: {
    type: String,

    enum: ["classroom", "lab", "seminar"],
  },
});

/*
 * ============================================================
 * 6. TIMETABLE SCHEMA
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  department: {
    type: String,

    required: true,
  },

  semester: {
    type: Number,
  },

  section: {
    type: String,
  },

  status: {
    type: String,

    enum: ["draft", "published", "archived"],

    default: "draft",
  },
});

/*
 * ============================================================
 * 7. TIMETABLE ENTRY SCHEMA
 * ============================================================
 */

const timetableEntrySchema = new mongoose.Schema({
  timetableId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "AggregationTimetable",

    required: true,
  },

  facultyId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "AggregationFaculty",

    required: true,
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "AggregationSubject",

    required: true,
  },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,

    ref: "AggregationRoom",

    required: true,
  },

  day: {
    type: String,

    required: true,
  },

  startTime: {
    type: String,

    required: true,
  },

  endTime: {
    type: String,

    required: true,
  },

  duration: {
    type: Number,

    default: 1,
  },

  studentCount: {
    type: Number,

    default: 0,
  },
});

/*
 * ============================================================
 * 8. MODELS
 * ============================================================
 */

const User =
  mongoose.models.AggregationUser ||
  mongoose.model("AggregationUser", userSchema);

const Faculty =
  mongoose.models.AggregationFaculty ||
  mongoose.model("AggregationFaculty", facultySchema);

const Subject =
  mongoose.models.AggregationSubject ||
  mongoose.model("AggregationSubject", subjectSchema);

const Room =
  mongoose.models.AggregationRoom ||
  mongoose.model("AggregationRoom", roomSchema);

const Timetable =
  mongoose.models.AggregationTimetable ||
  mongoose.model("AggregationTimetable", timetableSchema);

const TimetableEntry =
  mongoose.models.AggregationTimetableEntry ||
  mongoose.model("AggregationTimetableEntry", timetableEntrySchema);

/*
 * ============================================================
 * 9. BASIC AGGREGATION
 * ============================================================
 */

async function basicAggregation() {
  const result = await User.aggregate([
    {
      $match: {
        active: true,
      },
    },
  ]);

  console.log("\n===== BASIC AGGREGATION =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 10. $MATCH
 * ============================================================
 */

async function matchDemo() {
  const result = await User.aggregate([
    {
      $match: {
        age: {
          $gte: 20,

          $lte: 30,
        },

        active: true,
      },
    },
  ]);

  console.log("\n===== $MATCH =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 11. $PROJECT
 * ============================================================
 */

async function projectDemo() {
  const result = await User.aggregate([
    {
      $project: {
        _id: 1,

        name: 1,

        department: 1,

        age: 1,
      },
    },
  ]);

  console.log("\n===== $PROJECT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 12. $PROJECT WITH CALCULATED FIELD
 * ============================================================
 */

async function calculatedProjectDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        salary: 1,

        yearlySalary: {
          $multiply: ["$salary", 12],
        },
      },
    },
  ]);

  console.log("\n===== CALCULATED PROJECT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 13. $SET
 * ============================================================
 */

async function setDemo() {
  const result = await User.aggregate([
    {
      $set: {
        yearlySalary: {
          $multiply: ["$salary", 12],
        },
      },
    },
  ]);

  console.log("\n===== $SET =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 14. $UNSET
 * ============================================================
 */

async function unsetDemo() {
  const result = await User.aggregate([
    {
      $unset: ["salary", "skills"],
    },
  ]);

  console.log("\n===== $UNSET =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 15. $SORT
 * ============================================================
 */

async function sortDemo() {
  const result = await User.aggregate([
    {
      $sort: {
        age: 1,

        name: 1,
      },
    },
  ]);

  console.log("\n===== $SORT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 16. $SORT DESCENDING
 * ============================================================
 */

async function sortDescendingDemo() {
  const result = await User.aggregate([
    {
      $sort: {
        salary: -1,
      },
    },
  ]);

  console.log("\n===== SORT DESCENDING =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 17. $SKIP + $LIMIT
 * ============================================================
 */

async function paginationDemo() {
  const page = 2;

  const limit = 10;

  const skip = (page - 1) * limit;

  const result = await User.aggregate([
    {
      $skip: skip,
    },

    {
      $limit: limit,
    },
  ]);

  console.log("\n===== PAGINATION =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 18. $COUNT
 * ============================================================
 */

async function countDemo() {
  const result = await User.aggregate([
    {
      $match: {
        active: true,
      },
    },

    {
      $count: "totalUsers",
    },
  ]);

  console.log("\n===== $COUNT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 19. $GROUP
 * ============================================================
 */

async function groupDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        count: {
          $sum: 1,
        },
      },
    },
  ]);

  console.log("\n===== $GROUP =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 20. GROUP + SUM
 * ============================================================
 */

async function groupSumDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        totalSalary: {
          $sum: "$salary",
        },
      },
    },
  ]);

  console.log("\n===== GROUP + SUM =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 21. GROUP + AVG
 * ============================================================
 */

async function groupAverageDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        averageSalary: {
          $avg: "$salary",
        },
      },
    },
  ]);

  console.log("\n===== GROUP + AVG =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 22. GROUP + MIN + MAX
 * ============================================================
 */

async function groupMinMaxDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        minimumSalary: {
          $min: "$salary",
        },

        maximumSalary: {
          $max: "$salary",
        },
      },
    },
  ]);

  console.log("\n===== MIN / MAX =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 23. GROUP + PUSH
 * ============================================================
 */

async function groupPushDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        users: {
          $push: "$name",
        },
      },
    },
  ]);

  console.log("\n===== GROUP + PUSH =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 24. GROUP + ADDTOSET
 * ============================================================
 */

async function groupAddToSetDemo() {
  const result = await User.aggregate([
    {
      $group: {
        _id: "$department",

        skills: {
          $addToSet: "$skills",
        },
      },
    },
  ]);

  console.log("\n===== GROUP + ADDTOSET =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 25. $UNWIND
 * ============================================================
 */

async function unwindDemo() {
  const result = await User.aggregate([
    {
      $unwind: "$skills",
    },
  ]);

  console.log("\n===== $UNWIND =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 26. UNWIND + GROUP
 * ============================================================
 */

async function skillsCountDemo() {
  const result = await User.aggregate([
    {
      $unwind: "$skills",
    },

    {
      $group: {
        _id: "$skills",

        count: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        count: -1,
      },
    },
  ]);

  console.log("\n===== SKILL COUNT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 27. $LOOKUP
 * ============================================================
 */

async function lookupDemo() {
  const result = await TimetableEntry.aggregate([
    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "facultyId",

        foreignField: "_id",

        as: "faculty",
      },
    },
  ]);

  console.log("\n===== $LOOKUP =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 28. LOOKUP + UNWIND
 * ============================================================
 */

async function lookupUnwindDemo() {
  const result = await TimetableEntry.aggregate([
    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "facultyId",

        foreignField: "_id",

        as: "faculty",
      },
    },

    {
      $unwind: "$faculty",
    },
  ]);

  console.log("\n===== LOOKUP + UNWIND =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 29. MULTIPLE LOOKUPS
 * ============================================================
 */

async function multipleLookupDemo() {
  const result = await TimetableEntry.aggregate([
    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "facultyId",

        foreignField: "_id",

        as: "faculty",
      },
    },

    {
      $lookup: {
        from: "aggregationsubjects",

        localField: "subjectId",

        foreignField: "_id",

        as: "subject",
      },
    },

    {
      $lookup: {
        from: "aggregationrooms",

        localField: "roomId",

        foreignField: "_id",

        as: "room",
      },
    },
  ]);

  console.log("\n===== MULTIPLE LOOKUPS =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 30. $FACET
 * ============================================================
 *
 * Multiple pipelines from the same input.
 *
 * ============================================================
 */

async function facetDemo() {
  const result = await User.aggregate([
    {
      $facet: {
        /*
         * Pipeline 1
         */

        statistics: [
          {
            $group: {
              _id: null,

              totalUsers: {
                $sum: 1,
              },

              averageAge: {
                $avg: "$age",
              },
            },
          },
        ],

        /*
         * Pipeline 2
         */

        departments: [
          {
            $group: {
              _id: "$department",

              count: {
                $sum: 1,
              },
            },
          },
        ],

        /*
         * Pipeline 3
         */

        activeUsers: [
          {
            $match: {
              active: true,
            },
          },

          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  console.log("\n===== $FACET =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 31. $COND
 * ============================================================
 */

async function condDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        age: 1,

        ageGroup: {
          $cond: [
            {
              $gte: ["$age", 25],
            },

            "senior",

            "junior",
          ],
        },
      },
    },
  ]);

  console.log("\n===== $COND =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 32. $SWITCH
 * ============================================================
 */

async function switchDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        age: 1,

        category: {
          $switch: {
            branches: [
              {
                case: {
                  $lt: ["$age", 20],
                },

                then: "teen",
              },

              {
                case: {
                  $lt: ["$age", 30],
                },

                then: "young",
              },

              {
                case: {
                  $lt: ["$age", 50],
                },

                then: "adult",
              },
            ],

            default: "senior",
          },
        },
      },
    },
  ]);

  console.log("\n===== $SWITCH =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 33. $IFNULL
 * ============================================================
 */

async function ifNullDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        department: {
          $ifNull: ["$department", "Unknown"],
        },
      },
    },
  ]);

  console.log("\n===== $IFNULL =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 34. $EXPR
 * ============================================================
 */

async function exprDemo() {
  const result = await User.aggregate([
    {
      $match: {
        $expr: {
          $gt: ["$salary", 50000],
        },
      },
    },
  ]);

  console.log("\n===== $EXPR =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 35. $FILTER
 * ============================================================
 */

async function filterDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        expensiveSkills: {
          $filter: {
            input: "$skills",

            as: "skill",

            cond: {
              $ne: ["$$skill", "JavaScript"],
            },
          },
        },
      },
    },
  ]);

  console.log("\n===== $FILTER =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 36. $MAP
 * ============================================================
 */

async function mapDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        uppercaseSkills: {
          $map: {
            input: "$skills",

            as: "skill",

            in: {
              $toUpper: "$$skill",
            },
          },
        },
      },
    },
  ]);

  console.log("\n===== $MAP =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 37. $REDUCE
 * ============================================================
 */

async function reduceDemo() {
  const result = await User.aggregate([
    {
      $project: {
        name: 1,

        skillCount: {
          $reduce: {
            input: "$skills",

            initialValue: 0,

            in: {
              $add: ["$$value", 1],
            },
          },
        },
      },
    },
  ]);

  console.log("\n===== $REDUCE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 38. $REPLACE_ROOT
 * ============================================================
 */

async function replaceRootDemo() {
  const result = await TimetableEntry.aggregate([
    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "facultyId",

        foreignField: "_id",

        as: "faculty",
      },
    },

    {
      $unwind: "$faculty",
    },

    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$faculty", "$$ROOT"],
        },
      },
    },
  ]);

  console.log("\n===== $REPLACE_ROOT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 39. $BUCKET
 * ============================================================
 */

async function bucketDemo() {
  const result = await User.aggregate([
    {
      $bucket: {
        groupBy: "$age",

        boundaries: [
          18,

          25,

          35,

          50,

          100,
        ],

        default: "100+",

        output: {
          count: {
            $sum: 1,
          },

          users: {
            $push: "$name",
          },
        },
      },
    },
  ]);

  console.log("\n===== $BUCKET =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 40. $SORT_BY_COUNT
 * ============================================================
 */

async function sortByCountDemo() {
  const result = await User.aggregate([
    {
      $unwind: "$skills",
    },

    {
      $sortByCount: "$skills",
    },
  ]);

  console.log("\n===== $SORT_BY_COUNT =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 41. $SAMPLE
 * ============================================================
 */

async function sampleDemo() {
  const result = await User.aggregate([
    {
      $sample: {
        size: 5,
      },
    },
  ]);

  console.log("\n===== $SAMPLE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 42. TIMETABLE BASIC ANALYTICS
 * ============================================================
 *
 * Count classes by day.
 *
 * ============================================================
 */

async function timetableClassesByDay() {
  const result = await TimetableEntry.aggregate([
    {
      $group: {
        _id: "$day",

        totalClasses: {
          $sum: 1,
        },
      },
    },

    {
      $sort: {
        totalClasses: -1,
      },
    },
  ]);

  console.log("\n===== CLASSES BY DAY =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 43. FACULTY WORKLOAD
 * ============================================================
 */

async function facultyWorkload() {
  const result = await TimetableEntry.aggregate([
    {
      $group: {
        _id: "$facultyId",

        totalClasses: {
          $sum: 1,
        },

        totalHours: {
          $sum: "$duration",
        },
      },
    },

    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "_id",

        foreignField: "_id",

        as: "faculty",
      },
    },

    {
      $unwind: "$faculty",
    },

    {
      $project: {
        _id: 0,

        facultyId: "$faculty._id",

        facultyName: "$faculty.name",

        department: "$faculty.department",

        totalClasses: 1,

        totalHours: 1,
      },
    },

    {
      $sort: {
        totalHours: -1,
      },
    },
  ]);

  console.log("\n===== FACULTY WORKLOAD =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 44. ROOM UTILIZATION
 * ============================================================
 */

async function roomUtilization() {
  const result = await TimetableEntry.aggregate([
    {
      $group: {
        _id: "$roomId",

        totalClasses: {
          $sum: 1,
        },

        totalHours: {
          $sum: "$duration",
        },
      },
    },

    {
      $lookup: {
        from: "aggregationrooms",

        localField: "_id",

        foreignField: "_id",

        as: "room",
      },
    },

    {
      $unwind: "$room",
    },

    {
      $project: {
        _id: 0,

        roomNumber: "$room.roomNumber",

        building: "$room.building",

        capacity: "$room.capacity",

        totalClasses: 1,

        totalHours: 1,
      },
    },

    {
      $sort: {
        totalHours: -1,
      },
    },
  ]);

  console.log("\n===== ROOM UTILIZATION =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 45. SUBJECT DISTRIBUTION
 * ============================================================
 */

async function subjectDistribution() {
  const result = await TimetableEntry.aggregate([
    {
      $group: {
        _id: "$subjectId",

        totalClasses: {
          $sum: 1,
        },
      },
    },

    {
      $lookup: {
        from: "aggregationsubjects",

        localField: "_id",

        foreignField: "_id",

        as: "subject",
      },
    },

    {
      $unwind: "$subject",
    },

    {
      $project: {
        _id: 0,

        subjectCode: "$subject.code",

        subjectName: "$subject.name",

        department: "$subject.department",

        totalClasses: 1,
      },
    },

    {
      $sort: {
        totalClasses: -1,
      },
    },
  ]);

  console.log("\n===== SUBJECT DISTRIBUTION =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 46. FULL TIMETABLE QUERY
 * ============================================================
 *
 * One entry becomes:
 *
 * {
 *   day,
 *   startTime,
 *   endTime,
 *   faculty,
 *   subject,
 *   room
 * }
 *
 * ============================================================
 */

async function fullTimetable() {
  const result = await TimetableEntry.aggregate([
    {
      $lookup: {
        from: "aggregationfaculties",

        localField: "facultyId",

        foreignField: "_id",

        as: "faculty",
      },
    },

    {
      $lookup: {
        from: "aggregationsubjects",

        localField: "subjectId",

        foreignField: "_id",

        as: "subject",
      },
    },

    {
      $lookup: {
        from: "aggregationrooms",

        localField: "roomId",

        foreignField: "_id",

        as: "room",
      },
    },

    {
      $unwind: "$faculty",
    },

    {
      $unwind: "$subject",
    },

    {
      $unwind: "$room",
    },

    {
      $project: {
        _id: 1,

        day: 1,

        startTime: 1,

        endTime: 1,

        duration: 1,

        faculty: {
          id: "$faculty._id",

          name: "$faculty.name",

          department: "$faculty.department",
        },

        subject: {
          id: "$subject._id",

          code: "$subject.code",

          name: "$subject.name",
        },

        room: {
          id: "$room._id",

          number: "$room.roomNumber",

          building: "$room.building",

          capacity: "$room.capacity",
        },
      },
    },

    {
      $sort: {
        day: 1,

        startTime: 1,
      },
    },
  ]);

  console.log("\n===== FULL TIMETABLE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 47. TIMETABLE PAGINATION WITH $FACET
 * ============================================================
 */

async function timetablePagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;

  const result = await TimetableEntry.aggregate([
    {
      $facet: {
        data: [
          {
            $sort: {
              day: 1,

              startTime: 1,
            },
          },

          {
            $skip: skip,
          },

          {
            $limit: limit,
          },
        ],

        metadata: [
          {
            $count: "total",
          },
        ],
      },
    },
  ]);

  console.log("\n===== PAGINATED TIMETABLE =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 48. COMPLETE TIMETABLE ANALYTICS
 * ============================================================
 */

async function timetableAnalytics() {
  const result = await TimetableEntry.aggregate([
    {
      $facet: {
        /*
         * Total classes
         */

        totalClasses: [
          {
            $count: "count",
          },
        ],

        /*
         * Faculty workload
         */

        facultyWorkload: [
          {
            $group: {
              _id: "$facultyId",

              classes: {
                $sum: 1,
              },

              hours: {
                $sum: "$duration",
              },
            },
          },

          {
            $sort: {
              hours: -1,
            },
          },
        ],

        /*
         * Room utilization
         */

        roomUtilization: [
          {
            $group: {
              _id: "$roomId",

              classes: {
                $sum: 1,
              },

              hours: {
                $sum: "$duration",
              },
            },
          },

          {
            $sort: {
              hours: -1,
            },
          },
        ],

        /*
         * Classes by day
         */

        classesByDay: [
          {
            $group: {
              _id: "$day",

              count: {
                $sum: 1,
              },
            },
          },
        ],

        /*
         * Student load
         */

        studentLoad: [
          {
            $group: {
              _id: null,

              totalStudents: {
                $sum: "$studentCount",
              },
            },
          },
        ],
      },
    },
  ]);

  console.log("\n===== COMPLETE TIMETABLE ANALYTICS =====");

  console.dir(result, {
    depth: 10,
  });
}

/*
 * ============================================================
 * 49. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  try {
    await basicAggregation();

    await matchDemo();

    await projectDemo();

    await calculatedProjectDemo();

    await setDemo();

    await unsetDemo();

    await sortDemo();

    await sortDescendingDemo();

    await paginationDemo();

    await countDemo();

    await groupDemo();

    await groupSumDemo();

    await groupAverageDemo();

    await groupMinMaxDemo();

    await groupPushDemo();

    await groupAddToSetDemo();

    await unwindDemo();

    await skillsCountDemo();

    await lookupDemo();

    await lookupUnwindDemo();

    await multipleLookupDemo();

    await facetDemo();

    await condDemo();

    await switchDemo();

    await ifNullDemo();

    await exprDemo();

    await filterDemo();

    await mapDemo();

    await reduceDemo();

    await replaceRootDemo();

    await bucketDemo();

    await sortByCountDemo();

    await sampleDemo();

    await timetableClassesByDay();

    await facultyWorkload();

    await roomUtilization();

    await subjectDistribution();

    await fullTimetable();

    await timetablePagination(1, 10);

    await timetableAnalytics();
  } finally {
    await mongoose.disconnect();

    console.log("\nMongoDB disconnected");
  }
}

/*
 * ============================================================
 * 50. RUN
 * ============================================================
 */

await main();
