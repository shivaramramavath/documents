"""
Python Functional Programming
=============================

Topics:

    1. map()
    2. filter()
    3. reduce()
    4. zip()
    5. enumerate()
    6. any()
    7. all()
    8. sorted() with key
    9. map + filter
    10. reduce examples
    11. Lambda with functional tools
    12. Functional style vs comprehensions
    13. Practical examples
"""


# ============================================================
# 1. map() — BASIC
# ============================================================

numbers = [1, 2, 3, 4, 5]

result = map(
    lambda x: x * 2,
    numbers,
)

print(list(result))


"""
map(function, iterable)

The function is applied to every item.
"""


# ============================================================
# 2. map() WITH NORMAL FUNCTION
# ============================================================

def double(number):
    return number * 2


numbers = [1, 2, 3, 4, 5]

result = map(
    double,
    numbers,
)

print(list(result))


# ============================================================
# 3. map() RETURNS AN ITERATOR
# ============================================================

numbers = [1, 2, 3]

result = map(
    lambda x: x * 2,
    numbers,
)

print(result)

print(list(result))


"""
map() does not immediately create a list.

It returns a map iterator.

Convert it when needed:

    list(result)
    tuple(result)
"""


# ============================================================
# 4. map() WITH STRINGS
# ============================================================

names = [
    "shiva",
    "ram",
    "arjun",
]

result = map(
    str.upper,
    names,
)

print(list(result))


# ============================================================
# 5. map() WITH str.strip
# ============================================================

names = [
    "  Shiva ",
    " Ram",
    "Arjun  ",
]

result = map(
    str.strip,
    names,
)

print(list(result))


# ============================================================
# 6. map() WITH TYPE CONVERSION
# ============================================================

values = [
    "10",
    "20",
    "30",
    "40",
]

numbers = map(
    int,
    values,
)

print(list(numbers))


# ============================================================
# 7. map() WITH TWO ITERABLES
# ============================================================

numbers1 = [1, 2, 3]
numbers2 = [10, 20, 30]

result = map(
    lambda a, b: a + b,
    numbers1,
    numbers2,
)

print(list(result))


"""
The function receives:

    numbers1[0], numbers2[0]
    numbers1[1], numbers2[1]
    numbers1[2], numbers2[2]
"""


# ============================================================
# 8. map() STOPS AT SHORTEST ITERABLE
# ============================================================

numbers1 = [1, 2, 3, 4]
numbers2 = [10, 20]

result = map(
    lambda a, b: a + b,
    numbers1,
    numbers2,
)

print(list(result))


"""
Only two pairs are processed.
"""


# ============================================================
# 9. map() WITH THREE ITERABLES
# ============================================================

a = [1, 2, 3]
b = [10, 20, 30]
c = [100, 200, 300]

result = map(
    lambda x, y, z: x + y + z,
    a,
    b,
    c,
)

print(list(result))


# ============================================================
# 10. MAP WITH LIST COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

result_map = list(
    map(
        lambda x: x * 2,
        numbers,
    )
)

result_comprehension = [
    x * 2
    for x in numbers
]

print(result_map)
print(result_comprehension)


"""
In Python, comprehensions are often more readable.
"""


# ============================================================
# 11. filter() — BASIC
# ============================================================

numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
]

result = filter(
    lambda x: x % 2 == 0,
    numbers,
)

print(list(result))


"""
filter(function, iterable)

Keeps items for which the function
returns True.
"""


# ============================================================
# 12. FILTER ODD NUMBERS
# ============================================================

numbers = range(1, 11)

odd_numbers = filter(
    lambda x: x % 2 != 0,
    numbers,
)

print(list(odd_numbers))


# ============================================================
# 13. FILTER POSITIVE NUMBERS
# ============================================================

numbers = [
    -10,
    20,
    -5,
    30,
    0,
    15,
]

positive = filter(
    lambda x: x > 0,
    numbers,
)

print(list(positive))


# ============================================================
# 14. FILTER NEGATIVE NUMBERS
# ============================================================

negative = filter(
    lambda x: x < 0,
    numbers,
)

print(list(negative))


# ============================================================
# 15. FILTER STRINGS
# ============================================================

names = [
    "Shiva",
    "",
    "Ram",
    "",
    "Arjun",
]

