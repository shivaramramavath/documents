"""
Python Sets
===========

A set is an unordered collection of unique elements.

Sets are:

    - unordered
    - mutable
    - contain unique values
    - iterable
    - do not support indexing
    - do not support slicing
    - very useful for membership testing
    - very useful for mathematical set operations

Example:

    {1, 2, 3}
"""


# ============================================================
# 1. CREATING A SET
# ============================================================

numbers = {10, 20, 30, 40}

print(numbers)


# ============================================================
# 2. EMPTY SET
# ============================================================

empty_set = set()

print(empty_set)
print(type(empty_set))


"""
IMPORTANT:

{} creates an EMPTY DICTIONARY.

set() creates an EMPTY SET.
"""


# ============================================================
# 3. SET WITH DUPLICATES
# ============================================================

numbers = {10, 20, 20, 30, 30, 30}

print(numbers)


"""
Duplicates are automatically removed.
"""


# ============================================================
# 4. SET DATA TYPES
# ============================================================

data = {
    10,
    20.5,
    "Python",
    True,
}

print(data)


# ============================================================
# 5. SET LENGTH
# ============================================================

numbers = {10, 20, 30}

print(len(numbers))


# ============================================================
# 6. MEMBERSHIP
# ============================================================

numbers = {10, 20, 30}

print(20 in numbers)
print(100 in numbers)

print(20 not in numbers)


"""
Membership testing is one of the major reasons
sets are useful.
"""


# ============================================================
# 7. SETS DO NOT SUPPORT INDEXING
# ============================================================

numbers = {10, 20, 30}

# print(numbers[0])


"""
This raises TypeError.

Sets are unordered and therefore do not support
index-based access.
"""


# ============================================================
# 8. SETS DO NOT SUPPORT SLICING
# ============================================================

numbers = {10, 20, 30, 40}

# print(numbers[1:3])


# ============================================================
# 9. ITERATING OVER A SET
# ============================================================

numbers = {10, 20, 30}

for number in numbers:
    print(number)


"""
Do not depend on the iteration order of a set.
"""


# ============================================================
# 10. add()
# ============================================================

numbers = {10, 20, 30}

numbers.add(40)

print(numbers)


# ============================================================
# 11. add() DUPLICATE
# ============================================================

numbers = {10, 20, 30}

numbers.add(20)

print(numbers)


"""
Adding an existing value does nothing.
"""


# ============================================================
# 12. update()
# ============================================================

numbers = {10, 20}

numbers.update(
    [30, 40, 50]
)

print(numbers)


# ============================================================
# 13. update() WITH SET
# ============================================================

numbers = {1, 2}

numbers.update(
    {3, 4, 5}
)

print(numbers)


# ============================================================
# 14. update() WITH TUPLE
# ============================================================

numbers = {1, 2}

numbers.update(
    (3, 4, 5)
)

print(numbers)


# ============================================================
# 15. update() WITH STRING
# ============================================================

letters = {"a", "b"}

letters.update("python")

print(letters)


"""
A string is iterable, so update()
adds its individual characters.
"""


# ============================================================
# 16. remove()
# ============================================================

numbers = {10, 20, 30}

numbers.remove(20)

print(numbers)


# ============================================================
# 17. remove() MISSING VALUE
# ============================================================

numbers = {10, 20, 30}

# numbers.remove(100)


"""
remove() raises KeyError if the element
does not exist.
"""


# ============================================================
# 18. discard()
# ============================================================

numbers = {10, 20, 30}

numbers.discard(20)

print(numbers)


# ============================================================
# 19. discard() MISSING VALUE
# ============================================================

numbers = {10, 20, 30}

numbers.discard(100)

print(numbers)


"""
discard() does NOT raise an error
if the element doesn't exist.
"""


# ============================================================
# 20. pop()
# ============================================================

numbers = {10, 20, 30}

value = numbers.pop()

print("Removed:", value)
print("Remaining:", numbers)


