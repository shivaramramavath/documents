"""
Python Tuples
=============

A tuple is an ordered collection of values.

Tuples are:

    - ordered
    - indexed
    - iterable
    - immutable
    - allow duplicate values
    - can contain different data types

Main difference:

    list  -> mutable
    tuple -> immutable
"""


# ============================================================
# 1. CREATING A TUPLE
# ============================================================

numbers = (10, 20, 30, 40)

print(numbers)


# ============================================================
# 2. EMPTY TUPLE
# ============================================================

empty = ()

print(empty)
print(type(empty))


# ============================================================
# 3. TUPLE TYPE
# ============================================================

values = (1, 2, 3)

print(type(values))


# ============================================================
# 4. TUPLE WITH DIFFERENT DATA TYPES
# ============================================================

person = (
    "Shiva",
    21,
    85.5,
    True,
)

print(person)


# ============================================================
# 5. SINGLE-ELEMENT TUPLE
# ============================================================

number = (10,)

print(number)
print(type(number))


"""
IMPORTANT:

This:

    (10)

is NOT a tuple.

It is just an integer surrounded by parentheses.

This:

    (10,)

is a tuple.
"""


# ============================================================
# 6. WITHOUT PARENTHESES
# ============================================================

numbers = 10, 20, 30

print(numbers)
print(type(numbers))


# Python automatically creates a tuple
# because of the commas.


# ============================================================
# 7. TUPLE LENGTH
# ============================================================

numbers = (10, 20, 30, 40)

print(len(numbers))


# ============================================================
# 8. INDEXING
# ============================================================

numbers = (10, 20, 30, 40)

print(numbers[0])
print(numbers[1])
print(numbers[2])


# ============================================================
# 9. NEGATIVE INDEXING
# ============================================================

numbers = (10, 20, 30, 40)

print(numbers[-1])
print(numbers[-2])


# ============================================================
# 10. SLICING
# ============================================================

numbers = (0, 1, 2, 3, 4, 5)

print(numbers[1:4])
print(numbers[:3])
print(numbers[3:])
print(numbers[::2])


# ============================================================
# 11. REVERSE
# ============================================================

numbers = (1, 2, 3, 4, 5)

print(numbers[::-1])


# ============================================================
# 12. TUPLES ARE IMMUTABLE
# ============================================================

numbers = (10, 20, 30)

# This is NOT allowed:

# numbers[0] = 100


"""
This raises:

TypeError

because tuples cannot be modified after creation.
"""


# ============================================================
# 13. NO APPEND()
# ============================================================

numbers = (10, 20, 30)

# numbers.append(40)


"""
Tuples don't have:

    append()
    extend()
    insert()
    remove()
    pop()
    clear()
    sort()
    reverse()

because tuples are immutable.
"""


# ============================================================
# 14. MEMBERSHIP
# ============================================================

numbers = (10, 20, 30)

print(20 in numbers)
print(100 in numbers)

print(20 not in numbers)


# ============================================================
# 15. ITERATION
# ============================================================

numbers = (10, 20, 30)

for number in numbers:
    print(number)


# ============================================================
# 16. enumerate()
# ============================================================

names = ("Shiva", "Ram", "Raj")

for index, name in enumerate(names):
    print(index, name)


# ============================================================
# 17. TUPLE CONCATENATION
# ============================================================

a = (1, 2, 3)
b = (4, 5, 6)

result = a + b

print(result)


# This creates a NEW tuple.


# ============================================================
# 18. TUPLE REPETITION
# ============================================================

numbers = (1, 2, 3)

result = numbers * 3

print(result)


# ============================================================
# 19. count()
# ============================================================

numbers = (10, 20, 20, 30, 20)

print(numbers.count(20))


# ============================================================
# 20. index()
# ============================================================

numbers = (10, 20, 30, 40)

print(numbers.index(30))


# ============================================================
# 21. index() WITH START
# ============================================================

numbers = (10, 20, 30, 20, 40)

print(numbers.index(20, 2))


# ============================================================
# 22. TUPLE METHODS
# ============================================================

"""
Tuple has only two main methods:

    count()
    index()
"""


# ============================================================
# 23. PACKING
# ============================================================

person = "Shiva", 21, "CSE"

print(person)


"""
This is called tuple packing.

Multiple values are packed into one tuple.
"""


# ============================================================
# 24. UNPACKING
# ============================================================

person = ("Shiva", 21, "CSE")

