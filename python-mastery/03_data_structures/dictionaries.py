"""
Python Dictionaries
===================

A dictionary stores data as:

    key -> value

Example:

    {
        "name": "Shiva",
        "age": 21
    }

Dictionaries are:

    - mutable
    - ordered (insertion order is preserved)
    - key-value based
    - keys must be unique
    - keys must be hashable
    - values can be any Python object
"""


# ============================================================
# 1. CREATING A DICTIONARY
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(person)


# ============================================================
# 2. EMPTY DICTIONARY
# ============================================================

empty = {}

print(empty)
print(type(empty))


# ============================================================
# 3. dict() CONSTRUCTOR
# ============================================================

person = dict(
    name="Shiva",
    age=21,
    branch="CSE",
)

print(person)


# ============================================================
# 4. DICTIONARY WITH DIFFERENT VALUE TYPES
# ============================================================

data = {
    "name": "Shiva",
    "age": 21,
    "marks": 85.5,
    "active": True,
    "skills": ["Python", "SQL"],
    "address": {
        "city": "Guntur",
        "state": "Andhra Pradesh",
    },
}

print(data)


"""
Dictionary values can be:

    strings
    integers
    floats
    booleans
    lists
    tuples
    sets
    dictionaries
    objects
    functions
    None
    etc.
"""


# ============================================================
# 5. DICTIONARY KEYS MUST BE UNIQUE
# ============================================================

person = {
    "name": "Shiva",
    "name": "Ram",
}

print(person)


"""
The second value replaces the first one.

Output:

    {'name': 'Ram'}
"""


# ============================================================
# 6. ACCESS VALUE USING KEY
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

print(person["name"])
print(person["age"])


# ============================================================
# 7. ACCESS MISSING KEY
# ============================================================

person = {
    "name": "Shiva",
}

# print(person["age"])


"""
This raises:

KeyError
"""


# ============================================================
# 8. get()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

print(person.get("name"))
print(person.get("age"))


# ============================================================
# 9. get() WITH MISSING KEY
# ============================================================

person = {
    "name": "Shiva",
}

print(person.get("age"))


"""
get() returns None instead of raising KeyError.
"""


# ============================================================
# 10. get() WITH DEFAULT VALUE
# ============================================================

person = {
    "name": "Shiva",
}

age = person.get("age", 0)

print(age)


# ============================================================
# 11. CHECK KEY EXISTENCE
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

print("name" in person)
print("age" in person)
print("email" in person)


# ============================================================
# 12. NOT IN
# ============================================================

person = {
    "name": "Shiva",
}

if "email" not in person:
    print("Email does not exist")


# ============================================================
# 13. ADD NEW KEY
# ============================================================

person = {
    "name": "Shiva",
}

person["age"] = 21

print(person)


# ============================================================
# 14. UPDATE EXISTING KEY
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

person["age"] = 22

print(person)


"""
If the key already exists:

    dictionary[key] = value

updates it.

If the key doesn't exist:

    it creates it.
"""


# ============================================================
# 15. update()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

person.update({
    "age": 22,
    "branch": "CSE",
})

print(person)


# ============================================================
# 16. update() WITH KEYWORD ARGUMENTS
# ============================================================

person = {
    "name": "Shiva",
}

person.update(
    age=21,
    branch="CSE",
)

print(person)


# ============================================================
# 17. DELETE USING del
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

del person["age"]

print(person)


# ============================================================
# 18. del MISSING KEY
# ============================================================

person = {
    "name": "Shiva",
}

# del person["age"]


"""
Raises:

KeyError
"""


# ============================================================
# 19. pop()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

age = person.pop("age")

print("Removed:", age)
print("Dictionary:", person)


# ============================================================
# 20. pop() WITH DEFAULT
# ============================================================

person = {
    "name": "Shiva",
}

age = person.pop("age", 0)

print(age)


"""
No KeyError because a default value was supplied.
"""


# ============================================================
# 21. popitem()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

item = person.popitem()

print("Removed:", item)
print("Remaining:", person)


"""
popitem() removes and returns the last
inserted key-value pair.

It returns a tuple:

    (key, value)
"""


# ============================================================
# 22. clear()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

person.clear()

print(person)


# ============================================================
# 23. copy()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

copy = person.copy()

print(copy)


# ============================================================
# 24. SHALLOW COPY
# ============================================================

person = {
    "name": "Shiva",
    "skills": ["Python", "SQL"],
}

