"""
Python Lambda Functions
=======================

A lambda is a small anonymous function.

Syntax:

    lambda arguments: expression

Example:

    square = lambda x: x * x

Lambda functions are commonly used with:

    sorted()
    min()
    max()
    map()
    filter()
    reduce()
    callbacks
    key functions
"""


# ============================================================
# 1. NORMAL FUNCTION
# ============================================================

def square(number):
    return number * number


print(square(5))


# ============================================================
# 2. SIMPLE LAMBDA
# ============================================================

square = lambda number: number * number

print(square(5))


"""
Equivalent to:

def square(number):
    return number * number
"""


# ============================================================
# 3. LAMBDA WITH MULTIPLE ARGUMENTS
# ============================================================

add = lambda a, b: a + b

print(add(10, 20))


multiply = lambda a, b: a * b

print(multiply(5, 4))


# ============================================================
# 4. LAMBDA WITH THREE ARGUMENTS
# ============================================================

calculate = lambda a, b, c: a + b + c

print(
    calculate(
        10,
        20,
        30,
    )
)


# ============================================================
# 5. LAMBDA RETURNS ONE EXPRESSION
# ============================================================

double = lambda x: x * 2

print(double(10))


"""
A lambda automatically returns
the result of its expression.
"""


# ============================================================
# 6. LAMBDA VS RETURN
# ============================================================

def add(a, b):
    return a + b


add_lambda = lambda a, b: a + b


print(add(10, 20))
print(add_lambda(10, 20))


# ============================================================
# 7. LAMBDA DOES NOT USE return
# ============================================================

# Invalid:

# lambda x:
#     return x * 2


"""
Lambda syntax uses an expression directly.

Correct:

    lambda x: x * 2
"""


# ============================================================
# 8. LAMBDA STORED IN A VARIABLE
# ============================================================

greet = lambda name: f"Hello, {name}"

print(
    greet("Shiva")
)


# ============================================================
# 9. TYPE OF LAMBDA
# ============================================================

square = lambda x: x * x

print(type(square))


"""
A lambda is still a function object.
"""


# ============================================================
# 10. LAMBDA WITHOUT ARGUMENTS
# ============================================================

get_message = lambda: "Hello Python"

print(
    get_message()
)


# ============================================================
# 11. DEFAULT ARGUMENTS
# ============================================================

greet = lambda name="Guest": f"Hello, {name}"

print(greet())
print(greet("Shiva"))


# ============================================================
# 12. *args WITH LAMBDA
# ============================================================

calculate_sum = lambda *numbers: sum(numbers)

print(
    calculate_sum(
        1,
        2,
        3,
        4,
    )
)


# ============================================================
# 13. **kwargs WITH LAMBDA
# ============================================================

get_name = lambda **data: data.get("name")

print(
    get_name(
        name="Shiva",
        age=21,
    )
)


# ============================================================
# 14. CONDITIONAL EXPRESSION
# ============================================================

check_even = lambda number: (
    "Even"
    if number % 2 == 0
    else "Odd"
)

print(check_even(10))
print(check_even(7))


# ============================================================
# 15. POSITIVE / NEGATIVE
# ============================================================

check_number = lambda number: (
    "Positive"
    if number > 0
    else "Negative"
    if number < 0
    else "Zero"
)

print(check_number(10))
print(check_number(-5))
print(check_number(0))


# ============================================================
# 16. ABSOLUTE VALUE
# ============================================================

absolute = lambda x: x if x >= 0 else -x

print(absolute(-10))
print(absolute(10))


# ============================================================
# 17. LAMBDA WITH LIST
# ============================================================

numbers = [1, 2, 3, 4, 5]

square = lambda x: x * x

for number in numbers:
    print(
        square(number)
    )


# ============================================================
# 18. LAMBDA WITH sorted()
# ============================================================

numbers = [
    50,
    10,
    40,
    20,
    30,
]

result = sorted(
    numbers,
    key=lambda x: x,
)

print(result)


# ============================================================
# 19. SORT BY ABSOLUTE VALUE
# ============================================================

numbers = [
    -10,
    5,
    -3,
    8,
    -1,
]