name, age, branch = person

print(name)
print(age)
print(branch)


# ============================================================
# 25. UNPACKING MUST MATCH
# ============================================================

numbers = (10, 20, 30)

a, b, c = numbers

print(a)
print(b)
print(c)


# ============================================================
# 26. STAR UNPACKING
# ============================================================

numbers = (10, 20, 30, 40, 50)

first, *middle, last = numbers

print(first)
print(middle)
print(last)


# ============================================================
# 27. STAR UNPACKING — FIRST
# ============================================================

numbers = (10, 20, 30, 40)

first, *rest = numbers

print(first)
print(rest)


# ============================================================
# 28. STAR UNPACKING — LAST
# ============================================================

numbers = (10, 20, 30, 40)

*rest, last = numbers

print(rest)
print(last)


# ============================================================
# 29. SWAPPING VARIABLES
# ============================================================

a = 10
b = 20

a, b = b, a

print(a)
print(b)


"""
Python internally uses tuple packing/unpacking
for this kind of multiple assignment.
"""


# ============================================================
# 30. FUNCTION RETURNING MULTIPLE VALUES
# ============================================================

def get_user():
    name = "Shiva"
    age = 21

    return name, age


result = get_user()

print(result)


# The function returns a tuple.


# ============================================================
# 31. UNPACK FUNCTION RESULT
# ============================================================

def get_user():
    return "Shiva", 21, "CSE"


name, age, branch = get_user()

print(name)
print(age)
print(branch)


# ============================================================
# 32. NESTED TUPLES
# ============================================================

students = (
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
)

print(students)


# ============================================================
# 33. ACCESS NESTED TUPLE
# ============================================================

students = (
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
)

print(students[0])
print(students[0][0])
print(students[0][1])


# ============================================================
# 34. ITERATE NESTED TUPLES
# ============================================================

students = (
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
)

for name, marks in students:
    print(name, marks)


# ============================================================
# 35. TUPLE INSIDE LIST
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
]

print(students)


"""
Very common data structure:

list of tuples
"""


# ============================================================
# 36. LIST OF TUPLES
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
]

students.sort(
    key=lambda student: student[1]
)

print(students)


# ============================================================
# 37. SORT DESCENDING
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
]

students.sort(
    key=lambda student: student[1],
    reverse=True,
)

print(students)


# ============================================================
# 38. TUPLE OF LISTS
# ============================================================

data = (
    [1, 2, 3],
    [4, 5, 6],
)

print(data)


"""
The tuple itself is immutable,
but the nested lists are mutable.
"""


# ============================================================
# 39. MUTABLE OBJECT INSIDE TUPLE
# ============================================================

data = (
    [1, 2, 3],
    [4, 5, 6],
)

data[0].append(100)

print(data)


"""
This works because we are not changing
the tuple's reference.

We are modifying the list inside the tuple.
"""


# ============================================================
# 40. TUPLE OF DICTIONARIES
# ============================================================

users = (
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 22,
    },
)

print(users)


# ============================================================
# 41. MODIFY DICTIONARY INSIDE TUPLE
# ============================================================

users = (
    {
        "name": "Shiva",
        "age": 21,
    },
)

users[0]["age"] = 22

print(users)


# ============================================================
# 42. tuple()
# ============================================================

numbers = [1, 2, 3]

result = tuple(numbers)

print(result)


# ============================================================
# 43. STRING TO TUPLE
# ============================================================

text = "Python"

characters = tuple(text)

print(characters)


# ============================================================
# 44. RANGE TO TUPLE
# ============================================================

numbers = tuple(range(1, 6))

print(numbers)


# ============================================================
# 45. SET TO TUPLE
# ============================================================

values = {1, 2, 3}

result = tuple(values)

print(result)


# Note:
# Set itself is unordered.


# ============================================================
# 46. TUPLE TO LIST
# ============================================================

numbers = (1, 2, 3)

result = list(numbers)

print(result)


# ============================================================
# 47. TEMPORARY MUTATION THROUGH LIST
# ============================================================

numbers = (10, 20, 30)

temp = list(numbers)

temp.append(40)

numbers = tuple(temp)

print(numbers)


"""
If you really need to "change" a tuple,
you create a new tuple.
"""


# ============================================================
# 48. COMPARING TUPLES
# ============================================================

a = (1, 2, 3)
b = (1, 2, 3)

print(a == b)