copy = person.copy()

copy["skills"].append("FastAPI")

print("Original:", person)
print("Copy:", copy)


"""
copy() is a shallow copy.

Nested mutable objects are still shared.
"""


# ============================================================
# 25. DEEP COPY
# ============================================================

import copy

person = {
    "name": "Shiva",
    "skills": ["Python", "SQL"],
}

deep_copy = copy.deepcopy(person)

deep_copy["skills"].append("FastAPI")

print("Original:", person)
print("Deep copy:", deep_copy)


"""
deepcopy() recursively copies nested objects.
"""


# ============================================================
# 26. keys()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(person.keys())


# ============================================================
# 27. values()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(person.values())


# ============================================================
# 28. items()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(person.items())


# ============================================================
# 29. ITERATE KEYS
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

for key in person:
    print(key)


# ============================================================
# 30. ITERATE VALUES
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

for value in person.values():
    print(value)


# ============================================================
# 31. ITERATE KEY + VALUE
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

for key, value in person.items():
    print(key, value)


"""
This pattern is extremely important.
"""


# ============================================================
# 32. len()
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(len(person))


# ============================================================
# 33. DICTIONARY ORDER
# ============================================================

person = {}

person["name"] = "Shiva"
person["age"] = 21
person["branch"] = "CSE"

print(person)


"""
Modern Python dictionaries preserve insertion order.
"""


# ============================================================
# 34. INTEGER KEYS
# ============================================================

data = {
    1: "Python",
    2: "Java",
    3: "Go",
}

print(data[1])


# ============================================================
# 35. TUPLE KEYS
# ============================================================

locations = {
    (16.5, 80.6): "Guntur",
    (17.4, 78.5): "Hyderabad",
}

print(locations[(16.5, 80.6)])


"""
Tuple keys are possible when the tuple is hashable.
"""


# ============================================================
# 36. LIST AS KEY — NOT ALLOWED
# ============================================================

# data = {
#     [1, 2]: "value"
# }


"""
Raises:

TypeError

because lists are unhashable.
"""


# ============================================================
# 37. SET AS KEY — NOT ALLOWED
# ============================================================

# data = {
#     {1, 2}: "value"
# }


"""
Sets are also unhashable.
"""


# ============================================================
# 38. FROZENSET AS KEY
# ============================================================

data = {
    frozenset({1, 2}): "Group A"
}

print(data)


# ============================================================
# 39. NONE AS KEY
# ============================================================

data = {
    None: "No value",
}

print(data[None])


# ============================================================
# 40. BOOLEAN KEYS
# ============================================================

data = {
    True: "yes",
    False: "no",
}

print(data)


# ============================================================
# 41. INTEGER / BOOLEAN KEY COLLISION
# ============================================================

data = {
    True: "boolean",
    1: "integer",
}

print(data)


"""
True == 1

Therefore they refer to the same dictionary key.
"""


# ============================================================
# 42. NESTED DICTIONARY
# ============================================================

student = {
    "name": "Shiva",
    "address": {
        "city": "Guntur",
        "state": "Andhra Pradesh",
    },
}

print(student)


# ============================================================
# 43. ACCESS NESTED DICTIONARY
# ============================================================

student = {
    "name": "Shiva",
    "address": {
        "city": "Guntur",
        "state": "Andhra Pradesh",
    },
}

print(student["address"]["city"])


# ============================================================
# 44. UPDATE NESTED VALUE
# ============================================================

student = {
    "name": "Shiva",
    "address": {
        "city": "Guntur",
        "state": "Andhra Pradesh",
    },
}

student["address"]["city"] = "Hyderabad"

print(student)


# ============================================================
# 45. NESTED LIST
# ============================================================

student = {
    "name": "Shiva",
    "skills": [
        "Python",
        "SQL",
        "FastAPI",
    ],
}

print(student["skills"])


# ============================================================
# 46. ACCESS NESTED LIST
# ============================================================

student = {
    "name": "Shiva",
    "skills": [
        "Python",
        "SQL",
        "FastAPI",
    ],
}

print(student["skills"][0])


# ============================================================
# 47. MODIFY NESTED LIST
# ============================================================

student = {
    "name": "Shiva",
    "skills": [
        "Python",
        "SQL",
    ],
}

student["skills"].append("FastAPI")

print(student)


# ============================================================
# 48. LIST OF DICTIONARIES
# ============================================================

