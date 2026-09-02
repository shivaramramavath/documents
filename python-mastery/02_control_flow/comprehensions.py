"""
Python Comprehensions
=====================

Comprehensions provide a concise way to create collections
from existing iterables.

Main types:

    1. List comprehension
    2. Set comprehension
    3. Dictionary comprehension
    4. Generator expression

Basic list comprehension:

    [expression for item in iterable]

With condition:

    [expression for item in iterable if condition]
"""


# ============================================================
# 1. NORMAL FOR LOOP
# ============================================================

numbers = [1, 2, 3, 4, 5]

squares = []

for number in numbers:
    squares.append(number ** 2)

print(squares)


# ============================================================
# 2. SAME THING WITH LIST COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

squares = [number ** 2 for number in numbers]

print(squares)


# Structure:
#
# [expression for item in iterable]
#
# number ** 2  → expression
# number       → item
# numbers      → iterable


# ============================================================
# 3. BASIC LIST COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

doubled = [number * 2 for number in numbers]

print(doubled)


# ============================================================
# 4. CUBES
# ============================================================

numbers = [1, 2, 3, 4, 5]

cubes = [number ** 3 for number in numbers]

print(cubes)


# ============================================================
# 5. STRINGS
# ============================================================

names = ["shiva", "ram", "python"]

uppercase_names = [name.upper() for name in names]

print(uppercase_names)


# ============================================================
# 6. STRING LENGTHS
# ============================================================

names = ["Shiva", "Python", "Ram"]

lengths = [len(name) for name in names]

print(lengths)


# ============================================================
# 7. LIST COMPREHENSION WITH CONDITION
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even_numbers = [
    number
    for number in numbers
    if number % 2 == 0
]

print(even_numbers)


# Structure:
#
# [expression for item in iterable if condition]


# ============================================================
# 8. ODD NUMBERS
# ============================================================

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

odd_numbers = [
    number
    for number in numbers
    if number % 2 != 0
]

print(odd_numbers)


# ============================================================
# 9. NUMBERS GREATER THAN A VALUE
# ============================================================

numbers = [10, 5, 20, 3, 40, 15]

large_numbers = [
    number
    for number in numbers
    if number > 10
]

print(large_numbers)


# ============================================================
# 10. STRING FILTERING
# ============================================================

names = ["Ram", "Shiva", "Raj", "Python"]

long_names = [
    name
    for name in names
    if len(name) > 3
]

print(long_names)


# ============================================================
# 11. TRANSFORMATION + CONDITION
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even_squares = [
    number ** 2
    for number in numbers
    if number % 2 == 0
]

print(even_squares)


# ============================================================
# 12. IF / ELSE INSIDE COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

labels = [
    "Even" if number % 2 == 0 else "Odd"
    for number in numbers
]

print(labels)


# Important difference:
#
# Filter:
#
# [number for number in numbers if condition]
#
# Conditional expression:
#
# [A if condition else B for number in numbers]


# ============================================================
# 13. POSITIVE / NEGATIVE
# ============================================================

numbers = [-5, -2, 0, 3, 7]

labels = [
    "Positive" if number > 0
    else "Negative" if number < 0
    else "Zero"
    for number in numbers
]

print(labels)


# ============================================================
# 14. RANGE WITH COMPREHENSION
# ============================================================

squares = [
    number ** 2
    for number in range(1, 11)
]

print(squares)


# ============================================================
# 15. EVEN NUMBERS FROM RANGE
# ============================================================

even_numbers = [
    number
    for number in range(1, 21)
    if number % 2 == 0
]

print(even_numbers)


# ============================================================
# 16. MULTIPLE CONDITIONS
# ============================================================

numbers = range(1, 51)

result = [
    number
    for number in numbers
    if number % 2 == 0
    and number % 5 == 0
]

print(result)


# ============================================================
# 17. NESTED LOOPS
# ============================================================

pairs = []

for x in [1, 2, 3]:
    for y in [10, 20]:
        pairs.append((x, y))

print(pairs)


# Same using comprehension:

pairs = [
    (x, y)
    for x in [1, 2, 3]
    for y in [10, 20]
]

print(pairs)


# ============================================================
# 18. CARTESIAN PRODUCT
# ============================================================

colors = ["red", "blue"]
sizes = ["S", "M", "L"]

combinations = [
    (color, size)
    for color in colors
    for size in sizes
]

print(combinations)


# ============================================================
# 19. NESTED LISTS
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(matrix)


# ============================================================
# 20. FLATTEN A LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

flattened = [
    number
    for row in matrix
    for number in row
]

print(flattened)


# Equivalent to:
#
# for row in matrix:
#     for number in row:
#         ...


# ============================================================
# 21. FLATTEN + FILTER
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