result = sorted(
    numbers,
    key=lambda x: abs(x),
)

print(result)


# ============================================================
# 20. SORT DESCENDING
# ============================================================

numbers = [
    10,
    50,
    20,
    40,
    30,
]

result = sorted(
    numbers,
    key=lambda x: x,
    reverse=True,
)

print(result)


# ============================================================
# 21. SORT STRINGS BY LENGTH
# ============================================================

words = [
    "Python",
    "AI",
    "Machine Learning",
    "API",
    "FastAPI",
]

result = sorted(
    words,
    key=lambda word: len(word),
)

print(result)


# ============================================================
# 22. SORT STRINGS BY LAST CHARACTER
# ============================================================

words = [
    "apple",
    "banana",
    "orange",
    "grape",
]

result = sorted(
    words,
    key=lambda word: word[-1],
)

print(result)


# ============================================================
# 23. SORT CASE-INSENSITIVELY
# ============================================================

words = [
    "python",
    "Apple",
    "banana",
    "FastAPI",
]

result = sorted(
    words,
    key=lambda word: word.lower(),
)

print(result)


# ============================================================
# 24. SORT LIST OF TUPLES
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 92),
    ("Arjun", 78),
    ("Krishna", 95),
]

result = sorted(
    students,
    key=lambda student: student[1],
)

print(result)


# ============================================================
# 25. SORT STUDENTS BY MARKS DESCENDING
# ============================================================

result = sorted(
    students,
    key=lambda student: student[1],
    reverse=True,
)

print(result)


# ============================================================
# 26. SORT BY NAME
# ============================================================

result = sorted(
    students,
    key=lambda student: student[0],
)

print(result)


# ============================================================
# 27. SORT LIST OF DICTIONARIES
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

for user in result:
    print(user)


# ============================================================
# 28. SORT USERS BY NAME
# ============================================================

result = sorted(
    users,
    key=lambda user: user["name"],
)

print(result)


# ============================================================
# 29. SORT USERS BY MULTIPLE FIELDS
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 21,
    },
    {
        "name": "Arjun",
        "age": 19,
    },
]

result = sorted(
    users,
    key=lambda user: (
        user["age"],
        user["name"],
    ),
)

print(result)


"""
First sort by age.

If ages are equal,
sort by name.
"""


# ============================================================
# 30. min() WITH lambda
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 92),
    ("Arjun", 78),
]

lowest = min(
    students,
    key=lambda student: student[1],
)

print(lowest)


# ============================================================
# 31. max() WITH lambda
# ============================================================

highest = max(
    students,
    key=lambda student: student[1],
)

print(highest)


# ============================================================
# 32. MINIMUM USER AGE
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

youngest = min(
    users,
    key=lambda user: user["age"],
)

print(youngest)


# ============================================================
# 33. MAXIMUM USER AGE
# ============================================================

oldest = max(
    users,
    key=lambda user: user["age"],
)

print(oldest)


# ============================================================
# 34. map() WITH LAMBDA
# ============================================================

numbers = [
    1,
    2,
    3,
    4,
    5,
]

squares = map(
    lambda x: x * x,
    numbers,
)

print(
    list(squares)
)


# ============================================================
# 35. map() WITH MULTIPLE LISTS
# ============================================================

numbers1 = [1, 2, 3]
numbers2 = [10, 20, 30]

result = map(
    lambda a, b: a + b,
    numbers1,
    numbers2,
)

print(
    list(result)
)


# ============================================================
# 36. filter() WITH LAMBDA
# ============================================================

numbers = [
    1,
    2,
    3,
    4,
    5,
    6,
]

even_numbers = filter(
    lambda x: x % 2 == 0,
    numbers,
)

print(
    list(even_numbers)
)


# ============================================================
# 37. FILTER POSITIVE NUMBERS
# ============================================================

numbers = [
    -5,
    10,
    -2,
    8,
    0,
    4,
]

positive = filter(
    lambda x: x > 0,
    numbers,
)

print(
    list(positive)
)


# ============================================================
# 38. FILTER USERS
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