students = [
    {
        "name": "Shiva",
        "marks": 85,
    },
    {
        "name": "Ram",
        "marks": 72,
    },
    {
        "name": "Raj",
        "marks": 91,
    },
]

print(students)


# ============================================================
# 49. ACCESS LIST OF DICTIONARIES
# ============================================================

print(students[0]["name"])
print(students[1]["marks"])


# ============================================================
# 50. ITERATE LIST OF DICTIONARIES
# ============================================================

for student in students:
    print(
        student["name"],
        student["marks"],
    )


# ============================================================
# 51. FIND STUDENT
# ============================================================

students = [
    {
        "id": 1,
        "name": "Shiva",
    },
    {
        "id": 2,
        "name": "Ram",
    },
]

for student in students:

    if student["id"] == 2:
        print(student)


# ============================================================
# 52. DICTIONARY COMPREHENSION
# ============================================================

numbers = range(1, 6)

squares = {
    number: number ** 2
    for number in numbers
}

print(squares)


# ============================================================
# 53. DICTIONARY COMPREHENSION WITH CONDITION
# ============================================================

numbers = range(1, 11)

even_squares = {
    number: number ** 2
    for number in numbers
    if number % 2 == 0
}

print(even_squares)


# ============================================================
# 54. DICTIONARY FROM TWO LISTS
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Raj",
]

marks = [
    85,
    72,
    91,
]

students = dict(
    zip(names, marks)
)

print(students)


# ============================================================
# 55. zip()
# ============================================================

names = ["Shiva", "Ram"]
ages = [21, 22]

result = dict(
    zip(names, ages)
)

print(result)


# ============================================================
# 56. FROM PAIRS
# ============================================================

pairs = [
    ("name", "Shiva"),
    ("age", 21),
]

person = dict(pairs)

print(person)


# ============================================================
# 57. fromkeys()
# ============================================================

keys = [
    "name",
    "age",
    "branch",
]

person = dict.fromkeys(keys)

print(person)


# ============================================================
# 58. fromkeys() WITH DEFAULT
# ============================================================

keys = [
    "python",
    "sql",
    "fastapi",
]

skills = dict.fromkeys(
    keys,
    False,
)

print(skills)


# ============================================================
# 59. SET DEFAULT
# ============================================================

person = {
    "name": "Shiva",
}

age = person.setdefault(
    "age",
    21,
)

print(age)
print(person)


# ============================================================
# 60. setdefault() EXISTING KEY
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

age = person.setdefault(
    "age",
    100,
)

print(age)
print(person)


"""
setdefault() does NOT overwrite an existing key.
"""


# ============================================================
# 61. DICTIONARY UNPACKING
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

copy = {
    **person
}

print(copy)


# ============================================================
# 62. MERGE DICTIONARIES WITH **
# ============================================================

person = {
    "name": "Shiva",
}

details = {
    "age": 21,
    "branch": "CSE",
}

result = {
    **person,
    **details,
}

print(result)


# ============================================================
# 63. DUPLICATE KEY DURING UNPACKING
# ============================================================

a = {
    "name": "Shiva",
    "age": 21,
}

b = {
    "age": 22,
    "branch": "CSE",
}

result = {
    **a,
    **b,
}

print(result)


"""
If the same key appears multiple times,
the later value wins.

age -> 22
"""


# ============================================================
# 64. DICTIONARY MERGE OPERATOR
# ============================================================

a = {
    "name": "Shiva",
}

b = {
    "age": 21,
}

result = a | b

print(result)


# ============================================================
# 65. IN-PLACE DICTIONARY MERGE
# ============================================================

a = {
    "name": "Shiva",
}

b = {
    "age": 21,
}

a |= b

print(a)


# ============================================================
# 66. COPY VS MERGE
# ============================================================

person = {
    "name": "Shiva",
}

copy = person.copy()

merged = {
    **person
}

print(copy)
print(merged)


# ============================================================
# 67. DICTIONARY FILTERING
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

passed = {
    name: score
    for name, score in scores.items()
    if score >= 80
}

print(passed)


# ============================================================
# 68. TRANSFORM VALUES
# ============================================================

prices = {
    "apple": 100,
    "banana": 50,
    "orange": 80,
}

discounted = {
    fruit: price * 0.9
    for fruit, price in prices.items()
}

print(discounted)


# ============================================================
# 69. TRANSFORM KEYS
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

uppercase_keys = {
    key.upper(): value
    for key, value in person.items()
}

print(uppercase_keys)