result = filter(
    lambda name: name != "",
    names,
)

print(list(result))


# ============================================================
# 16. FILTER USING bool
# ============================================================

values = [
    0,
    1,
    "",
    "Python",
    None,
    True,
    False,
]

result = filter(
    bool,
    values,
)

print(list(result))


"""
bool(item) determines whether the item
is truthy.
"""


# ============================================================
# 17. FILTER USERS
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 17,
    },
    {
        "name": "Arjun",
        "age": 25,
    },
]

adults = filter(
    lambda user: user["age"] >= 18,
    users,
)

print(list(adults))


# ============================================================
# 18. FILTER ACTIVE USERS
# ============================================================

users = [
    {
        "name": "Shiva",
        "active": True,
    },
    {
        "name": "Ram",
        "active": False,
    },
    {
        "name": "Arjun",
        "active": True,
    },
]

active_users = filter(
    lambda user: user["active"],
    users,
)

print(list(active_users))


# ============================================================
# 19. FILTER WITH NORMAL FUNCTION
# ============================================================

def is_adult(user):
    return user["age"] >= 18


users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 17,
    },
]

result = filter(
    is_adult,
    users,
)

print(list(result))


# ============================================================
# 20. filter() RETURNS AN ITERATOR
# ============================================================

numbers = [1, 2, 3, 4]

result = filter(
    lambda x: x > 2,
    numbers,
)

print(result)

print(list(result))


# ============================================================
# 21. FILTER VS LIST COMPREHENSION
# ============================================================

numbers = range(1, 11)

result_filter = list(
    filter(
        lambda x: x % 2 == 0,
        numbers,
    )
)

result_comprehension = [
    x
    for x in numbers
    if x % 2 == 0
]

print(result_filter)
print(result_comprehension)


# ============================================================
# 22. map() + filter()
# ============================================================

numbers = range(1, 11)

result = map(
    lambda x: x * x,
    filter(
        lambda x: x % 2 == 0,
        numbers,
    ),
)

print(list(result))


"""
Steps:

1. filter even numbers
2. square each number
"""


# ============================================================
# 23. FILTER + MAP WITH COMPREHENSION
# ============================================================

numbers = range(1, 11)

result = [
    x * x
    for x in numbers
    if x % 2 == 0
]

print(result)


"""
Often easier to read.
"""


# ============================================================
# 24. reduce() — BASIC
# ============================================================

from functools import reduce


numbers = [
    1,
    2,
    3,
    4,
    5,
]

result = reduce(
    lambda a, b: a + b,
    numbers,
)

print(result)


"""
reduce() repeatedly combines values.

Example:

    1 + 2 = 3
    3 + 3 = 6
    6 + 4 = 10
    10 + 5 = 15
"""


# ============================================================
# 25. reduce() MULTIPLICATION
# ============================================================

numbers = [
    1,
    2,
    3,
    4,
    5,
]

result = reduce(
    lambda a, b: a * b,
    numbers,
)

print(result)


# ============================================================
# 26. reduce() WITH INITIAL VALUE
# ============================================================

numbers = [
    1,
    2,
    3,
]

result = reduce(
    lambda a, b: a + b,
    numbers,
    100,
)

print(result)


"""
Starts with:

    100

Then:

    100 + 1
    101 + 2
    103 + 3

Result:

    106
"""


# ============================================================
# 27. REDUCE TO FIND MAXIMUM
# ============================================================

numbers = [
    10,
    50,
    20,
    80,
    30,
]

maximum = reduce(
    lambda a, b: a if a > b else b,
    numbers,
)

print(maximum)


# ============================================================
# 28. REDUCE TO FIND MINIMUM
# ============================================================

minimum = reduce(
    lambda a, b: a if a < b else b,
    numbers,
)

print(minimum)


# ============================================================
# 29. REDUCE STRINGS
# ============================================================

words = [
    "Python",
    "is",
    "powerful",
]

sentence = reduce(
    lambda a, b: f"{a} {b}",
    words,
)

print(sentence)


# ============================================================
# 30. REDUCE TO COUNT
# ============================================================

numbers = [
    10,
    20,
    30,
    40,
]

count = reduce(
    lambda total, _: total + 1,
    numbers,
    0,
)

