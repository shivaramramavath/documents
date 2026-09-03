/**
 * ============================================================
 * 32_plugins.js
 * ============================================================
 *
 * Mongoose Plugins
 *
 * Topics:
 *
 *  1. What is a plugin?
 *  2. Basic plugin
 *  3. Adding fields
 *  4. Adding methods
 *  5. Adding statics
 *  6. Adding virtuals
 *  7. Adding middleware
 *  8. Plugin options
 *  9. Reusable pagination plugin
 * 10. Soft-delete plugin
 * 11. Audit plugin
 * 12. Global plugins
 * 13. Local plugins
 * 14. Multiple plugins
 * 15. Plugin order
 * 16. Production plugin structure
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
 * 2. BASIC PLUGIN
 * ============================================================
 *
 * A plugin receives:
 *
 *     schema
 *
 * and optionally:
 *
 *     options
 *
 * ============================================================
 */

function basicPlugin(schema) {
  console.log("Basic plugin registered");
}

/*
 * ============================================================
 * 3. PLUGIN ADDING FIELDS
 * ============================================================
 */

function auditFieldsPlugin(schema) {
  schema.add({
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  });
}

/*
 * ============================================================
 * 4. PLUGIN ADDING INSTANCE METHODS
 * ============================================================
 */

function activePlugin(schema) {
  schema.methods.isActive = function () {
    return this.status === "active";
  };
}

/*
 * ============================================================
 * 5. PLUGIN ADDING STATIC METHODS
 * ============================================================
 */

function findActivePlugin(schema) {
  schema.statics.findActive = function () {
    return this.find({
      status: "active",
    });
  };
}

/*
 * ============================================================
 * 6. PLUGIN ADDING VIRTUAL
 * ============================================================
 */

function displayNamePlugin(schema) {
  schema.virtual("displayName").get(function () {
    return `${this.name} (${this.email})`;
  });
}

/*
 * ============================================================
 * 7. PLUGIN ADDING MIDDLEWARE
 * ============================================================
 */

function loggingPlugin(schema) {
  schema.pre("save", function (next) {
    console.log(`Saving ${this.constructor.modelName}`);

    next();
  });

  schema.post("save", function (doc) {
    console.log(`Saved ${doc._id}`);
  });
}

/*
 * ============================================================
 * 8. COMPLETE BASIC PLUGIN
 * ============================================================
 */

function completePlugin(schema) {
  /*
   * Field
   */

  schema.add({
    pluginVersion: {
      type: Number,

      default: 1,
    },
  });

  /*
   * Instance method
   */

  schema.methods.getPluginInfo = function () {
    return {
      model: this.constructor.modelName,

      pluginVersion: this.pluginVersion,
    };
  };

  /*
   * Static method
   */

  schema.statics.findWithPlugin = function () {
    return this.find();
  };

  /*
   * Virtual

   */

  schema.virtual("pluginName").get(function () {
    return "Complete Plugin";
  });

  /*
   * Middleware
   */

  schema.pre("save", function (next) {
    console.log("Complete plugin pre-save");

    next();
  });
}

/*
 * ============================================================
 * 9. PLUGIN OPTIONS
 * ============================================================
 */

function configurablePlugin(schema, options = {}) {
  const {
    fieldName = "pluginValue",

    defaultValue = true,
  } = options;

  schema.add({
    [fieldName]: {
      type: Boolean,

      default: defaultValue,
    },
  });
}

/*
 * ============================================================
 * 10. PAGINATION PLUGIN
 * ============================================================
 */

function paginationPlugin(schema) {
  schema.statics.paginate = async function ({
    page = 1,
    limit = 10,
    filter = {},
    sort = {
      createdAt: -1,
    },
  } = {}) {
    /*
     * Prevent invalid values.
     */

    page = Math.max(1, Number(page));

    limit = Math.min(100, Math.max(1, Number(limit)));

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.find(filter).sort(sort).skip(skip).limit(limit),

      this.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,

      pagination: {
        page,

        limit,

        total,

        totalPages,

        hasNextPage: page < totalPages,

        hasPreviousPage: page > 1,
      },
    };
  };
}

/*
 * ============================================================
 * 11. SOFT DELETE PLUGIN
 * ============================================================
 */