"""
set.pop() removes and returns an arbitrary element.

Do NOT expect a particular element.
"""


# ============================================================
# 21. clear()
# ============================================================

numbers = {10, 20, 30}

numbers.clear()

print(numbers)


# ============================================================
# 22. copy()
# ============================================================

numbers = {10, 20, 30}

copy = numbers.copy()

print(copy)


# ============================================================
# 23. SHALLOW COPY
# ============================================================

original = {1, 2, 3}

copy = original.copy()

copy.add(4)

print("Original:", original)
print("Copy:", copy)


# ============================================================
# 24. UNION
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

result = a | b

print(result)


"""
Union contains elements from BOTH sets.
"""


# ============================================================
# 25. union()
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

result = a.union(b)

print(result)


# ============================================================
# 26. UNION WITH MULTIPLE SETS
# ============================================================

a = {1, 2}
b = {2, 3}
c = {3, 4}

result = a.union(b, c)

print(result)


# ============================================================
# 27. UNION OPERATOR
# ============================================================

a = {1, 2}
b = {3, 4}

result = a | b

print(result)


# ============================================================
# 28. INTERSECTION
# ============================================================

a = {1, 2, 3}
b = {2, 3, 4}

result = a & b

print(result)


"""
Intersection contains elements common
to BOTH sets.
"""


# ============================================================
# 29. intersection()
# ============================================================

a = {1, 2, 3}
b = {2, 3, 4}

result = a.intersection(b)

print(result)


# ============================================================
# 30. INTERSECTION MULTIPLE SETS
# ============================================================

a = {1, 2, 3, 4}
b = {2, 3, 4, 5}
c = {3, 4, 5, 6}

result = a.intersection(b, c)

print(result)


# ============================================================
# 31. DIFFERENCE
# ============================================================

a = {1, 2, 3, 4}
b = {3, 4, 5}

result = a - b

print(result)


"""
a - b means:

Elements present in a
but NOT present in b.
"""


# ============================================================
# 32. difference()
# ============================================================

a = {1, 2, 3, 4}
b = {3, 4, 5}

result = a.difference(b)

print(result)


# ============================================================
# 33. REVERSE DIFFERENCE
# ============================================================

a = {1, 2, 3, 4}
b = {3, 4, 5}

print(b - a)


# ============================================================
# 34. SYMMETRIC DIFFERENCE
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

result = a ^ b

print(result)


"""
Symmetric difference means:

Elements that are in either set,
but NOT in both.
"""


# ============================================================
# 35. symmetric_difference()
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

result = a.symmetric_difference(b)

print(result)


# ============================================================
# 36. SET RELATIONSHIPS
# ============================================================

a = {1, 2, 3}
b = {1, 2, 3, 4, 5}

print(a <= b)


# a is a subset of b.


# ============================================================
# 37. issubset()
# ============================================================

a = {1, 2}
b = {1, 2, 3, 4}

print(a.issubset(b))


# ============================================================
# 38. PROPER SUBSET
# ============================================================

a = {1, 2}
b = {1, 2, 3}

print(a < b)


"""
a < b means:

a is a proper subset of b.
"""


# ============================================================
# 39. SUPERSET
# ============================================================

a = {1, 2, 3, 4}
b = {1, 2}

print(a.issuperset(b))


# ============================================================
# 40. SUPERSET OPERATOR
# ============================================================

a = {1, 2, 3}
b = {1, 2}

print(a >= b)


# ============================================================
# 41. PROPER SUPERSET
# ============================================================

a = {1, 2, 3}
b = {1, 2}

print(a > b)


# ============================================================
# 42. DISJOINT SETS
# ============================================================

a = {1, 2, 3}
b = {4, 5, 6}

print(a.isdisjoint(b))


"""
isdisjoint() returns True when
the sets have NO common elements.
"""


# ============================================================
# 43. NOT DISJOINT
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

print(a.isdisjoint(b))