# ============================================================
# 49. TUPLE COMPARISON
# ============================================================

print((1, 2) < (2, 1))
print((1, 2) < (1, 3))


"""
Tuples are compared lexicographically.

Python compares:

first item
then second item
then third item
...
"""


# ============================================================
# 50. TUPLE SORTING
# ============================================================

numbers = (50, 10, 40, 20, 30)

sorted_numbers = sorted(numbers)

print(sorted_numbers)


"""
sorted() returns a LIST.

The original tuple remains unchanged.
"""


# ============================================================
# 51. SORTED TUPLE RESULT BACK TO TUPLE
# ============================================================

numbers = (50, 10, 40, 20, 30)

sorted_numbers = tuple(sorted(numbers))

print(sorted_numbers)


# ============================================================
# 52. min()
# ============================================================

numbers = (10, 5, 30, 2, 50)

print(min(numbers))


# ============================================================
# 53. max()
# ============================================================

numbers = (10, 5, 30, 2, 50)

print(max(numbers))


# ============================================================
# 54. sum()
# ============================================================

numbers = (10, 20, 30, 40)

print(sum(numbers))


# ============================================================
# 55. any()
# ============================================================

values = (0, 0, 1, 0)

print(any(values))


# ============================================================
# 56. all()
# ============================================================

values = (1, 1, 1, 1)

print(all(values))


# ============================================================
# 57. TUPLE UNPACKING IN LOOP
# ============================================================

students = (
    ("Shiva", 85),
    ("Ram", 72),
    ("Raj", 91),
)

for name, marks in students:
    print(f"{name}: {marks}")


# ============================================================
# 58. ZIP RETURNS TUPLES
# ============================================================

names = ["Shiva", "Ram", "Raj"]
marks = [85, 72, 91]

result = zip(names, marks)

print(list(result))


"""
Each pair generated by zip()
is a tuple.
"""


# ============================================================
# 59. ZIP + UNPACKING
# ============================================================

names = ["Shiva", "Ram", "Raj"]
marks = [85, 72, 91]

for name, mark in zip(names, marks):
    print(name, mark)


# ============================================================
# 60. TUPLE AS DICTIONARY KEY
# ============================================================

locations = {
    (16.5, 80.6): "Guntur",
    (17.4, 78.5): "Hyderabad",
}

print(locations)


"""
Tuples can be dictionary keys when their contents
are hashable.

Lists cannot be dictionary keys.
"""


# ============================================================
# 61. TUPLE AS SET ELEMENT
# ============================================================

coordinates = {
    (10, 20),
    (30, 40),
}

print(coordinates)


# ============================================================
# 62. TUPLE HASHABILITY
# ============================================================

point = (10, 20)

print(hash(point))


"""
A tuple containing only hashable objects
can itself be hashable.

This is why it can be used as:

    dictionary key
    set element
"""


# ============================================================
# 63. UNHASHABLE TUPLE
# ============================================================

point = ([10, 20], 30)

# hash(point)

"""
This raises TypeError because the tuple contains
a list, and lists are unhashable.
"""


# ============================================================
# 64. NAMEDTUPLE
# ============================================================

from collections import namedtuple

Person = namedtuple(
    "Person",
    ["name", "age", "branch"],
)

person = Person(
    "Shiva",
    21,
    "CSE",
)

print(person)
print(person.name)
print(person.age)
print(person.branch)


# ============================================================
# 65. NAMEDTUPLE INDEXING
# ============================================================

print(person[0])
print(person[1])
print(person[2])


"""
namedtuple gives tuple-like data with readable fields.
"""


# ============================================================
# 66. NAMEDTUPLE _ASDICT
# ============================================================

print(person._asdict())


# ============================================================
# 67. NAMEDTUPLE _REPLACE
# ============================================================

updated_person = person._replace(age=22)

print(person)
print(updated_person)


"""
Original tuple is unchanged.

A new namedtuple is returned.
"""


# ============================================================
# 68. MODERN ALTERNATIVE — DATACLASS
# ============================================================

from dataclasses import dataclass


@dataclass(frozen=True)
class User:
    name: str
    age: int


user = User(
    name="Shiva",
    age=21,
)

print(user)


"""
frozen=True makes the dataclass immutable.

Dataclasses are generally more flexible than namedtuple
for structured application data.
"""


# ============================================================
# 69. TUPLE COMPREHENSION — IMPORTANT
# ============================================================