function softDeletePlugin(schema) {
  /*
   * Add deleted fields.
   */

  schema.add({
    deleted: {
      type: Boolean,

      default: false,

      index: true,
    },

    deletedAt: {
      type: Date,

      default: null,
    },
  });

  /*
   * Static soft delete.
   */

  schema.statics.softDelete = async function (filter) {
    return this.updateMany(
      filter,

      {
        $set: {
          deleted: true,

          deletedAt: new Date(),
        },
      },
    );
  };

  /*
   * Restore.
   */

  schema.statics.restore = async function (filter) {
    return this.updateMany(
      filter,

      {
        $set: {
          deleted: false,

          deletedAt: null,
        },
      },
    );
  };

  /*
   * Find only non-deleted documents.
   */

  schema.statics.findActiveDocuments = function (filter = {}) {
    return this.find({
      ...filter,

      deleted: false,
    });
  };

  /*
   * Find deleted documents.
   */

  schema.statics.findDeleted = function (filter = {}) {
    return this.find({
      ...filter,

      deleted: true,
    });
  };
}

/*
 * ============================================================
 * 12. AUTOMATIC SOFT DELETE FILTER
 * ============================================================
 *
 * Be careful with automatic query middleware.
 *
 * This demonstrates the concept.
 *
 * ============================================================
 */

function automaticSoftDeletePlugin(schema) {
  schema.add({
    deleted: {
      type: Boolean,

      default: false,

      index: true,
    },
  });

  const queryMiddleware = [
    "find",

    "findOne",

    "findOneAndUpdate",

    "countDocuments",
  ];

  for (const operation of queryMiddleware) {
    schema.pre(operation, function (next) {
      this.where({
        deleted: false,
      });

      next();
    });
  }
}

/*
 * ============================================================
 * 13. UPDATED-BY PLUGIN
 * ============================================================
 */

function updatedByPlugin(schema) {
  schema.add({
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",
    },
  });

  schema.pre("findOneAndUpdate", function (next) {
    /*
     * In real applications the
     * user ID should come from
     * request/service context.
     */

    const update = this.getUpdate();

    if (update.$set) {
      update.$set.updatedAt = new Date();
    }

    next();
  });
}

/*
 * ============================================================
 * 14. TOJSON PLUGIN
 * ============================================================
 */

function toJSONPlugin(schema) {
  schema.set("toJSON", {
    virtuals: true,

    transform: function (doc, ret) {
      ret.id = ret._id?.toString();

      delete ret._id;

      delete ret.__v;

      return ret;
    },
  });
}

/*
 * ============================================================
 * 15. TIMESTAMPS PLUGIN
 * ============================================================
 */

function timestampsPlugin(schema) {
  schema.add({
    createdAt: {
      type: Date,

      default: Date.now,

      immutable: true,
    },

    updatedAt: {
      type: Date,

      default: Date.now,
    },
  });

  schema.pre("save", function (next) {
    this.updatedAt = new Date();

    next();
  });
}

/*
 * ============================================================
 * 16. MODEL USING BASIC PLUGINS
 * ============================================================
 */

const userSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  email: {
    type: String,

    required: true,
  },

  status: {
    type: String,

    enum: ["active", "inactive"],

    default: "active",
  },
});

/*
 * Register plugins BEFORE
 * creating the model.
 */

userSchema.plugin(basicPlugin);

userSchema.plugin(auditFieldsPlugin);

userSchema.plugin(activePlugin);

userSchema.plugin(findActivePlugin);

userSchema.plugin(displayNamePlugin);

userSchema.plugin(paginationPlugin);

userSchema.plugin(softDeletePlugin);

userSchema.plugin(toJSONPlugin);

const User =
  mongoose.models.PluginUser || mongoose.model("PluginUser", userSchema);

/*
 * ============================================================
 * 17. USE PLUGIN METHODS
 * ============================================================
 */

async function usePluginMethods() {
  const user = await User.findOne();

  if (!user) {
    return;
  }

  /*
   * Instance method.
   */

  console.log(user.isActive());

  /*
   * Virtual.
   */

  console.log(user.displayName);

  /*
   * Static method.
   */

  const activeUsers = await User.findActive();

  console.log(activeUsers);

  /*
   * Pagination static.
   */

  const result = await User.paginate({
    page: 1,

    limit: 20,
  });

  console.log(result.pagination);
}

/*
 * ============================================================
 * 18. CONFIGURABLE PLUGIN
 * ============================================================
 */

const productSchema = new mongoose.Schema({
  name: String,
});

productSchema.plugin(
  configurablePlugin,

  {
    fieldName: "isSearchable",

    defaultValue: true,
  },
);

const Product =
  mongoose.models.PluginProduct ||
  mongoose.model("PluginProduct", productSchema);