# ============================================================
# 44. SET COMPARISON
# ============================================================

a = {1, 2, 3}
b = {3, 2, 1}

print(a == b)


"""
Order does not matter for set equality.
"""


# ============================================================
# 45. SET INEQUALITY
# ============================================================

a = {1, 2, 3}
b = {1, 2}

print(a != b)


# ============================================================
# 46. SET MUTATING UNION
# ============================================================

a = {1, 2, 3}

a.update({3, 4, 5})

print(a)


"""
update() modifies the original set.

It is effectively a mutating union.
"""


# ============================================================
# 47. intersection_update()
# ============================================================

a = {1, 2, 3, 4}
b = {3, 4, 5}

a.intersection_update(b)

print(a)


"""
Only common elements remain in a.
"""


# ============================================================
# 48. difference_update()
# ============================================================

a = {1, 2, 3, 4}
b = {3, 4}

a.difference_update(b)

print(a)


"""
Elements found in b are removed from a.
"""


# ============================================================
# 49. symmetric_difference_update()
# ============================================================

a = {1, 2, 3}
b = {3, 4, 5}

a.symmetric_difference_update(b)

print(a)


# ============================================================
# 50. UNION DOES NOT MODIFY ORIGINAL
# ============================================================

a = {1, 2}
b = {3, 4}

result = a.union(b)

print("a:", a)
print("b:", b)
print("result:", result)


# ============================================================
# 51. INTERSECTION DOES NOT MODIFY ORIGINAL
# ============================================================

a = {1, 2, 3}
b = {2, 3, 4}

result = a.intersection(b)

print("a:", a)
print("result:", result)


# ============================================================
# 52. DIFFERENCE DOES NOT MODIFY ORIGINAL
# ============================================================

a = {1, 2, 3}
b = {2}

result = a.difference(b)

print("a:", a)
print("result:", result)


# ============================================================
# 53. SET COMPREHENSION
# ============================================================

numbers = range(1, 6)

squares = {
    number ** 2
    for number in numbers
}

print(squares)


# ============================================================
# 54. SET COMPREHENSION WITH CONDITION
# ============================================================

numbers = range(1, 11)

even_numbers = {
    number
    for number in numbers
    if number % 2 == 0
}

print(even_numbers)


# ============================================================
# 55. SET COMPREHENSION — TRANSFORMATION
# ============================================================

names = [
    "shiva",
    "ram",
    "raj",
]

uppercase_names = {
    name.upper()
    for name in names
}

print(uppercase_names)


# ============================================================
# 56. SET COMPREHENSION — LENGTH
# ============================================================

words = [
    "python",
    "java",
    "go",
    "javascript",
]

lengths = {
    len(word)
    for word in words
}

print(lengths)


"""
Notice:

Duplicate lengths are automatically removed.
"""


# ============================================================
# 57. REMOVE DUPLICATES FROM LIST
# ============================================================

numbers = [
    10,
    20,
    20,
    30,
    30,
    30,
]

unique_numbers = set(numbers)

print(unique_numbers)


# ============================================================
# 58. LIST → SET → LIST
# ============================================================

numbers = [
    10,
    20,
    20,
    30,
    30,
]

unique_numbers = list(set(numbers))

print(unique_numbers)


"""
Important:

This removes duplicates,
but does NOT guarantee the original order.
"""


# ============================================================
# 59. REMOVE DUPLICATES WHILE PRESERVING ORDER
# ============================================================

numbers = [
    10,
    20,
    20,
    30,
    10,
]

unique_numbers = list(
    dict.fromkeys(numbers)
)

print(unique_numbers)


"""
For order-preserving deduplication,
dict.fromkeys() is a common Python technique.
"""


# ============================================================
# 60. FIND COMMON ELEMENTS
# ============================================================

frontend = {
    "HTML",
    "CSS",
    "JavaScript",
    "React",
}

backend = {
    "Python",
    "JavaScript",
    "FastAPI",
    "React",
}