even_numbers = [
    number
    for row in matrix
    for number in row
    if number % 2 == 0
]

print(even_numbers)


# ============================================================
# 22. LIST COMPREHENSION WITH enumerate()
# ============================================================

names = ["Shiva", "Ram", "Raj"]

indexed_names = [
    (index, name)
    for index, name in enumerate(names)
]

print(indexed_names)


# ============================================================
# 23. LIST COMPREHENSION WITH zip()
# ============================================================

names = ["Shiva", "Ram", "Raj"]
ages = [21, 22, 20]

students = [
    (name, age)
    for name, age in zip(names, ages)
]

print(students)


# ============================================================
# 24. DICTIONARY COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

squares = {
    number: number ** 2
    for number in numbers
}

print(squares)


# Syntax:
#
# {key_expression: value_expression for item in iterable}


# ============================================================
# 25. DICTIONARY FROM TWO LISTS
# ============================================================

names = ["Shiva", "Ram", "Raj"]
ages = [21, 22, 20]

students = {
    name: age
    for name, age in zip(names, ages)
}

print(students)


# ============================================================
# 26. DICTIONARY COMPREHENSION WITH CONDITION
# ============================================================

numbers = range(1, 11)

even_squares = {
    number: number ** 2
    for number in numbers
    if number % 2 == 0
}

print(even_squares)


# ============================================================
# 27. SWAPPING DICTIONARY KEYS AND VALUES
# ============================================================

student = {
    "Shiva": 21,
    "Ram": 22,
    "Raj": 20,
}

swapped = {
    age: name
    for name, age in student.items()
}

print(swapped)


# Only do this when values are unique.


# ============================================================
# 28. SET COMPREHENSION
# ============================================================

numbers = [1, 2, 2, 3, 3, 4, 5]

squares = {
    number ** 2
    for number in numbers
}

print(squares)


# Duplicate results are automatically removed.


# ============================================================
# 29. SET COMPREHENSION WITH CONDITION
# ============================================================

numbers = range(1, 11)

even_squares = {
    number ** 2
    for number in numbers
    if number % 2 == 0
}

print(even_squares)


# ============================================================
# 30. GENERATOR EXPRESSION
# ============================================================

numbers = range(1, 6)

squares = (
    number ** 2
    for number in numbers
)

print(squares)


# A generator expression does not immediately create
# the complete collection in memory.


# ============================================================
# 31. CONSUMING A GENERATOR
# ============================================================

numbers = range(1, 6)

squares = (
    number ** 2
    for number in numbers
)

for square in squares:
    print(square)


# ============================================================
# 32. GENERATOR → LIST
# ============================================================

numbers = range(1, 6)

squares = list(
    number ** 2
    for number in numbers
)

print(squares)


# ============================================================
# 33. LIST COMPREHENSION vs GENERATOR
# ============================================================

numbers = range(1_000_000)

# List comprehension:
#
# squares = [number ** 2 for number in numbers]
#
# Creates the entire list immediately.


# Generator expression:
#
# squares = (number ** 2 for number in numbers)
#
# Produces values lazily.


# ============================================================
# 34. MEMORY CONCEPT
# ============================================================

numbers = [1, 2, 3, 4, 5]

list_result = [
    number ** 2
    for number in numbers
]

generator_result = (
    number ** 2
    for number in numbers
)

print(type(list_result))
print(type(generator_result))


# list_result:
#
# list
#
# generator_result:
#
# generator


# ============================================================
# 35. COMPREHENSION WITH FUNCTIONS
# ============================================================

def square(number):
    return number ** 2


numbers = [1, 2, 3, 4, 5]

squares = [
    square(number)
    for number in numbers
]

print(squares)


# ============================================================
# 36. COMPREHENSION WITH METHOD CALLS
# ============================================================

names = [" shiva ", " ram ", " raj "]

clean_names = [
    name.strip().title()
    for name in names
]

print(clean_names)


# ============================================================
# 37. REMOVE EMPTY STRINGS
# ============================================================

values = ["Python", "", "Java", "", "C++"]

non_empty = [
    value
    for value in values
    if value
]

print(non_empty)


# ============================================================
# 38. CLEAN DATA
# ============================================================

raw_names = [
    " Shiva ",
    " RAM",
    "",
    "Raj ",
    "  ",
]

clean_names = [
    name.strip()
    for name in raw_names
    if name.strip()
]

print(clean_names)


# ============================================================
# 39. DATA TRANSFORMATION
# ============================================================

prices = [100, 250, 500, 1000]

prices_with_tax = [
    price * 1.18
    for price in prices
]

print(prices_with_tax)


# ============================================================
# 40. PRACTICAL — STUDENT MARKS
# ============================================================