print(count)


"""
Although possible, len() is much better
for this particular problem.

Don't use reduce just because you can.
"""


# ============================================================
# 31. REDUCE WITH DICTIONARIES
# ============================================================

orders = [
    {
        "amount": 100,
    },
    {
        "amount": 250,
    },
    {
        "amount": 150,
    },
]

total = reduce(
    lambda total, order:
        total + order["amount"],
    orders,
    0,
)

print(total)


# ============================================================
# 32. REDUCE VS sum()
# ============================================================

numbers = [
    10,
    20,
    30,
]

result_reduce = reduce(
    lambda a, b: a + b,
    numbers,
)

result_sum = sum(numbers)

print(result_reduce)
print(result_sum)


"""
Prefer sum().

It communicates intent better.
"""


# ============================================================
# 33. ZIP — BASIC
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
]

ages = [
    21,
    25,
    19,
]

result = zip(
    names,
    ages,
)

print(list(result))


"""
zip() combines corresponding elements.
"""


# ============================================================
# 34. ZIP INTO DICTIONARY
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
]

ages = [
    21,
    25,
    19,
]

users = dict(
    zip(
        names,
        ages,
    )
)

print(users)


# ============================================================
# 35. ZIP THREE ITERABLES
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
]

ages = [
    21,
    25,
    19,
]

cities = [
    "Guntur",
    "Hyderabad",
    "Vijayawada",
]

result = zip(
    names,
    ages,
    cities,
)

print(list(result))


# ============================================================
# 36. ZIP WITH DIFFERENT LENGTHS
# ============================================================

a = [1, 2, 3, 4]
b = [10, 20]

print(
    list(zip(a, b))
)


"""
zip() stops at the shortest iterable.
"""


# ============================================================
# 37. zip(strict=True)
# ============================================================

a = [1, 2, 3]
b = [10, 20, 30]

result = zip(
    a,
    b,
    strict=True,
)

print(list(result))


"""
strict=True raises an error if the
iterables have different lengths.

Available in modern Python versions.
"""


# ============================================================
# 38. ENUMERATE
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
]

for index, name in enumerate(names):

    print(
        index,
        name,
    )


# ============================================================
# 39. ENUMERATE START
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
]

for index, name in enumerate(
    names,
    start=1,
):

    print(
        index,
        name,
    )


"""
Output:

1 Shiva
2 Ram
3 Arjun
"""


# ============================================================
# 40. any()
# ============================================================

numbers = [
    1,
    3,
    5,
    8,
]

result = any(
    x % 2 == 0
    for x in numbers
)

print(result)


"""
any() returns True if at least one
item is truthy.
"""


# ============================================================
# 41. any() EXAMPLE
# ============================================================

numbers = [
    1,
    3,
    5,
]

has_even = any(
    x % 2 == 0
    for x in numbers
)

print(has_even)


# ============================================================
# 42. any() WITH USERS
# ============================================================

users = [
    {
        "name": "Shiva",
        "admin": False,
    },
    {
        "name": "Ram",
        "admin": True,
    },
]

has_admin = any(
    user["admin"]
    for user in users
)

print(has_admin)


# ============================================================
# 43. all()
# ============================================================

numbers = [
    2,
    4,
    6,
    8,
]

result = all(
    x % 2 == 0
    for x in numbers
)

print(result)


"""
all() returns True only when
every item is truthy.
"""


# ============================================================
# 44. all() EXAMPLE
# ============================================================

numbers = [
    2,
    4,
    7,
    8,
]

all_even = all(
    x % 2 == 0
    for x in numbers
)

print(all_even)


# ============================================================
# 45. all() WITH USERS
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 25,
    },
]

all_adults = all(
    user["age"] >= 18
    for user in users
)

print(all_adults)


# ============================================================
# 46. IMPORTANT: any([]) AND all([])
# ============================================================

print(any([]))
print(all([]))


"""
Result:

False
True

This is a consequence of how these functions
are defined mathematically.

"""


# ============================================================
# 47. SORTED WITH KEY
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 95),
    ("Arjun", 75),
]

result = sorted(
    students,
    key=lambda student: student[1],
)

print(result)


# ============================================================
# 48. SORT DICTIONARIES
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 25,
    },
    {
        "name": "Arjun",
        "age": 19,
    },
]