common = frontend & backend

print(common)


# ============================================================
# 61. FIND ONLY FRONTEND TECHNOLOGIES
# ============================================================

frontend = {
    "HTML",
    "CSS",
    "JavaScript",
    "React",
}

backend = {
    "Python",
    "JavaScript",
    "FastAPI",
    "React",
}

only_frontend = frontend - backend

print(only_frontend)


# ============================================================
# 62. FIND ALL TECHNOLOGIES
# ============================================================

all_technologies = frontend | backend

print(all_technologies)


# ============================================================
# 63. FIND UNIQUE TO EACH GROUP
# ============================================================

unique = frontend ^ backend

print(unique)


# ============================================================
# 64. CHECK REQUIRED PERMISSIONS
# ============================================================

required_permissions = {
    "read",
    "write",
}

user_permissions = {
    "read",
    "write",
    "delete",
}

if required_permissions.issubset(user_permissions):
    print("Permission granted")
else:
    print("Permission denied")


# ============================================================
# 65. FIND MISSING PERMISSIONS
# ============================================================

required_permissions = {
    "read",
    "write",
    "delete",
}

user_permissions = {
    "read",
    "write",
}

missing = required_permissions - user_permissions

print("Missing:", missing)


# ============================================================
# 66. CHECK ANY COMMON ROLE
# ============================================================

user_roles = {
    "student",
    "developer",
}

allowed_roles = {
    "admin",
    "developer",
}

if user_roles & allowed_roles:
    print("Access allowed")
else:
    print("Access denied")


# ============================================================
# 67. FIND DUPLICATE WORDS
# ============================================================

words = [
    "python",
    "java",
    "python",
    "go",
    "java",
]

duplicates = {
    word
    for word in words
    if words.count(word) > 1
}

print(duplicates)


"""
For large datasets, using count() repeatedly is inefficient.

Later, learn collections.Counter for this problem.
"""


# ============================================================
# 68. FIND UNIQUE CHARACTERS
# ============================================================

text = "banana"

characters = set(text)

print(characters)


# ============================================================
# 69. CHECK UNIQUE CHARACTERS
# ============================================================

text = "python"

if len(set(text)) == len(text):
    print("All characters are unique")
else:
    print("Duplicate characters found")


# ============================================================
# 70. CHECK DUPLICATES IN LIST
# ============================================================

numbers = [1, 2, 3, 4, 5]

if len(numbers) == len(set(numbers)):
    print("No duplicates")
else:
    print("Duplicates exist")


# ============================================================
# 71. REMOVE DUPLICATE WORDS
# ============================================================

text = "python java python go java"

words = text.split()

unique_words = set(words)

print(unique_words)


# ============================================================
# 72. CASE-INSENSITIVE UNIQUE WORDS
# ============================================================

text = "Python python PYTHON Java java"

words = text.casefold().split()

unique_words = set(words)

print(unique_words)


# ============================================================
# 73. SET FROM RANGE
# ============================================================

numbers = set(range(1, 6))

print(numbers)


# ============================================================
# 74. SET OF EVEN NUMBERS
# ============================================================

even_numbers = set(
    range(2, 11, 2)
)

print(even_numbers)


# ============================================================
# 75. SET CONSTRUCTOR
# ============================================================

values = set(
    [1, 2, 3, 3, 4]
)

print(values)


# ============================================================
# 76. SET WITH TUPLES
# ============================================================

points = {
    (10, 20),
    (30, 40),
    (50, 60),
}

print(points)


"""
Tuples can be set elements if they are hashable.
"""


# ============================================================
# 77. SET WITH LIST — NOT ALLOWED
# ============================================================

# values = {
#     [1, 2, 3]
# }


"""
This raises TypeError.

Lists are mutable and therefore unhashable.
"""


# ============================================================
# 78. SET WITH FROZEN TUPLE
# ============================================================

data = {
    (1, 2),
    (3, 4),
}

print(data)