numbers = (1, 2, 3, 4, 5)

result = (
    number ** 2
    for number in numbers
)

print(result)


"""
IMPORTANT:

This is NOT a tuple comprehension.

It creates a generator expression.

Convert it to a tuple:

    tuple(
        number ** 2
        for number in numbers
    )
"""


# ============================================================
# 70. GENERATOR → TUPLE
# ============================================================

numbers = (1, 2, 3, 4, 5)

squares = tuple(
    number ** 2
    for number in numbers
)

print(squares)


# ============================================================
# 71. TUPLE WITH * UNPACKING
# ============================================================

numbers = (1, 2, 3)

combined = (
    0,
    *numbers,
    4,
)

print(combined)


# ============================================================
# 72. FUNCTION *args
# ============================================================

def add_numbers(*numbers):

    print(numbers)
    print(type(numbers))

    return sum(numbers)


print(add_numbers(10, 20, 30, 40))


"""
*args collects positional arguments
into a tuple.
"""


# ============================================================
# 73. FUNCTION RETURN TYPE
# ============================================================

def get_coordinates():

    return 10, 20


coordinates = get_coordinates()

print(coordinates)
print(type(coordinates))


# ============================================================
# 74. UNPACK FUNCTION RESULT
# ============================================================

def get_coordinates():

    return 10, 20


x, y = get_coordinates()

print("X:", x)
print("Y:", y)


# ============================================================
# 75. TUPLE AS CONSTANT CONFIGURATION
# ============================================================

SUPPORTED_FORMATS = (
    "json",
    "csv",
    "xml",
)

print(SUPPORTED_FORMATS)


"""
Tuples are useful for collections that should
not accidentally be modified.
"""


# ============================================================
# 76. TUPLE FOR RGB COLOR
# ============================================================

black = (0, 0, 0)
white = (255, 255, 255)
red = (255, 0, 0)

print(red)


# ============================================================
# 77. TUPLE FOR COORDINATES
# ============================================================

point = (10, 20)

x, y = point

print(x)
print(y)


# ============================================================
# 78. TUPLE FOR DATABASE RECORD
# ============================================================

user = (
    101,
    "Shiva",
    "shiva@example.com",
)

user_id, name, email = user

print(user_id)
print(name)
print(email)


# ============================================================
# 79. LIST VS TUPLE
# ============================================================

"""
LIST

    [1, 2, 3]

    Mutable
    More methods
    Good for changing collections


TUPLE

    (1, 2, 3)

    Immutable
    Fewer methods
    Good for fixed collections
    Can be dictionary keys if hashable
"""


# ============================================================
# 80. WHEN TO USE LIST
# ============================================================

tasks = [
    "Learn Python",
    "Practice SQL",
]

tasks.append("Learn FastAPI")

print(tasks)


# The collection changes.


# ============================================================
# 81. WHEN TO USE TUPLE
# ============================================================

coordinates = (16.5, 80.6)

print(coordinates)


"""
Coordinates conceptually represent a fixed pair
of values, so a tuple is a natural choice.
"""


# ============================================================
# 82. LIST MEMORY / MUTABILITY CONCEPT
# ============================================================

list_data = [1, 2, 3]
tuple_data = (1, 2, 3)

print(list_data)
print(tuple_data)


"""
The important distinction is not simply:

    "tuple is faster"

The more important design distinction is:

    list  -> data can change
    tuple -> data should not change
"""


# ============================================================
# 83. TUPLE OF OBJECTS
# ============================================================

class Student:

    def __init__(self, name):
        self.name = name


students = (
    Student("Shiva"),
    Student("Ram"),
)

for student in students:
    print(student.name)


"""
The tuple prevents changing which objects are in
the collection, but the objects themselves may still
be mutable.
"""


# ============================================================
# 84. TUPLE COPY
# ============================================================

numbers = (1, 2, 3)

copy = tuple(numbers)

print(copy)


"""
Since tuples are immutable, copying a tuple is often
unnecessary.
"""


# ============================================================
# 85. TUPLE IDENTITY
# ============================================================

a = (1, 2, 3)
b = tuple(a)

print(a == b)
print(a is b)


"""
Never use `is` to compare tuple values.

Use:

    ==

for value equality.
"""


# ============================================================
# 86. PRACTICAL — DATABASE ROW
# ============================================================

row = (
    101,
    "Shiva",
    85,
)

user_id, name, score = row