print(
    list(active_users)
)


# ============================================================
# 39. ANY() WITH LAMBDA
# ============================================================

numbers = [
    1,
    3,
    5,
    8,
]

has_even = any(
    map(
        lambda x: x % 2 == 0,
        numbers,
    )
)

print(has_even)


# ============================================================
# 40. ALL() WITH LAMBDA
# ============================================================

numbers = [
    2,
    4,
    6,
    8,
]

all_even = all(
    map(
        lambda x: x % 2 == 0,
        numbers,
    )
)

print(all_even)


# ============================================================
# 41. LAMBDA WITH sorted() AND None VALUES
# ============================================================

users = [
    {
        "name": "Shiva",
        "score": 80,
    },
    {
        "name": "Ram",
        "score": None,
    },
    {
        "name": "Arjun",
        "score": 90,
    },
]

result = sorted(
    users,
    key=lambda user: (
        user["score"] is None,
        user["score"] or 0,
    ),
)

print(result)


# ============================================================
# 42. LAMBDA AS CALLBACK
# ============================================================

def execute(function, value):

    return function(value)


result = execute(
    lambda x: x * 10,
    5,
)

print(result)


"""
A callback is a function passed
to another function.
"""


# ============================================================
# 43. MULTIPLE CALLBACKS
# ============================================================

def calculate(
    value,
    operation,
):

    return operation(value)


double = lambda x: x * 2

square = lambda x: x * x

print(
    calculate(
        5,
        double,
    )
)

print(
    calculate(
        5,
        square,
    )
)


# ============================================================
# 44. LAMBDA IN A DICTIONARY
# ============================================================

operations = {
    "add": lambda a, b: a + b,
    "subtract": lambda a, b: a - b,
    "multiply": lambda a, b: a * b,
    "divide": lambda a, b: a / b,
}

print(
    operations["add"](10, 5)
)

print(
    operations["multiply"](10, 5)
)


# ============================================================
# 45. SIMPLE CALCULATOR
# ============================================================

operations = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
}

operator = "*"

result = operations[operator](
    10,
    20,
)

print(result)


# ============================================================
# 46. LAMBDA AS CLOSURE
# ============================================================

def create_multiplier(multiplier):

    return lambda number: number * multiplier


double = create_multiplier(2)
triple = create_multiplier(3)

print(double(10))
print(triple(10))


"""
The lambda remembers multiplier.

This is a closure.
"""


# ============================================================
# 47. LAMBDA CLOSURE
# ============================================================

def create_power(power):

    return lambda number: number ** power


square = create_power(2)
cube = create_power(3)

print(square(5))
print(cube(5))


# ============================================================
# 48. LAMBDA WITH CONDITIONAL LOGIC
# ============================================================

grade = lambda marks: (
    "A"
    if marks >= 90
    else "B"
    if marks >= 75
    else "C"
    if marks >= 60
    else "D"
)

print(grade(95))
print(grade(80))
print(grade(65))
print(grade(40))


"""
This works, but too much conditional logic
makes a lambda difficult to read.

Use a normal def in that situation.
"""


# ============================================================
# 49. LAMBDA AND walrus OPERATOR
# ============================================================

calculate = lambda x: (
    (result := x * 2)
)

print(
    calculate(10)
)


"""
The walrus operator := can be used
inside expressions.

But don't use it merely to make simple
lambdas complicated.
"""


# ============================================================
# 50. LAMBDA WITH sorted() — REAL-WORLD EXAMPLE
# ============================================================

products = [
    {
        "name": "Laptop",
        "price": 75000,
    },
    {
        "name": "Mouse",
        "price": 1500,
    },
    {
        "name": "Keyboard",
        "price": 3000,
    },
]

products_by_price = sorted(
    products,
    key=lambda product: product["price"],
)

for product in products_by_price:
    print(product)


# ============================================================
# 51. SORT PRODUCTS BY PRICE DESCENDING
# ============================================================

products_by_price = sorted(
    products,
    key=lambda product: product["price"],
    reverse=True,
)

print(products_by_price)


# ============================================================
# 52. SORT BY STRING LENGTH
# ============================================================