# ============================================================
# 79. FROZENSET
# ============================================================

numbers = frozenset(
    [1, 2, 3, 4]
)

print(numbers)
print(type(numbers))


"""
frozenset is an immutable set.
"""


# ============================================================
# 80. FROZENSET CANNOT BE MODIFIED
# ============================================================

numbers = frozenset(
    [1, 2, 3]
)

# numbers.add(4)


"""
frozenset does not support:

    add()
    remove()
    discard()
    pop()
    clear()
    update()

because it is immutable.
"""


# ============================================================
# 81. FROZENSET OPERATIONS
# ============================================================

a = frozenset([1, 2, 3])
b = frozenset([3, 4, 5])

print(a | b)
print(a & b)
print(a - b)
print(a ^ b)


# ============================================================
# 82. FROZENSET AS SET ELEMENT
# ============================================================

nested_sets = {
    frozenset({1, 2}),
    frozenset({3, 4}),
}

print(nested_sets)


"""
A normal set cannot contain another set.

A frozenset can.
"""


# ============================================================
# 83. FROZENSET AS DICTIONARY KEY
# ============================================================

groups = {
    frozenset({"admin", "user"}): "Group A",
    frozenset({"guest"}): "Group B",
}

print(groups)


# ============================================================
# 84. SET HASHABILITY
# ============================================================

numbers = {1, 2, 3}

# hash(numbers)


"""
Normal sets are mutable and therefore unhashable.
"""


# ============================================================
# 85. FROZENSET HASHABILITY
# ============================================================

numbers = frozenset([1, 2, 3])

print(hash(numbers))


# ============================================================
# 86. SET COPY
# ============================================================

a = {1, 2, 3}

b = a.copy()

print(a)
print(b)


# ============================================================
# 87. SET METHODS SUMMARY
# ============================================================

"""
MODIFICATION
============

add()
update()

remove()
discard()
pop()
clear()

copy()


SET OPERATIONS
==============

union()
intersection()
difference()
symmetric_difference()

|
&
-
^


MUTATING OPERATIONS
===================

intersection_update()
difference_update()
symmetric_difference_update()


RELATIONSHIPS
=============

issubset()
issuperset()
isdisjoint()

<
<=
>
>=


OTHER
=====

len()
in
not in


IMMUTABLE SET
=============

frozenset()
"""


# ============================================================
# 88. OPERATOR CHEAT SHEET
# ============================================================

"""
a | b
-----
UNION

Elements in a OR b


a & b
-----
INTERSECTION

Elements in BOTH


a - b
-----
DIFFERENCE

Elements in a but not b


a ^ b
-----
SYMMETRIC DIFFERENCE

Elements in either a or b,
but not both
"""


# ============================================================
# 89. PRACTICAL — USER INTERESTS
# ============================================================

user1 = {
    "python",
    "sql",
    "react",
}

user2 = {
    "python",
    "fastapi",
    "sql",
}

common_interests = user1 & user2

print(common_interests)


# ============================================================
# 90. PRACTICAL — RECOMMENDATION
# ============================================================

user_skills = {
    "python",
    "sql",
}

job_required = {
    "python",
    "sql",
    "fastapi",
}

missing_skills = job_required - user_skills

print("Learn:", missing_skills)


# ============================================================
# 91. PRACTICAL — COURSE PREREQUISITES
# ============================================================

completed = {
    "python",
    "sql",
    "git",
}

required = {
    "python",
    "sql",
}

if required <= completed:
    print("Course unlocked")
else:
    print("Complete prerequisites")


# ============================================================
# 92. PRACTICAL — BLOCKED USERS
# ============================================================

blocked_users = {
    101,
    102,
    103,
}

user_id = 102

if user_id in blocked_users:
    print("User blocked")
else:
    print("User allowed")


# ============================================================
# 93. PRACTICAL — UNIQUE TAGS
# ============================================================

posts = [
    ["python", "backend"],
    ["python", "fastapi"],
    ["ai", "python"],
]