result = sorted(
    users,
    key=lambda user: user["age"],
)

print(result)


# ============================================================
# 49. MAP + FILTER + ZIP
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
    "Krishna",
]

ages = [
    21,
    17,
    25,
    15,
]

users = zip(
    names,
    ages,
)

adults = filter(
    lambda user: user[1] >= 18,
    users,
)

result = map(
    lambda user: {
        "name": user[0],
        "age": user[1],
    },
    adults,
)

print(list(result))


# ============================================================
# 50. SAME EXAMPLE WITH COMPREHENSION
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Arjun",
    "Krishna",
]

ages = [
    21,
    17,
    25,
    15,
]

result = [
    {
        "name": name,
        "age": age,
    }
    for name, age in zip(names, ages)
    if age >= 18
]

print(result)


"""
The comprehension is arguably easier to read.
"""


# ============================================================
# 51. PRACTICAL: CLEAN USER NAMES
# ============================================================

names = [
    " shiva ",
    " RAM ",
    " arjun",
]

clean_names = list(
    map(
        lambda name: name.strip().title(),
        names,
    )
)

print(clean_names)


# ============================================================
# 52. PRACTICAL: FILTER VALID EMAILS
# ============================================================

emails = [
    "shiva@example.com",
    "invalid-email",
    "ram@example.com",
    "hello",
]

valid_emails = list(
    filter(
        lambda email: "@" in email,
        emails,
    )
)

print(valid_emails)


"""
This is only a simple example.

Real email validation is more complex.
"""


# ============================================================
# 53. PRACTICAL: CALCULATE TOTAL ORDER VALUE
# ============================================================

orders = [
    {
        "product": "Laptop",
        "price": 70000,
        "quantity": 1,
    },
    {
        "product": "Mouse",
        "price": 1500,
        "quantity": 2,
    },
    {
        "product": "Keyboard",
        "price": 3000,
        "quantity": 1,
    },
]

total = reduce(
    lambda total, order:
        total + (
            order["price"]
            * order["quantity"]
        ),
    orders,
    0,
)

print(total)


# ============================================================
# 54. PRACTICAL: HIGH-VALUE ORDERS
# ============================================================

high_value_orders = list(
    filter(
        lambda order:
            order["price"]
            * order["quantity"]
            > 5000,
        orders,
    )
)

print(high_value_orders)


# ============================================================
# 55. PRACTICAL: EXTRACT PRODUCT NAMES
# ============================================================

product_names = list(
    map(
        lambda order: order["product"],
        orders,
    )
)

print(product_names)


# ============================================================
# 56. PIPELINE
# ============================================================

numbers = range(1, 21)

result = map(
    lambda x: x * 10,
    filter(
        lambda x: x % 2 == 0,
        numbers,
    ),
)

print(list(result))


"""
Pipeline:

numbers
   ↓
filter even
   ↓
multiply by 10
   ↓
result
"""


# ============================================================
# 57. GENERATOR EXPRESSION AS ALTERNATIVE
# ============================================================

numbers = range(1, 21)

result = (
    x * 10
    for x in numbers
    if x % 2 == 0
)

print(list(result))


"""
This is lazy too.

The generator expression is often
very readable.
"""


# ============================================================
# 58. MAP IS LAZY
# ============================================================

def double(number):

    print(
        "Processing:",
        number,
    )

    return number * 2


result = map(
    double,
    [1, 2, 3],
)

print("map created")

print(list(result))


"""
Notice that processing happens when
the iterator is consumed.
"""


# ============================================================
# 59. FILTER IS LAZY
# ============================================================

def is_even(number):

    print(
        "Checking:",
        number,
    )

    return number % 2 == 0


result = filter(
    is_even,
    [1, 2, 3, 4],
)

print("filter created")

print(list(result))


# ============================================================
# 60. MAP / FILTER ARE SINGLE-USE ITERATORS
# ============================================================

numbers = [1, 2, 3]

result = map(
    lambda x: x * 2,
    numbers,
)

print(list(result))

print(list(result))


"""
Second result is empty.

The iterator was already consumed.
"""


# ============================================================
# 61. CONVERT TO LIST IF REUSE IS REQUIRED
# ============================================================