names = [
    "Shiva",
    "Ram",
    "Krishna",
    "Arjun",
]

names_by_length = sorted(
    names,
    key=lambda name: len(name),
)

print(names_by_length)


# ============================================================
# 53. SORT BY MULTIPLE CONDITIONS
# ============================================================

students = [
    {
        "name": "Shiva",
        "marks": 90,
        "age": 21,
    },
    {
        "name": "Ram",
        "marks": 90,
        "age": 20,
    },
    {
        "name": "Arjun",
        "marks": 85,
        "age": 22,
    },
]

result = sorted(
    students,
    key=lambda student: (
        -student["marks"],
        student["age"],
    ),
)

print(result)


"""
Sort by:

1. marks descending
2. age ascending
"""


# ============================================================
# 54. LAMBDA VS def
# ============================================================

"""
Lambda:

    lambda x: x * 2


Normal function:

    def double(x):
        return x * 2


Prefer lambda when:

    the function is very small
    the function is used once
    the function is passed as a callback
    the expression is easy to understand


Prefer def when:

    logic is complex
    multiple statements are needed
    documentation is useful
    debugging matters
    function is reused
    type hints improve readability
"""


# ============================================================
# 55. BAD LAMBDA EXAMPLE
# ============================================================

"""
Avoid code like:

complex_function = lambda x: (
    x * 2
    if x > 10
    else x + 5
    if x > 5
    else x * 10
)

If the logic keeps growing,
use def instead.
"""


# ============================================================
# 56. BETTER VERSION WITH def
# ============================================================

def transform(value):

    if value > 10:
        return value * 2

    if value > 5:
        return value + 5

    return value * 10


print(
    transform(20)
)


# ============================================================
# 57. LAMBDA WITH key=
# ============================================================

"""
One of the most important real-world uses:

    sorted(
        data,
        key=lambda item: ...
    )


Other functions supporting key= include:

    min()
    max()
"""


# ============================================================
# 58. KEY FUNCTION
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 95),
    ("Arjun", 75),
]

by_marks = sorted(
    students,
    key=lambda student: student[1],
)

print(by_marks)


# ============================================================
# 59. operator.itemgetter ALTERNATIVE
# ============================================================

from operator import itemgetter


students = [
    ("Shiva", 85),
    ("Ram", 95),
    ("Arjun", 75),
]

result = sorted(
    students,
    key=itemgetter(1),
)

print(result)


"""
For simple indexing, itemgetter() can be
cleaner than lambda.
"""


# ============================================================
# 60. operator.attrgetter ALTERNATIVE
# ============================================================

from operator import attrgetter


class Student:

    def __init__(
        self,
        name,
        marks,
    ):

        self.name = name
        self.marks = marks


students = [
    Student("Shiva", 85),
    Student("Ram", 95),
    Student("Arjun", 75),
]

result = sorted(
    students,
    key=attrgetter("marks"),
)

for student in result:
    print(
        student.name,
        student.marks,
    )


# ============================================================
# 61. LAMBDA WITH filter()
# ============================================================

numbers = range(1, 11)

even_numbers = list(
    filter(
        lambda x: x % 2 == 0,
        numbers,
    )
)

print(even_numbers)


# ============================================================
# 62. LAMBDA WITH map()
# ============================================================

numbers = range(1, 6)

squared_numbers = list(
    map(
        lambda x: x ** 2,
        numbers,
    )
)

print(squared_numbers)


# ============================================================
# 63. MAP + FILTER
# ============================================================

numbers = range(1, 11)

result = list(
    map(
        lambda x: x * x,
        filter(
            lambda x: x % 2 == 0,
            numbers,
        ),
    )
)

print(result)


"""
This means:

1. Get even numbers.
2. Square them.
"""


# ============================================================
# 64. LIST COMPREHENSION ALTERNATIVE
# ============================================================

numbers = range(1, 11)

result = [
    x * x
    for x in numbers
    if x % 2 == 0
]

print(result)


"""
In Python, this is often more readable than:

    map(
        lambda ...,
        filter(
            lambda ...,
            ...
        )
    )
"""