tags = set()

for post_tags in posts:
    tags.update(post_tags)

print(tags)


# ============================================================
# 94. PRACTICAL — COMMON TAGS
# ============================================================

post1_tags = {
    "python",
    "ai",
    "backend",
}

post2_tags = {
    "python",
    "fastapi",
    "backend",
}

common_tags = post1_tags & post2_tags

print(common_tags)


# ============================================================
# 95. PRACTICAL — UNIQUE TAGS
# ============================================================

post1_tags = {
    "python",
    "ai",
    "backend",
}

post2_tags = {
    "python",
    "fastapi",
    "backend",
}

unique_tags = post1_tags ^ post2_tags

print(unique_tags)


# ============================================================
# 96. PRACTICAL — DUPLICATE DETECTION
# ============================================================

emails = [
    "a@example.com",
    "b@example.com",
    "a@example.com",
]

if len(emails) != len(set(emails)):
    print("Duplicate email found")


# ============================================================
# 97. PRACTICAL — CASE-INSENSITIVE EMAIL DUPLICATES
# ============================================================

emails = [
    "Shiva@example.com",
    "shiva@example.com",
    "ram@example.com",
]

normalized_emails = {
    email.casefold()
    for email in emails
}

if len(normalized_emails) != len(emails):
    print("Duplicate email found")


# ============================================================
# 98. PRACTICAL — UNIQUE FILE EXTENSIONS
# ============================================================

files = [
    "main.py",
    "app.py",
    "index.html",
    "style.css",
    "test.py",
]

extensions = {
    filename.rsplit(".", 1)[-1]
    for filename in files
}

print(extensions)


# ============================================================
# 99. PRACTICAL — FIND COMMON STUDENTS
# ============================================================

python_students = {
    "Shiva",
    "Ram",
    "Raj",
}

ml_students = {
    "Shiva",
    "Raj",
    "Kiran",
}

common_students = python_students & ml_students

print(common_students)


# ============================================================
# 100. PRACTICAL — STUDENTS ONLY IN PYTHON
# ============================================================

python_students = {
    "Shiva",
    "Ram",
    "Raj",
}

ml_students = {
    "Shiva",
    "Raj",
    "Kiran",
}

only_python = python_students - ml_students

print(only_python)


# ============================================================
# 101. PRACTICAL — STUDENTS IN EITHER COURSE
# ============================================================

python_students = {
    "Shiva",
    "Ram",
    "Raj",
}

ml_students = {
    "Shiva",
    "Raj",
    "Kiran",
}

all_students = python_students | ml_students

print(all_students)


# ============================================================
# 102. PRACTICAL — BOTH COURSES
# ============================================================

python_students = {
    "Shiva",
    "Ram",
    "Raj",
}

ml_students = {
    "Shiva",
    "Raj",
    "Kiran",
}

both_courses = python_students & ml_students

print(both_courses)


# ============================================================
# 103. PRACTICAL — EXACT COURSE MEMBERSHIP
# ============================================================

required = {
    "python",
    "sql",
}

completed = {
    "python",
    "sql",
    "git",
}

if required.issubset(completed):
    print("Requirements satisfied")


# ============================================================
# 104. PRACTICAL — CHECK NO CONFLICTS
# ============================================================

existing_ids = {
    101,
    102,
    103,
}

new_ids = {
    104,
    105,
}

if existing_ids.isdisjoint(new_ids):
    print("No ID conflicts")
else:
    print("Conflict detected")


# ============================================================
# 105. PRACTICAL — SET COMPREHENSION
# ============================================================

numbers = range(1, 21)

multiples_of_three = {
    number
    for number in numbers
    if number % 3 == 0
}

print(multiples_of_three)


# ============================================================
# 106. PRACTICAL — UNIQUE WORD LENGTHS
# ============================================================

words = [
    "python",
    "go",
    "java",
    "javascript",
    "rust",
]