numbers = [1, 2, 3]

result = list(
    map(
        lambda x: x * 2,
        numbers,
    )
)

print(result)
print(result)


# ============================================================
# 62. MAP WITH METHOD REFERENCES
# ============================================================

names = [
    "shiva",
    "ram",
    "arjun",
]

result = list(
    map(
        str.upper,
        names,
    )
)

print(result)


"""
You don't always need lambda.

Compare:

    map(lambda x: x.upper(), names)

with:

    map(str.upper, names)

The second is cleaner.
"""


# ============================================================
# 63. FILTER WITH FUNCTION REFERENCE
# ============================================================

def is_positive(number):
    return number > 0


numbers = [
    -10,
    5,
    -2,
    20,
]

result = list(
    filter(
        is_positive,
        numbers,
    )
)

print(result)


# ============================================================
# 64. REDUCE WITH NORMAL FUNCTION
# ============================================================

def add(a, b):
    return a + b


numbers = [
    1,
    2,
    3,
    4,
]

result = reduce(
    add,
    numbers,
)

print(result)


# ============================================================
# 65. functools.reduce IMPORT
# ============================================================

from functools import reduce

"""
reduce is not a built-in function.

It lives in:

    functools
"""


# ============================================================
# 66. WHEN TO USE reduce()
# ============================================================

"""
Use reduce() when you genuinely need
to repeatedly combine values into one value.

Examples:

    cumulative multiplication
    custom aggregation
    combining objects
    complex reductions


Don't use reduce() when a clearer built-in exists.

Prefer:

    sum()
    min()
    max()
    any()
    all()
"""


# ============================================================
# 67. FUNCTIONAL TOOLS SUMMARY
# ============================================================

"""
map()
=====

Transform every item.

    map(function, iterable)


filter()
========

Keep matching items.

    filter(function, iterable)


reduce()
========

Combine items into one value.

    reduce(function, iterable)


zip()
=====

Combine corresponding elements.

    zip(a, b)


enumerate()
===========

Get index + value.

    enumerate(items)


any()
=====

At least one is truthy.

    any(condition for x in items)


all()
=====

Every item is truthy.

    all(condition for x in items)


sorted()
========

Sort using a key.

    sorted(
        items,
        key=function
    )
"""


# ============================================================
# 68. FINAL COMPARISON
# ============================================================

numbers = [1, 2, 3, 4, 5]


# Transform
mapped = list(
    map(
        lambda x: x * 2,
        numbers,
    )
)


# Filter
filtered = list(
    filter(
        lambda x: x > 2,
        numbers,
    )
)


# Combine
total = reduce(
    lambda a, b: a + b,
    numbers,
)


# Check at least one
has_even = any(
    x % 2 == 0
    for x in numbers
)


# Check all
all_positive = all(
    x > 0
    for x in numbers
)


print("Mapped:", mapped)
print("Filtered:", filtered)
print("Total:", total)
print("Has even:", has_even)
print("All positive:", all_positive)


# ============================================================
# 69. PYTHONIC APPROACH
# ============================================================

numbers = range(1, 11)

result = [
    x * x
    for x in numbers
    if x % 2 == 0
]

print(result)


"""
Python often favors:

    comprehensions
    generator expressions
    built-in functions

over deeply nested:

    map()
    filter()
    reduce()

Choose the version that communicates
the operation most clearly.
"""


# ============================================================
# 70. CHEAT SHEET
# ============================================================

"""
TRANSFORM
=========

list(
    map(
        lambda x: x * 2,
        numbers,
    )
)


FILTER
======

list(
    filter(
        lambda x: x > 10,
        numbers,
    )
)


REDUCE
======

reduce(
    lambda a, b: a + b,
    numbers,
)


ZIP
===

list(
    zip(
        names,
        ages,
    )
)


ENUMERATE
=========

for index, value in enumerate(items):
    ...


ANY
===

any(
    condition
    for item in items
)


ALL
===

all(
    condition
    for item in items
)


SORT
====

sorted(
    items,
    key=lambda x: x.some_value,
)


IMPORTANT
=========

map/filter are lazy iterators.

reduce is in functools.

zip is lazy.

enumerate is lazy.

Prefer comprehensions when they are
clearer than map/filter chains.
"""