# ============================================================
# 65. LAMBDA AND FIRST-CLASS FUNCTIONS
# ============================================================

"""
Python functions are first-class objects.

They can be:

    stored in variables
    passed as arguments
    returned from functions
    stored in lists
    stored in dictionaries
"""


def add(a, b):
    return a + b


operation = add

print(
    operation(10, 20)
)


# ============================================================
# 66. FUNCTIONS IN A LIST
# ============================================================

operations = [
    lambda x: x + 1,
    lambda x: x * 2,
    lambda x: x ** 2,
]

for operation in operations:

    print(
        operation(5)
    )


# ============================================================
# 67. FUNCTION RETURNING LAMBDA
# ============================================================

def create_operation(operator):

    if operator == "double":

        return lambda x: x * 2

    if operator == "square":

        return lambda x: x ** 2

    return lambda x: x


operation = create_operation(
    "double"
)

print(
    operation(10)
)


# ============================================================
# 68. LAMBDA SCOPE / LATE BINDING
# ============================================================

functions = []

for i in range(3):

    functions.append(
        lambda: i
    )


for function in functions:

    print(function())


"""
You may expect:

    0
    1
    2

But you get:

    2
    2
    2

Why?

The lambdas capture the variable `i`,
not its value at each iteration.

By the time they execute,
i is 2.
"""


# ============================================================
# 69. FIX LATE BINDING WITH DEFAULT ARGUMENT
# ============================================================

functions = []

for i in range(3):

    functions.append(
        lambda i=i: i
    )


for function in functions:

    print(function())


"""
Now:

    0
    1
    2
"""


# ============================================================
# 70. LAMBDA IN A LOOP
# ============================================================

multipliers = []

for i in range(1, 4):

    multipliers.append(
        lambda x, i=i: x * i
    )


print(
    multipliers[0](10)
)

print(
    multipliers[1](10)
)

print(
    multipliers[2](10)
)


# ============================================================
# 71. REAL-WORLD CALLBACK
# ============================================================

def process_data(
    data,
    transform,
):

    return [
        transform(item)
        for item in data
    ]


numbers = [
    1,
    2,
    3,
    4,
]

result = process_data(
    numbers,
    lambda x: x * 10,
)

print(result)


# ============================================================
# 72. LAMBDA WITH DATA TRANSFORMATION
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

names = list(
    map(
        lambda user: user["name"],
        users,
    )
)

print(names)


# ============================================================
# 73. LAMBDA WITH BOOLEAN CONDITION
# ============================================================

is_adult = lambda age: age >= 18

print(
    is_adult(21)
)

print(
    is_adult(15)
)


# ============================================================
# 74. LAMBDA WITH STRING TRANSFORMATION
# ============================================================

normalize = lambda text: text.strip().lower()

print(
    normalize("  Python  ")
)


# ============================================================
# 75. LAMBDA CHEAT SHEET
# ============================================================

"""
BASIC
=====

square = lambda x: x * x


MULTIPLE ARGUMENTS
==================

add = lambda a, b: a + b


NO ARGUMENTS
============

hello = lambda: "Hello"


DEFAULT ARGUMENT
================

greet = lambda name="Guest": f"Hello {name}"


*args
=====

total = lambda *numbers: sum(numbers)


**kwargs
========

get_name = lambda **data: data["name"]


CONDITION
=========

check = lambda x: (
    "Even"
    if x % 2 == 0
    else "Odd"
)


SORTING
=======

sorted(
    users,
    key=lambda user: user["age"]
)


MIN
===

min(
    users,
    key=lambda user: user["age"]
)


MAX
===

max(
    users,
    key=lambda user: user["age"]
)


MAP
===

map(
    lambda x: x * 2,
    numbers
)


FILTER
======

filter(
    lambda x: x > 0,
    numbers
)


CLOSURE
=======

def create_multiplier(n):

    return lambda x: x * n


LATE BINDING
============

lambda: i

captures the variable.

To capture current value:

lambda i=i: i


IMPORTANT
=========

Lambda should remain simple.

If logic becomes complicated,
use def.
"""