# ============================================================
# 70. SWAP KEYS AND VALUES
# ============================================================

data = {
    "a": 1,
    "b": 2,
    "c": 3,
}

swapped = {
    value: key
    for key, value in data.items()
}

print(swapped)


"""
This only works safely when values are unique
and hashable.
"""


# ============================================================
# 71. REVERSE DICTIONARY WITH DUPLICATE VALUES
# ============================================================

data = {
    "a": 1,
    "b": 1,
    "c": 2,
}

swapped = {
    value: key
    for key, value in data.items()
}

print(swapped)


"""
The duplicate value 1 causes one key to overwrite another.
"""


# ============================================================
# 72. COUNT FREQUENCY
# ============================================================

numbers = [
    1,
    2,
    2,
    3,
    3,
    3,
]

frequency = {}

for number in numbers:

    frequency[number] = (
        frequency.get(number, 0) + 1
    )

print(frequency)


# ============================================================
# 73. COUNT WORD FREQUENCY
# ============================================================

text = "python java python go java python"

words = text.split()

frequency = {}

for word in words:

    frequency[word] = (
        frequency.get(word, 0) + 1
    )

print(frequency)


# ============================================================
# 74. COUNT CHARACTERS
# ============================================================

text = "banana"

frequency = {}

for character in text:

    frequency[character] = (
        frequency.get(character, 0) + 1
    )

print(frequency)


# ============================================================
# 75. collections.Counter
# ============================================================

from collections import Counter

text = "banana"

frequency = Counter(text)

print(frequency)


# ============================================================
# 76. COUNTER MOST COMMON
# ============================================================

text = "banana"

frequency = Counter(text)

print(frequency.most_common(2))


# ============================================================
# 77. GROUPING DATA
# ============================================================

students = [
    ("CSE", "Shiva"),
    ("ECE", "Ram"),
    ("CSE", "Raj"),
    ("ECE", "Kiran"),
]

groups = {}

for branch, name in students:

    groups.setdefault(
        branch,
        [],
    ).append(name)

print(groups)


# ============================================================
# 78. GROUPING WITH defaultdict
# ============================================================

from collections import defaultdict

students = [
    ("CSE", "Shiva"),
    ("ECE", "Ram"),
    ("CSE", "Raj"),
    ("ECE", "Kiran"),
]

groups = defaultdict(list)

for branch, name in students:
    groups[branch].append(name)

print(dict(groups))


# ============================================================
# 79. NESTED DICTIONARY
# ============================================================

users = {
    101: {
        "name": "Shiva",
        "role": "student",
    },
    102: {
        "name": "Ram",
        "role": "developer",
    },
}

print(users[101])


# ============================================================
# 80. DATABASE-LIKE RECORD
# ============================================================

user = {
    "_id": "user_001",
    "name": "Shiva",
    "email": "shiva@example.com",
    "age": 21,
    "active": True,
}

print(user)


# ============================================================
# 81. JSON-LIKE DATA
# ============================================================

response = {
    "success": True,
    "message": "User fetched successfully",
    "data": {
        "id": 101,
        "name": "Shiva",
    },
}

print(response)


# ============================================================
# 82. API RESPONSE
# ============================================================

def success_response(data):

    return {
        "success": True,
        "data": data,
    }


result = success_response(
    {
        "id": 101,
        "name": "Shiva",
    }
)

print(result)


# ============================================================
# 83. API ERROR RESPONSE
# ============================================================

def error_response(message):

    return {
        "success": False,
        "error": {
            "message": message,
        },
    }


result = error_response(
    "User not found"
)

print(result)


# ============================================================
# 84. SAFE NESTED ACCESS
# ============================================================

user = {
    "profile": {
        "name": "Shiva",
    }
}

name = user.get(
    "profile",
    {},
).get(
    "name"
)

print(name)


"""
This avoids KeyError when profile is missing.
"""


# ============================================================
# 85. DEEPLY NESTED ACCESS
# ============================================================

data = {
    "user": {
        "profile": {
            "address": {
                "city": "Guntur",
            }
        }
    }
}

city = (
    data
    .get("user", {})
    .get("profile", {})
    .get("address", {})
    .get("city")
)

print(city)


# ============================================================
# 86. DICTIONARY WITH LIST OF DICTIONARIES
# ============================================================

response = {
    "users": [
        {
            "id": 1,
            "name": "Shiva",
        },
        {
            "id": 2,
            "name": "Ram",
        },
    ]
}