marks = [35, 78, 92, 45, 66, 30]

passed = [
    mark
    for mark in marks
    if mark >= 40
]

print("Passed:", passed)


# ============================================================
# 41. PRACTICAL — GRADE LABELS
# ============================================================

marks = [95, 82, 74, 61, 45, 30]

grades = [
    "A+"
    if mark >= 90
    else "A"
    if mark >= 80
    else "B"
    if mark >= 70
    else "C"
    if mark >= 60
    else "D"
    if mark >= 40
    else "F"
    for mark in marks
]

print(grades)


# For complex logic, a normal function + loop may be clearer.


# ============================================================
# 42. PRACTICAL — API DATA
# ============================================================

users = [
    {"name": "Shiva", "active": True},
    {"name": "Ram", "active": False},
    {"name": "Raj", "active": True},
]

active_users = [
    user["name"]
    for user in users
    if user["active"]
]

print(active_users)


# ============================================================
# 43. PRACTICAL — EXTRACT VALUES
# ============================================================

products = [
    {"name": "Laptop", "price": 65000},
    {"name": "Phone", "price": 30000},
    {"name": "Mouse", "price": 1000},
]

prices = [
    product["price"]
    for product in products
]

print(prices)


# ============================================================
# 44. PRACTICAL — FILTER PRODUCTS
# ============================================================

expensive_products = [
    product["name"]
    for product in products
    if product["price"] > 10000
]

print(expensive_products)


# ============================================================
# 45. NESTED DICTIONARY COMPREHENSION
# ============================================================

students = {
    "Shiva": [80, 90, 85],
    "Ram": [70, 75, 80],
    "Raj": [90, 95, 92],
}

averages = {
    name: sum(marks) / len(marks)
    for name, marks in students.items()
}

print(averages)


# ============================================================
# 46. CONDITIONAL DICTIONARY COMPREHENSION
# ============================================================

students = {
    "Shiva": 85,
    "Ram": 55,
    "Raj": 92,
}

passed_students = {
    name: marks
    for name, marks in students.items()
    if marks >= 40
}

print(passed_students)


# ============================================================
# 47. NESTED COMPREHENSION
# ============================================================

matrix = [
    [1, 2],
    [3, 4],
]

squared_matrix = [
    [
        number ** 2
        for number in row
    ]
    for row in matrix
]

print(squared_matrix)


# ============================================================
# 48. WHEN NOT TO USE COMPREHENSIONS
# ============================================================

"""
Avoid very complicated comprehensions.

Bad:

result = [
    complex_function(x, y)
    for x in data
    if condition_a(x)
    and condition_b(x)
    and condition_c(x)
    for y in another_data
    if condition_d(y)
]

If a comprehension becomes difficult to read,
use a normal for loop or extract logic into a function.
"""


# ============================================================
# 49. NORMAL LOOP vs COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

# Normal loop:

squares = []

for number in numbers:
    if number % 2 == 0:
        squares.append(number ** 2)

print(squares)


# Comprehension:

squares = [
    number ** 2
    for number in numbers
    if number % 2 == 0
]

print(squares)


# ============================================================
# 50. IMPORTANT RULE
# ============================================================

"""
A comprehension should improve readability.

Use it when:

    transform data
    filter data
    create a collection

Avoid it when:

    logic is complicated
    many conditions are involved
    side effects are required
    debugging becomes difficult
"""


# ============================================================
# 51. SIDE EFFECTS — AVOID THIS
# ============================================================

numbers = [1, 2, 3]

# Avoid using comprehensions just for side effects.

# [print(number) for number in numbers]


# Better:

for number in numbers:
    print(number)


# ============================================================
# 52. COMPREHENSION CHEAT SHEET
# ============================================================

"""
LIST
----

[expression for item in iterable]


LIST + FILTER
-------------

[expression for item in iterable if condition]


LIST + IF/ELSE
--------------

[value_if_true if condition else value_if_false
 for item in iterable]


SET
---

{expression for item in iterable}


DICTIONARY
----------

{key: value for item in iterable}


GENERATOR
---------

(expression for item in iterable)


NESTED
------

[expression
 for outer_item in outer_iterable
 for inner_item in inner_iterable]
"""


# ============================================================
# 53. FINAL EXAMPLE
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
        "active": True,
    },
    {
        "name": "Ram",
        "age": 17,
        "active": True,
    },
    {
        "name": "Raj",
        "age": 25,
        "active": False,
    },
    {
        "name": "Arun",
        "age": 30,
        "active": True,
    },
]

adult_active_users = [
    user["name"]
    for user in users
    if user["active"] and user["age"] >= 18
]

print("Adult active users:", adult_active_users)


# ============================================================
# END
# ============================================================