/*
 * ============================================================
 * 19. MULTIPLE PLUGINS
 * ============================================================
 */

const departmentSchema = new mongoose.Schema({
  name: String,

  code: String,
});

departmentSchema.plugin(paginationPlugin);

departmentSchema.plugin(softDeletePlugin);

departmentSchema.plugin(toJSONPlugin);

const Department =
  mongoose.models.PluginDepartment ||
  mongoose.model("PluginDepartment", departmentSchema);

/*
 * ============================================================
 * 20. GLOBAL PLUGIN
 * ============================================================
 *
 * mongoose.plugin(...)
 *
 * applies the plugin to every
 * subsequently created schema.
 *
 * ============================================================
 */

function globalPlugin(schema) {
  schema.add({
    globalPluginEnabled: {
      type: Boolean,

      default: true,
    },
  });
}

/*
 * IMPORTANT:
 *
 * Register global plugins before
 * creating schemas/models that
 * should receive them.
 *
 * Example:
 *
 * mongoose.plugin(globalPlugin);
 *
 */

/*
 * ============================================================
 * 21. LOCAL VS GLOBAL
 * ============================================================
 *
 * LOCAL:
 *
 * schema.plugin(myPlugin)
 *
 *
 * GLOBAL:
 *
 * mongoose.plugin(myPlugin)
 *
 * ============================================================
 */

/*
 * ============================================================
 * 22. PLUGIN ORDER
 * ============================================================
 */

function firstPlugin(schema) {
  schema.pre("save", function (next) {
    console.log("First plugin");

    next();
  });
}

function secondPlugin(schema) {
  schema.pre("save", function (next) {
    console.log("Second plugin");

    next();
  });
}

const orderSchema = new mongoose.Schema({
  name: String,
});

orderSchema.plugin(firstPlugin);

orderSchema.plugin(secondPlugin);

/*
 * ============================================================
 * 23. PRODUCTION PLUGIN FACTORY
 * ============================================================
 */

function createAuditPlugin(options = {}) {
  const {
    createdByField = "createdBy",

    updatedByField = "updatedBy",
  } = options;

  return function auditPlugin(schema) {
    schema.add({
      [createdByField]: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },

      [updatedByField]: {
        type: mongoose.Schema.Types.ObjectId,

        ref: "User",
      },
    });
  };
}

/*
 * ============================================================
 * 24. USE FACTORY
 * ============================================================
 */

const timetableSchema = new mongoose.Schema({
  name: String,

  status: String,
});

timetableSchema.plugin(
  createAuditPlugin({
    createdByField: "createdBy",

    updatedByField: "lastModifiedBy",
  }),
);

const Timetable =
  mongoose.models.PluginTimetable ||
  mongoose.model("PluginTimetable", timetableSchema);

/*
 * ============================================================
 * 25. PRODUCTION COMBINED PLUGIN
 * ============================================================
 */

function commonModelPlugin(schema, options = {}) {
  /*
   * Soft delete
   */

  softDeletePlugin(schema);

  /*
   * Pagination
   */

  paginationPlugin(schema);

  /*
   * JSON transformation
   */

  toJSONPlugin(schema);

  /*
   * Audit fields
   */

  auditFieldsPlugin(schema);

  /*
   * Options
   */

  if (options.enableDisplayName) {
    displayNamePlugin(schema);
  }
}

/*
 * ============================================================
 * 26. PRODUCTION SCHEMA
 * ============================================================
 */

const facultySchema = new mongoose.Schema(
  {
    name: {
      type: String,

      required: true,
    },

    email: {
      type: String,

      required: true,
    },

    department: {
      type: String,

      required: true,
    },

    status: {
      type: String,

      enum: ["active", "inactive"],

      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

facultySchema.plugin(
  commonModelPlugin,

  {
    enableDisplayName: true,
  },
);

const Faculty =
  mongoose.models.PluginFaculty ||
  mongoose.model("PluginFaculty", facultySchema);

/*
 * ============================================================
 * 27. CONNECTION
 * ============================================================
 */

async function main() {
  await mongoose.connect(MONGODB_URI);

  console.log("MongoDB connected");

  /*
   * Example:
   */

  const faculty = new Faculty({
    name: "Dr. Kumar",

    email: "kumar@example.com",

    department: "CSE",
  });

  console.log(faculty);

  /*
   * Example static method.
   */

  const result = await Faculty.paginate({
    page: 1,

    limit: 10,
  });

  console.log(result.pagination);

  await mongoose.disconnect();

  console.log("MongoDB disconnected");
}

await main();