print(
    f"ID={user_id}, Name={name}, Score={score}"
)


# ============================================================
# 87. PRACTICAL — API RESPONSE PAIR
# ============================================================

def get_status():

    return 200, "Success"


status_code, message = get_status()

print(status_code)
print(message)


# ============================================================
# 88. PRACTICAL — MIN/MAX COORDINATES
# ============================================================

points = (
    (10, 20),
    (5, 30),
    (15, 10),
)

x_values = tuple(
    point[0]
    for point in points
)

y_values = tuple(
    point[1]
    for point in points
)

print("Min X:", min(x_values))
print("Max X:", max(x_values))
print("Min Y:", min(y_values))
print("Max Y:", max(y_values))


# ============================================================
# 89. PRACTICAL — FIXED PERMISSIONS
# ============================================================

ADMIN_PERMISSIONS = (
    "read",
    "write",
    "delete",
)

print(ADMIN_PERMISSIONS)


# ============================================================
# 90. PRACTICAL — SUPPORTED HTTP METHODS
# ============================================================

HTTP_METHODS = (
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
)

method = "POST"

if method in HTTP_METHODS:
    print("Supported")


# ============================================================
# 91. PRACTICAL — TUPLE UNPACKING IN API DATA
# ============================================================

responses = (
    (200, "OK"),
    (404, "Not Found"),
    (500, "Server Error"),
)

for status, message in responses:
    print(f"{status}: {message}")


# ============================================================
# 92. PRACTICAL — SORTING RECORDS
# ============================================================

employees = (
    ("Shiva", 50000),
    ("Ram", 45000),
    ("Raj", 70000),
)

sorted_employees = sorted(
    employees,
    key=lambda employee: employee[1],
    reverse=True,
)

print(sorted_employees)


# ============================================================
# 93. PRACTICAL — CONVERT TUPLE TO DICTIONARY
# ============================================================

pairs = (
    ("name", "Shiva"),
    ("age", 21),
    ("branch", "CSE"),
)

person = dict(pairs)

print(person)


# ============================================================
# 94. PRACTICAL — DICTIONARY ITEMS ARE TUPLES
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

for item in person.items():

    print(item)
    print(type(item))


"""
Each item from dict.items() is a tuple:

    ("name", "Shiva")
"""


# ============================================================
# 95. DICTIONARY UNPACKING
# ============================================================

person = {
    "name": "Shiva",
    "age": 21,
}

for key, value in person.items():

    print(key, value)


# ============================================================
# 96. TUPLE AS MATRIX ROW
# ============================================================

matrix = (
    (1, 2, 3),
    (4, 5, 6),
    (7, 8, 9),
)

for row in matrix:

    for value in row:
        print(value)


# ============================================================
# 97. TUPLE NESTING
# ============================================================

data = (
    (
        "Shiva",
        (
            21,
            "CSE",
        ),
    ),
)

print(data)


# ============================================================
# 98. DEEP UNPACKING
# ============================================================

data = (
    "Shiva",
    (
        21,
        "CSE",
    ),
)

name, (age, branch) = data

print(name)
print(age)
print(branch)


# ============================================================
# 99. TUPLE PATTERN WITH STAR
# ============================================================

data = (
    "Shiva",
    21,
    "CSE",
    85,
    "India",
)

name, age, *details = data

print(name)
print(age)
print(details)


# ============================================================
# 100. TUPLE CHEAT SHEET
# ============================================================

"""
CREATE
------

()

(1, 2, 3)

1, 2, 3

(10,)


ACCESS
------

tuple_data[0]
tuple_data[-1]


SLICE
-----

tuple_data[1:4]
tuple_data[:3]
tuple_data[3:]
tuple_data[::-1]


METHODS
-------

count()
index()


CONVERSION
----------

tuple(list_data)
list(tuple_data)


UNPACKING
---------

a, b = data

first, *middle, last = data


COMBINE
-------

a + b


REPEAT
------

a * 3


SEARCH
------

value in data


UTILITY
-------

len()
min()
max()
sum()
any()
all()


SORT
----

sorted(data)

Remember:

sorted() returns a LIST.


HASHABLE
--------

Hashable tuples can be:

    dictionary keys
    set elements


FUNCTIONS
---------

*args -> tuple

return a, b -> tuple


IMPORTANT
---------

Tuple = immutable collection.

List = mutable collection.
"""


# ============================================================
# END
# ============================================================