for user in response["users"]:
    print(user["name"])


# ============================================================
# 87. API PAGINATION RESPONSE
# ============================================================

response = {
    "data": [
        {
            "id": 1,
            "name": "Shiva",
        },
        {
            "id": 2,
            "name": "Ram",
        },
    ],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 2,
    },
}

print(response)


# ============================================================
# 88. CONFIGURATION DICTIONARY
# ============================================================

config = {
    "host": "localhost",
    "port": 8000,
    "debug": True,
}

print(config)


# ============================================================
# 89. ENVIRONMENT-LIKE CONFIG
# ============================================================

config = {
    "database": {
        "host": "localhost",
        "port": 27017,
        "name": "app",
    },
    "server": {
        "host": "0.0.0.0",
        "port": 8000,
    },
}

print(config["database"]["port"])


# ============================================================
# 90. CACHE
# ============================================================

cache = {}

cache["user:101"] = {
    "id": 101,
    "name": "Shiva",
}

print(cache)


# ============================================================
# 91. CACHE LOOKUP
# ============================================================

cache = {
    "user:101": {
        "id": 101,
        "name": "Shiva",
    }
}

key = "user:101"

if key in cache:
    print("Cache hit")
    print(cache[key])
else:
    print("Cache miss")


# ============================================================
# 92. DEFAULT VALUES
# ============================================================

settings = {
    "theme": "dark",
}

theme = settings.get(
    "theme",
    "light",
)

language = settings.get(
    "language",
    "en",
)

print(theme)
print(language)


# ============================================================
# 93. REQUIRED KEYS
# ============================================================

required_fields = {
    "name",
    "email",
    "age",
}

user = {
    "name": "Shiva",
    "email": "shiva@example.com",
}

missing = required_fields - user.keys()

print("Missing:", missing)


"""
Dictionary keys support set-like operations.
"""


# ============================================================
# 94. FIND EXTRA KEYS
# ============================================================

allowed_fields = {
    "name",
    "email",
}

user = {
    "name": "Shiva",
    "email": "shiva@example.com",
    "password": "secret",
}

extra = user.keys() - allowed_fields

print(extra)


# ============================================================
# 95. DICTIONARY KEYS VIEW
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

keys = person.keys()

print(keys)

person["branch"] = "CSE"

print(keys)


"""
keys() returns a dynamic view.

It reflects changes to the dictionary.
"""


# ============================================================
# 96. VALUES VIEW
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

values = person.values()

print(values)


# ============================================================
# 97. ITEMS VIEW
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

items = person.items()

print(items)


# ============================================================
# 98. DICTIONARY EQUALITY
# ============================================================

a = {
    "name": "Shiva",
    "age": 21,
}

b = {
    "age": 21,
    "name": "Shiva",
}

print(a == b)


"""
Dictionary equality does not depend on insertion order.
"""


# ============================================================
# 99. DICTIONARY LENGTH
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(len(person))


# ============================================================
# 100. SORT DICTIONARY KEYS
# ============================================================

person = {
    "z": 1,
    "a": 2,
    "m": 3,
}

for key in sorted(person):
    print(key, person[key])


# ============================================================
# 101. SORT BY VALUE
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

sorted_scores = sorted(
    scores.items(),
    key=lambda item: item[1],
)

print(sorted_scores)


"""
sorted() returns a list of tuples.
"""


# ============================================================
# 102. SORT BY VALUE DESCENDING
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

sorted_scores = sorted(
    scores.items(),
    key=lambda item: item[1],
    reverse=True,
)

print(sorted_scores)


# ============================================================
# 103. CREATE DICTIONARY AFTER SORTING
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

sorted_scores = dict(
    sorted(
        scores.items(),
        key=lambda item: item[1],
        reverse=True,
    )
)

print(sorted_scores)


# ============================================================
# 104. MINIMUM VALUE
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

minimum = min(
    scores,
    key=scores.get,
)

print(minimum)


# ============================================================
# 105. MAXIMUM VALUE
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

maximum = max(
    scores,
    key=scores.get,
)

print(maximum)


# ============================================================
# 106. FIND MAX VALUE + KEY
# ============================================================

scores = {
    "Shiva": 85,
    "Ram": 72,
    "Raj": 91,
}

name, score = max(
    scores.items(),
    key=lambda item: item[1],
)

print(name)
print(score)


# ============================================================
# 107. ANY()
# ============================================================

numbers = {
    "a": 0,
    "b": 0,
}