unique_lengths = {
    len(word)
    for word in words
}

print(unique_lengths)


# ============================================================
# 107. PRACTICAL — UNIQUE FIRST LETTERS
# ============================================================

words = [
    "python",
    "pandas",
    "java",
    "javascript",
    "rust",
]

first_letters = {
    word[0]
    for word in words
}

print(first_letters)


# ============================================================
# 108. PRACTICAL — VALID PERMISSIONS
# ============================================================

valid_permissions = {
    "read",
    "write",
    "delete",
    "admin",
}

requested_permissions = {
    "read",
    "write",
}

invalid_permissions = (
    requested_permissions
    - valid_permissions
)

print(invalid_permissions)


# ============================================================
# 109. PRACTICAL — SET OF API METHODS
# ============================================================

allowed_methods = {
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
}

request_method = "POST"

if request_method in allowed_methods:
    print("Allowed")


# ============================================================
# 110. SET VS LIST VS TUPLE
# ============================================================

"""
LIST
====

[1, 2, 3]

Ordered
Mutable
Duplicates allowed
Indexing supported


TUPLE
=====

(1, 2, 3)

Ordered
Immutable
Duplicates allowed
Indexing supported


SET
===

{1, 2, 3}

Unordered
Mutable
Duplicates NOT allowed
Indexing NOT supported


FROZENSET
=========

frozenset({1, 2, 3})

Unordered
Immutable
Duplicates NOT allowed
Can be hashable
"""


# ============================================================
# 111. WHEN TO USE SET
# ============================================================

"""
Use a set when you need:

    1. Unique values

    2. Fast membership testing

    3. Deduplication

    4. Union

    5. Intersection

    6. Difference

    7. Permission comparison

    8. Finding common data

    9. Finding missing data
"""


# ============================================================
# 112. IMPORTANT PERFORMANCE CONCEPT
# ============================================================

"""
For membership testing:

    value in list

usually requires scanning the list.

A set is designed for fast membership testing
using hashing.

Example:

    blocked_users = {101, 102, 103}

    if user_id in blocked_users:
        ...


This is a common backend pattern.
"""


# ============================================================
# 113. SET WITH NONE
# ============================================================

values = {
    None,
    1,
    2,
}

print(values)


# ============================================================
# 114. SET WITH BOOLEAN
# ============================================================

values = {
    True,
    False,
}

print(values)


# ============================================================
# 115. IMPORTANT BOOLEAN / INTEGER BEHAVIOR
# ============================================================

values = {
    True,
    1,
    False,
    0,
}

print(values)


"""
Interesting:

True == 1
False == 0

Therefore they are treated as equal
for set membership purposes.
"""


# ============================================================
# 116. SET WITH NUMBERS
# ============================================================

values = {
    1,
    1.0,
}

print(values)


"""
1 == 1.0

Therefore only one value remains.
"""


# ============================================================
# 117. FROZENSET NESTING
# ============================================================

nested = {
    frozenset({1, 2}),
    frozenset({3, 4}),
}

print(nested)


# ============================================================
# 118. CONVERT FROZENSET TO SET
# ============================================================

frozen = frozenset([1, 2, 3])

normal_set = set(frozen)

print(normal_set)


# ============================================================
# 119. SET METHOD QUICK REFERENCE
# ============================================================

"""
CREATE
------

set()
{1, 2, 3}


ADD
---

add()
update()


REMOVE
------

remove()
discard()
pop()
clear()


COPY
----

copy()


SET OPERATIONS
--------------

union()
intersection()
difference()
symmetric_difference()


OPERATORS
---------

|
&
-
^


IN-PLACE OPERATIONS
-------------------

intersection_update()
difference_update()
symmetric_difference_update()
update()


RELATIONSHIPS
-------------

issubset()
issuperset()
isdisjoint()


OPERATORS
---------

<
<=
>
>=


IMMUTABLE SET
-------------

frozenset()
"""


# ============================================================
# END
# ============================================================