print(any(numbers.values()))


# ============================================================
# 108. ALL()
# ============================================================

permissions = {
    "read": True,
    "write": True,
    "delete": True,
}

print(all(permissions.values()))


# ============================================================
# 109. DICTIONARY TRUTHINESS
# ============================================================

data = {}

if data:
    print("Dictionary is not empty")
else:
    print("Dictionary is empty")


# ============================================================
# 110. CHECK EMPTY DICTIONARY
# ============================================================

data = {}

if not data:
    print("Empty")


# ============================================================
# 111. DICTIONARY COMPREHENSION
# ============================================================

words = [
    "python",
    "fastapi",
    "mongodb",
]

lengths = {
    word: len(word)
    for word in words
}

print(lengths)


# ============================================================
# 112. DICTIONARY COMPREHENSION WITH IF
# ============================================================

numbers = range(1, 11)

even_numbers = {
    number: number ** 2
    for number in numbers
    if number % 2 == 0
}

print(even_numbers)


# ============================================================
# 113. DICTIONARY COMPREHENSION WITH IF/ELSE
# ============================================================

numbers = range(1, 6)

result = {
    number: "even" if number % 2 == 0 else "odd"
    for number in numbers
}

print(result)


# ============================================================
# 114. MERGE MULTIPLE DICTIONARIES
# ============================================================

a = {"name": "Shiva"}
b = {"age": 21}
c = {"branch": "CSE"}

result = a | b | c

print(result)


# ============================================================
# 115. MERGE WITH **
# ============================================================

a = {"name": "Shiva"}
b = {"age": 21}
c = {"branch": "CSE"}

result = {
    **a,
    **b,
    **c,
}

print(result)


# ============================================================
# 116. DICTIONARY AS FUNCTION ARGUMENTS
# ============================================================

def introduce(name, age, branch):

    print(
        f"{name} is {age} years old "
        f"and studies {branch}."
    )


student = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

introduce(**student)


"""
** unpacks dictionary keys into keyword arguments.
"""


# ============================================================
# 117. FUNCTION **kwargs
# ============================================================

def show_details(**kwargs):

    print(kwargs)
    print(type(kwargs))


show_details(
    name="Shiva",
    age=21,
    branch="CSE",
)


"""
**kwargs collects keyword arguments
into a dictionary.
"""


# ============================================================
# 118. *args AND **kwargs
# ============================================================

def example(*args, **kwargs):

    print("args:", args)
    print("kwargs:", kwargs)


example(
    10,
    20,
    name="Shiva",
    age=21,
)


"""
args   -> tuple
kwargs -> dictionary
"""


# ============================================================
# 119. JSON
# ============================================================

import json

person = {
    "name": "Shiva",
    "age": 21,
}

json_string = json.dumps(person)

print(json_string)
print(type(json_string))


"""
Python dictionary
        ↓
json.dumps()
        ↓
JSON string
"""


# ============================================================
# 120. JSON STRING TO DICTIONARY
# ============================================================

json_string = """
{
    "name": "Shiva",
    "age": 21
}
"""

person = json.loads(json_string)

print(person)
print(type(person))


"""
JSON string
    ↓
json.loads()
    ↓
Python dictionary
"""


# ============================================================
# 121. JSON PRETTY PRINT
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
    "skills": [
        "Python",
        "FastAPI",
    ],
}

print(
    json.dumps(
        person,
        indent=4,
    )
)


# ============================================================
# 122. JSON SAFE DATA
# ============================================================

data = {
    "name": "Shiva",
    "age": 21,
    "active": True,
    "skills": [
        "Python",
        "SQL",
    ],
    "metadata": None,
}

print(
    json.dumps(data)
)


"""
These Python values map naturally to JSON:

dict    -> object
list    -> array
str     -> string
int     -> number
float   -> number
True    -> true
False   -> false
None    -> null
"""


# ============================================================
# 123. DATABASE DOCUMENT STYLE
# ============================================================

user_document = {
    "_id": "65abc123",
    "name": "Shiva",
    "email": "shiva@example.com",
    "skills": [
        "Python",
        "FastAPI",
        "MongoDB",
    ],
    "profile": {
        "age": 21,
        "branch": "CSE",
    },
}

print(user_document)


"""
This dictionary structure is very similar to
a MongoDB document.
"""


# ============================================================
# 124. UPDATE NESTED DATABASE DOCUMENT
# ============================================================

user_document = {
    "name": "Shiva",
    "profile": {
        "age": 21,
        "branch": "CSE",
    },
}

user_document["profile"]["age"] = 22

print(user_document)


# ============================================================
# 125. DICTIONARY AS REQUEST BODY
# ============================================================

request_body = {
    "username": "shiva",
    "email": "shiva@example.com",
    "password": "password",
}

print(request_body)


# ============================================================
# 126. VALIDATE REQUIRED FIELDS
# ============================================================

request_body = {
    "username": "shiva",
    "email": "shiva@example.com",
}

required = {
    "username",
    "email",
    "password",
}

missing = required - request_body.keys()

if missing:
    print(
        "Missing fields:",
        missing,
    )


# ============================================================
# 127. REMOVE SENSITIVE FIELD
# ============================================================

user = {
    "name": "Shiva",
    "email": "shiva@example.com",
    "password": "secret",
}

safe_user = user.copy()

safe_user.pop(
    "password",
    None,
)

print(safe_user)


# ============================================================
# 128. TRANSFORM DATABASE RECORD
# ============================================================

user = {
    "_id": "123",
    "name": "Shiva",
    "email": "shiva@example.com",
    "password": "secret",
}

response = {
    "id": user["_id"],
    "name": user["name"],
    "email": user["email"],
}

print(response)


# ============================================================
# 129. DICTIONARY LOOKUP TABLE
# ============================================================

status_messages = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    404: "Not Found",
    500: "Internal Server Error",
}

status = 404

print(
    status_messages.get(
        status,
        "Unknown status",
    )
)


# ============================================================
# 130. REPLACE LONG IF/ELIF WITH DICTIONARY
# ============================================================

operations = {
    "add": lambda a, b: a + b,
    "subtract": lambda a, b: a - b,
    "multiply": lambda a, b: a * b,
}

operation = "add"

result = operations[operation](10, 5)

print(result)


"""
Dictionaries can act as dispatch tables.
"""


# ============================================================
# 131. NESTED CONFIGURATION
# ============================================================

config = {
    "app": {
        "name": "Python API",
        "debug": True,
    },
    "database": {
        "host": "localhost",
        "port": 27017,
    },
    "server": {
        "host": "0.0.0.0",
        "port": 8000,
    },
}

print(config)


# ============================================================
# 132. DICTIONARY FILTERING
# ============================================================

users = {
    101: {
        "name": "Shiva",
        "active": True,
    },
    102: {
        "name": "Ram",
        "active": False,
    },
    103: {
        "name": "Raj",
        "active": True,
    },
}

active_users = {
    user_id: user
    for user_id, user in users.items()
    if user["active"]
}

print(active_users)


# ============================================================
# 133. FIND USER BY ID
# ============================================================

users = {
    101: {
        "name": "Shiva",
    },
    102: {
        "name": "Ram",
    },
}

user = users.get(101)

print(user)


# ============================================================
# 134. FAST LOOKUP
# ============================================================

users = {
    "user_101": "Shiva",
    "user_102": "Ram",
}

print(users["user_101"])


"""
Dictionaries are designed for efficient
key-based lookup.
"""


# ============================================================
# 135. NESTED UPDATE USING setdefault()
# ============================================================

data = {}

data.setdefault(
    "users",
    [],
).append(
    {
        "name": "Shiva",
    }
)

print(data)


# ============================================================
# 136. GROUPING WITH setdefault()
# ============================================================

employees = [
    ("engineering", "Shiva"),
    ("sales", "Ram"),
    ("engineering", "Raj"),
]

groups = {}

for department, employee in employees:

    groups.setdefault(
        department,
        [],
    ).append(employee)

print(groups)


# ============================================================
# 137. defaultdict
# ============================================================

from collections import defaultdict

groups = defaultdict(list)

groups["engineering"].append("Shiva")
groups["engineering"].append("Raj")
groups["sales"].append("Ram")

print(dict(groups))


# ============================================================
# 138. defaultdict(int) FOR COUNTER
# ============================================================

numbers = [1, 2, 2, 3, 3, 3]

counter = defaultdict(int)

for number in numbers:
    counter[number] += 1

print(dict(counter))


# ============================================================
# 139. defaultdict(set)
# ============================================================

groups = defaultdict(set)

groups["python"].add("Shiva")
groups["python"].add("Raj")
groups["python"].add("Shiva")

print(dict(groups))


# ============================================================
# 140. DICTIONARY OF FUNCTIONS
# ============================================================

def add(a, b):
    return a + b


def multiply(a, b):
    return a * b


operations = {
    "add": add,
    "multiply": multiply,
}

print(
    operations["add"](10, 20)
)

print(
    operations["multiply"](10, 20)
)


# ============================================================
# 141. DICTIONARY OF CLASSES / OBJECTS
# ============================================================

class User:

    def __init__(self, name):
        self.name = name


users = {
    101: User("Shiva"),
    102: User("Ram"),
}

print(users[101].name)


# ============================================================
# 142. DICTIONARY KEYS AS ENUM-LIKE VALUES
# ============================================================

ROLE_PERMISSIONS = {
    "admin": {
        "read",
        "write",
        "delete",
    },
    "user": {
        "read",
    },
    "guest": {
        "read",
    },
}

print(
    ROLE_PERMISSIONS["admin"]
)


# ============================================================
# 143. CHECK ROLE PERMISSION
# ============================================================

ROLE_PERMISSIONS = {
    "admin": {"read", "write", "delete"},
    "user": {"read"},
}

role = "user"
permission = "write"

if permission in ROLE_PERMISSIONS.get(
    role,
    set(),
):
    print("Allowed")
else:
    print("Denied")


# ============================================================
# 144. DICTIONARY MERGING WITH CONFLICT
# ============================================================

default_config = {
    "host": "localhost",
    "port": 8000,
    "debug": False,
}

user_config = {
    "port": 9000,
    "debug": True,
}

config = {
    **default_config,
    **user_config,
}

print(config)


"""
Later values override earlier values.

This pattern is extremely common for configuration.
"""


# ============================================================
# 145. IMMUTABLE MAPPING
# ============================================================

from types import MappingProxyType

config = {
    "host": "localhost",
    "port": 8000,
}

readonly_config = MappingProxyType(config)

print(readonly_config["host"])

# readonly_config["port"] = 9000


"""
MappingProxyType creates a read-only view
of a dictionary.

The original dictionary can still be modified.
"""


# ============================================================
# 146. DICTIONARY VIEW CONVERSION
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

keys = list(person.keys())
values = list(person.values())
items = list(person.items())

print(keys)
print(values)
print(items)


# ============================================================
# 147. DICTIONARY FROM ZIP
# ============================================================

fields = [
    "name",
    "age",
    "branch",
]

values = [
    "Shiva",
    21,
    "CSE",
]

person = dict(
    zip(fields, values)
)

print(person)


# ============================================================
# 148. ZIP WITH UNEQUAL LENGTH
# ============================================================

keys = [
    "name",
    "age",
]

values = [
    "Shiva",
    21,
    "CSE",
]

person = dict(
    zip(keys, values)
)

print(person)


"""
zip() stops when the shortest iterable ends.
"""


# ============================================================
# 149. DICTIONARY COMPREHENSION FROM LIST
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Raj",
]

name_lengths = {
    name: len(name)
    for name in names
}

print(name_lengths)


# ============================================================
# 150. DICTIONARY CHEAT SHEET
# ============================================================

"""
CREATE
======

{}

{
    "name": "Shiva"
}

dict(name="Shiva")


ACCESS
======

data["name"]

data.get("name")

data.get("name", default)


ADD / UPDATE
============

data["name"] = "Shiva"

data.update({
    "age": 21
})


DELETE
======

del data["name"]

data.pop("name")

data.pop("name", default)

data.popitem()

data.clear()


ITERATION
=========

for key in data:
    ...

for value in data.values():
    ...

for key, value in data.items():
    ...


VIEWS
=====

data.keys()

data.values()

data.items()


CHECK
=====

key in data

key not in data


COPY
====

data.copy()

copy.deepcopy(data)


MERGE
=====

a | b

a |= b

{**a, **b}


COMPREHENSION
=============

{
    key: value
    for key, value in iterable
}


CONSTRUCTORS
============

dict()

dict.fromkeys()

dict(zip(keys, values))


DEFAULT
=======

setdefault()


COLLECTIONS
===========

Counter
defaultdict


FUNCTION ARGUMENTS
==================

**data

**kwargs


JSON
====

json.dumps()
json.loads()


IMPORTANT
=========

Dictionary:

    key -> value

Keys:

    must be hashable
    must be unique

Values:

    can be almost anything

Dictionary:

    mutable
    insertion ordered
    optimized for key lookup
"""


# ============================================================
# END
# ============================================================