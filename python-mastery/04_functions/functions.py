"""
Python Functions
================

A function is a reusable block of code that performs a specific task.

Basic syntax:

    def function_name():
        # code

    function_name()

Functions help us:

    - reuse code
    - organize programs
    - reduce duplication
    - improve readability
    - make code easier to test
    - build modular applications
"""


# ============================================================
# 1. SIMPLE FUNCTION
# ============================================================

def greet():
    print("Hello, Python!")


greet()


# ============================================================
# 2. CALLING A FUNCTION MULTIPLE TIMES
# ============================================================

def greet():
    print("Hello!")


greet()
greet()
greet()


# ============================================================
# 3. FUNCTION WITH A PARAMETER
# ============================================================

def greet_user(name):
    print(f"Hello, {name}!")


greet_user("Shiva")
greet_user("Ram")


"""
name is called a parameter.

"Shiva" is called an argument.
"""


# ============================================================
# 4. MULTIPLE PARAMETERS
# ============================================================

def introduce(name, age):
    print(f"My name is {name}")
    print(f"I am {age} years old")


introduce("Shiva", 21)


# ============================================================
# 5. FUNCTION WITH RETURN
# ============================================================

def add(a, b):
    return a + b


result = add(10, 20)

print(result)


# ============================================================
# 6. RETURN VS PRINT
# ============================================================

def add_using_print(a, b):
    print(a + b)


def add_using_return(a, b):
    return a + b


result = add_using_print(10, 20)

print("Result:", result)


result = add_using_return(10, 20)

print("Result:", result)


"""
print():

    displays a value

return:

    sends a value back to the caller

Usually, reusable functions should return values
rather than only printing them.
"""


# ============================================================
# 7. RETURN MULTIPLE VALUES
# ============================================================

def calculate(a, b):

    total = a + b
    difference = a - b
    product = a * b

    return total, difference, product


result = calculate(10, 5)

print(result)


"""
Multiple values are returned as a tuple.
"""


# ============================================================
# 8. UNPACK MULTIPLE RETURN VALUES
# ============================================================

def calculate(a, b):

    return (
        a + b,
        a - b,
        a * b,
    )


total, difference, product = calculate(10, 5)

print(total)
print(difference)
print(product)


# ============================================================
# 9. FUNCTION WITHOUT RETURN
# ============================================================

def say_hello():
    print("Hello")


result = say_hello()

print(result)


"""
A function without an explicit return
automatically returns None.
"""


# ============================================================
# 10. EXPLICIT return None
# ============================================================

def check_age(age):

    if age < 18:
        return None

    return "Allowed"


print(check_age(15))
print(check_age(21))


# ============================================================
# 11. RETURN STOPS FUNCTION EXECUTION
# ============================================================

def check_number(number):

    if number < 0:
        return "Negative"

    return "Positive"


print(check_number(-10))


# ============================================================
# 12. CODE AFTER RETURN DOES NOT RUN
# ============================================================

def example():

    print("Before return")

    return 10

    print("After return")


print(example())


# ============================================================
# 13. DEFAULT PARAMETER
# ============================================================

def greet(name="Guest"):
    print(f"Hello, {name}!")


greet()
greet("Shiva")


# ============================================================
# 14. MULTIPLE DEFAULT PARAMETERS
# ============================================================

def introduce(
    name="Guest",
    age=0,
):
    print(name, age)


introduce()
introduce("Shiva")
introduce("Shiva", 21)


# ============================================================
# 15. DEFAULT PARAMETER RULE
# ============================================================

"""
Non-default parameters must come before
default parameters.

Correct:

    def example(name, age=0):
        ...


Incorrect:

    def example(age=0, name):
        ...
"""


# ============================================================
# 16. KEYWORD ARGUMENTS
# ============================================================

def introduce(name, age, branch):

    print(name)
    print(age)
    print(branch)


introduce(
    name="Shiva",
    age=21,
    branch="CSE",
)


# ============================================================
# 17. KEYWORD ARGUMENTS CAN CHANGE ORDER
# ============================================================

def introduce(name, age, branch):

    print(name)
    print(age)
    print(branch)


introduce(
    branch="CSE",
    name="Shiva",
    age=21,
)


# ============================================================
# 18. POSITIONAL ARGUMENTS
# ============================================================

def add(a, b):
    return a + b


print(add(10, 20))


"""
10 -> a
20 -> b
"""


# ============================================================
# 19. POSITIONAL + KEYWORD ARGUMENTS
# ============================================================

def introduce(name, age, branch):

    print(name, age, branch)


introduce(
    "Shiva",
    age=21,
    branch="CSE",
)


# ============================================================
# 20. POSITIONAL ARGUMENT MUST COME FIRST
# ============================================================

def introduce(name, age):
    print(name, age)


introduce(
    "Shiva",
    age=21,
)


# ============================================================
# 21. ARBITRARY POSITIONAL ARGUMENTS
# ============================================================

def add_many(*numbers):

    total = 0

    for number in numbers:
        total += number

    return total


print(add_many(1, 2))
print(add_many(1, 2, 3, 4, 5))


"""
*numbers collects positional arguments
into a tuple.
"""


# ============================================================
# 22. *args
# ============================================================

def show_args(*args):

    print(args)
    print(type(args))


show_args(
    10,
    20,
    30,
)


# ============================================================
# 23. ARBITRARY KEYWORD ARGUMENTS
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
# 24. *args + **kwargs
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


# ============================================================
# 25. PARAMETER ORDER
# ============================================================

def example(
    positional,
    default="default",
    *args,
    keyword_only=True,
    **kwargs,
):

    print(positional)
    print(default)
    print(args)
    print(keyword_only)
    print(kwargs)


example(
    "A",
    "B",
    "C",
    "D",
    keyword_only=False,
    name="Shiva",
)


# ============================================================
# 26. FUNCTION DOCUMENTATION
# ============================================================

def add(a, b):
    """
    Add two numbers.

    Args:
        a: First number.
        b: Second number.

    Returns:
        Sum of a and b.
    """

    return a + b


print(add(10, 20))

print(add.__doc__)


# ============================================================
# 27. FUNCTION ANNOTATIONS
# ============================================================

def add(
    a: int,
    b: int,
) -> int:

    return a + b


print(add(10, 20))


"""
Type annotations document expected types.

Python does not automatically enforce these types.
"""


# ============================================================
# 28. ANNOTATIONS ARE NOT STRICT TYPE CHECKING
# ============================================================

def add(
    a: int,
    b: int,
) -> int:

    return a + b


print(add(10, 20))


"""
Python itself does not prevent:

    add("Hello", "World")

Runtime behavior still depends on the actual values.
"""


# ============================================================
# 29. FUNCTION WITH DIFFERENT DATA TYPES
# ============================================================

def show(value):

    print(value)
    print(type(value))


show(10)
show("Python")
show([1, 2, 3])
show({"name": "Shiva"})


# ============================================================
# 30. FUNCTION RETURNING A LIST
# ============================================================

def get_numbers():

    return [
        1,
        2,
        3,
        4,
        5,
    ]


numbers = get_numbers()

print(numbers)


# ============================================================
# 31. FUNCTION RETURNING A DICTIONARY
# ============================================================

def create_user(name, age):

    return {
        "name": name,
        "age": age,
    }


user = create_user(
    "Shiva",
    21,
)

print(user)


# ============================================================
# 32. FUNCTION RETURNING ANOTHER FUNCTION
# ============================================================

def create_greeting():

    def greeting():
        print("Hello!")

    return greeting


say_hello = create_greeting()

say_hello()


"""
Functions are first-class objects in Python.
"""


# ============================================================
# 33. FUNCTIONS CAN BE STORED IN VARIABLES
# ============================================================

def greet():
    print("Hello!")


message = greet

message()


# ============================================================
# 34. FUNCTION PASSED AS ARGUMENT
# ============================================================

def greet():
    return "Hello"


def execute(function):

    return function()


print(execute(greet))


# ============================================================
# 35. BUILT-IN FUNCTIONS ARE ALSO CALLABLE OBJECTS
# ============================================================

numbers = [1, 2, 3]

result = list(map(str, numbers))

print(result)


# ============================================================
# 36. FUNCTION AS DICTIONARY VALUE
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
# 37. FUNCTION AS LIST ELEMENT
# ============================================================

def hello():
    print("Hello")


def goodbye():
    print("Goodbye")


functions = [
    hello,
    goodbye,
]

for function in functions:
    function()


# ============================================================
# 38. NESTED FUNCTION
# ============================================================

def outer():

    def inner():
        print("Inside inner function")

    inner()


outer()


# ============================================================
# 39. FUNCTION FACTORY
# ============================================================

def create_multiplier(multiplier):

    def multiply(number):
        return number * multiplier

    return multiply


double = create_multiplier(2)
triple = create_multiplier(3)

print(double(10))
print(triple(10))


"""
This introduces the concept of closures.

Closures will be covered in:

    10_advanced_functions/closures.py
"""


# ============================================================
# 40. RECURSION
# ============================================================

def countdown(number):

    if number == 0:
        return

    print(number)

    countdown(number - 1)


countdown(5)


# ============================================================
# 41. FACTORIAL USING RECURSION
# ============================================================

def factorial(number):

    if number == 0:
        return 1

    return number * factorial(number - 1)


print(factorial(5))


"""
5!
=
5 * 4 * 3 * 2 * 1
=
120
"""


# ============================================================
# 42. FACTORIAL WITHOUT RECURSION
# ============================================================

def factorial(number):

    result = 1

    for value in range(
        1,
        number + 1,
    ):
        result *= value

    return result


print(factorial(5))


# ============================================================
# 43. RECURSION BASE CASE
# ============================================================

def countdown(number):

    if number <= 0:
        return

    print(number)

    countdown(number - 1)


countdown(5)


"""
Every recursive function needs a condition
that eventually stops recursion.

This is called the base case.
"""


# ============================================================
# 44. FUNCTION CALL STACK
# ============================================================

def first():
    second()


def second():
    third()


def third():
    print("Third function")


first()


"""
Conceptually:

first()
   ↓
second()
   ↓
third()
"""


# ============================================================
# 45. FUNCTION COMPOSITION
# ============================================================

def double(number):
    return number * 2


def increment(number):
    return number + 1


value = 10

result = increment(
    double(value)
)

print(result)


# ============================================================
# 46. SMALL SINGLE-PURPOSE FUNCTIONS
# ============================================================

def calculate_total(price, quantity):
    return price * quantity


def apply_discount(total, discount):
    return total - (total * discount)


price = 1000
quantity = 2
discount = 0.10

total = calculate_total(
    price,
    quantity,
)

final_price = apply_discount(
    total,
    discount,
)

print(final_price)


"""
Good functions generally have a clear,
single responsibility.
"""


# ============================================================
# 47. FUNCTION WITH VALIDATION
# ============================================================

def divide(a, b):

    if b == 0:
        raise ValueError(
            "b cannot be zero"
        )

    return a / b


print(divide(10, 2))


# ============================================================
# 48. BOOLEAN RETURN FUNCTION
# ============================================================

def is_even(number):

    return number % 2 == 0


print(is_even(10))
print(is_even(7))


# ============================================================
# 49. FUNCTION USED IN IF
# ============================================================

def is_authenticated(user):

    return user.get(
        "authenticated",
        False,
    )


user = {
    "name": "Shiva",
    "authenticated": True,
}

if is_authenticated(user):
    print("Access granted")
else:
    print("Access denied")


# ============================================================
# 50. FUNCTION WITH LIST
# ============================================================

def calculate_average(numbers):

    if not numbers:
        return 0

    return sum(numbers) / len(numbers)


scores = [
    80,
    90,
    70,
]

print(
    calculate_average(scores)
)


# ============================================================
# 51. FUNCTION MODIFYING MUTABLE OBJECT
# ============================================================

def add_skill(skills, skill):

    skills.append(skill)


skills = [
    "Python",
    "SQL",
]

add_skill(
    skills,
    "FastAPI",
)

print(skills)


"""
Lists are mutable.

The function modifies the original list.
"""


# ============================================================
# 52. FUNCTION WITH IMMUTABLE OBJECT
# ============================================================

def increment(number):

    number += 1

    return number


number = 10

result = increment(number)

print("Original:", number)
print("Result:", result)


"""
Integers are immutable.

The original integer is not changed.
"""


# ============================================================
# 53. FUNCTION DEFAULT MUTABLE ARGUMENT — BAD
# ============================================================

"""
Avoid:

    def add_item(item, items=[]):
        items.append(item)
        return items

The same list can be reused across calls.
"""


# ============================================================
# 54. SAFE MUTABLE DEFAULT
# ============================================================

def add_item(
    item,
    items=None,
):

    if items is None:
        items = []

    items.append(item)

    return items


print(add_item("Python"))
print(add_item("SQL"))


# ============================================================
# 55. KEYWORD-ONLY PARAMETERS
# ============================================================

def create_user(
    name,
    *,
    age,
    active=True,
):

    return {
        "name": name,
        "age": age,
        "active": active,
    }


user = create_user(
    "Shiva",
    age=21,
)

print(user)


"""
Parameters after * are keyword-only.
"""


# ============================================================
# 56. POSITIONAL-ONLY PARAMETERS
# ============================================================

def add(
    a,
    b,
    /,
):

    return a + b


print(add(10, 20))


"""
Parameters before / are positional-only.

This is especially useful when designing
public APIs.
"""


# ============================================================
# 57. POSITIONAL-ONLY + KEYWORD-ONLY
# ============================================================

def create_user(
    name,
    /,
    *,
    age,
    active=True,
):

    return {
        "name": name,
        "age": age,
        "active": active,
    }


print(
    create_user(
        "Shiva",
        age=21,
    )
)


# ============================================================
# 58. GENERIC FUNCTION
# ============================================================

def first_item(items):

    if not items:
        return None

    return items[0]


print(
    first_item(
        [10, 20, 30]
    )
)

print(
    first_item(
        ["Python", "SQL"]
    )
)


# ============================================================
# 59. FUNCTION WITH *args
# ============================================================

def find_max(*numbers):

    if not numbers:
        return None

    return max(numbers)


print(find_max(10, 20, 5, 40))


# ============================================================
# 60. FUNCTION WITH **kwargs
# ============================================================

def create_profile(**details):

    return details


profile = create_profile(
    name="Shiva",
    age=21,
    branch="CSE",
)

print(profile)


# ============================================================
# 61. UNPACKING INTO FUNCTION
# ============================================================

def add(a, b, c):

    return a + b + c


numbers = [
    10,
    20,
    30,
]

print(
    add(*numbers)
)


# ============================================================
# 62. DICTIONARY UNPACKING INTO FUNCTION
# ============================================================

def introduce(
    name,
    age,
    branch,
):

    print(name)
    print(age)
    print(branch)


student = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

introduce(**student)


# ============================================================
# 63. FUNCTION ALIAS
# ============================================================

def greet():
    return "Hello"


say_hello = greet

print(say_hello())


# ============================================================
# 64. CHECK IF OBJECT IS CALLABLE
# ============================================================

def greet():
    return "Hello"


print(callable(greet))
print(callable(10))


# ============================================================
# 65. FUNCTION NAME
# ============================================================

def calculate_total():
    return 100


print(calculate_total.__name__)


# ============================================================
# 66. FUNCTION QUALNAME
# ============================================================

def calculate_total():
    return 100


print(calculate_total.__qualname__)


# ============================================================
# 67. FUNCTION MODULE
# ============================================================

def calculate_total():
    return 100


print(calculate_total.__module__)


# ============================================================
# 68. FUNCTION ANNOTATIONS
# ============================================================

def multiply(
    a: int,
    b: int,
) -> int:

    return a * b


print(multiply.__annotations__)


# ============================================================
# 69. FUNCTION DOCSTRING
# ============================================================

def square(number):
    """Return the square of a number."""

    return number ** 2


print(square.__doc__)


# ============================================================
# 70. PURE FUNCTION
# ============================================================

def add(a, b):
    return a + b


print(add(10, 20))


"""
A pure function:

    - depends only on its inputs
    - does not modify external state
    - returns a predictable result

Pure functions are easier to test.
"""


# ============================================================
# 71. FUNCTION WITH SIDE EFFECT
# ============================================================

total = 0


def add_to_total(value):

    global total

    total += value


add_to_total(10)

print(total)


"""
This function changes external state.

Such behavior is called a side effect.
"""


# ============================================================
# 72. AVOID GLOBAL STATE WHEN POSSIBLE
# ============================================================

def calculate_total(current_total, value):

    return current_total + value


total = 0

total = calculate_total(
    total,
    10,
)

total = calculate_total(
    total,
    20,
)

print(total)


"""
Returning new state is generally easier
to reason about than modifying globals.
"""


# ============================================================
# 73. FUNCTION PIPELINE
# ============================================================

def clean_text(text):
    return text.strip()


def normalize_text(text):
    return text.lower()


def split_words(text):
    return text.split()


text = "  HELLO PYTHON  "

text = clean_text(text)
text = normalize_text(text)
words = split_words(text)

print(words)


# ============================================================
# 74. REUSABLE VALIDATION FUNCTION
# ============================================================

def validate_age(age):

    if not isinstance(age, int):
        return False

    if age < 0:
        return False

    return True


print(validate_age(21))
print(validate_age(-5))
print(validate_age("21"))


# ============================================================
# 75. FUNCTION RETURNING A BOOLEAN
# ============================================================

def is_valid_email(email):

    return "@" in email


print(
    is_valid_email(
        "shiva@example.com"
    )
)


# ============================================================
# 76. FUNCTION WITH EARLY RETURN
# ============================================================

def process_user(user):

    if not user:
        return "No user"

    if not user.get("active"):
        return "Inactive user"

    return "User processed"


print(
    process_user(
        {
            "active": True,
        }
    )
)


# ============================================================
# 77. FUNCTION WITH MULTIPLE RETURN PATHS
# ============================================================

def get_status(score):

    if score >= 90:
        return "Excellent"

    if score >= 75:
        return "Good"

    if score >= 50:
        return "Pass"

    return "Fail"


print(get_status(95))
print(get_status(80))
print(get_status(60))
print(get_status(30))


# ============================================================
# 78. FUNCTION USING ANOTHER FUNCTION
# ============================================================

def square(number):
    return number ** 2


def calculate(number, operation):

    return operation(number)


print(
    calculate(
        5,
        square,
    )
)


# ============================================================
# 79. FUNCTION FACTORY
# ============================================================

def create_power(power):

    def calculate(number):
        return number ** power

    return calculate


square = create_power(2)
cube = create_power(3)

print(square(5))
print(cube(5))


# ============================================================
# 80. MAIN FUNCTION
# ============================================================

def main():

    print("Python program started")

    result = 10 + 20

    print(result)


if __name__ == "__main__":
    main()


"""
This pattern is extremely important.

When the file is executed directly:

    __name__ == "__main__"

When imported:

    __name__ == module_name

You will use this heavily in real Python projects.
"""


# ============================================================
# 81. BASIC PROGRAM STRUCTURE
# ============================================================

def get_name():
    return "Shiva"


def greet_user(name):
    return f"Hello, {name}!"


def main():

    name = get_name()

    message = greet_user(name)

    print(message)


if __name__ == "__main__":
    main()


# ============================================================
# 82. FUNCTION-BASED PROGRAM
# ============================================================

def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):

    if b == 0:
        raise ValueError(
            "Cannot divide by zero"
        )

    return a / b


def main():

    a = 10
    b = 5

    print("Add:", add(a, b))
    print("Subtract:", subtract(a, b))
    print("Multiply:", multiply(a, b))
    print("Divide:", divide(a, b))


if __name__ == "__main__":
    main()


# ============================================================
# 83. FUNCTION DESIGN
# ============================================================

"""
Good function:

    def calculate_total(price, quantity):
        return price * quantity


Bad design:

    def do_everything():
        ...


Prefer:

    small
    focused
    reusable
    testable
    predictable

functions.
"""


# ============================================================
# 84. FUNCTION NAMING
# ============================================================

"""
Prefer:

    calculate_total()
    get_user()
    create_user()
    validate_email()
    send_email()
    parse_response()

Avoid:

    x()
    do()
    thing()
    abc()
"""


# ============================================================
# 85. FUNCTION RESPONSIBILITY
# ============================================================

def calculate_total(price, quantity):

    return price * quantity


def apply_discount(total, discount):

    return total * (
        1 - discount
    )


def calculate_final_price(
    price,
    quantity,
    discount,
):

    total = calculate_total(
        price,
        quantity,
    )

    return apply_discount(
        total,
        discount,
    )


print(
    calculate_final_price(
        1000,
        2,
        0.10,
    )
)


# ============================================================
# 86. FUNCTION WITH TYPE HINTS
# ============================================================

def calculate_final_price(
    price: float,
    quantity: int,
    discount: float,
) -> float:

    total = price * quantity

    return total * (
        1 - discount
    )


print(
    calculate_final_price(
        1000.0,
        2,
        0.10,
    )
)


# ============================================================
# 87. FUNCTION RETURNING OPTIONAL VALUE
# ============================================================

def find_user(
    users: list[dict],
    user_id: int,
) -> dict | None:

    for user in users:

        if user["id"] == user_id:
            return user

    return None


users = [
    {
        "id": 1,
        "name": "Shiva",
    },
    {
        "id": 2,
        "name": "Ram",
    },
]

print(
    find_user(
        users,
        1,
    )
)

print(
    find_user(
        users,
        99,
    )
)


# ============================================================
# 88. FUNCTION WITH LIST COMPREHENSION
# ============================================================

def get_even_numbers(
    numbers,
):

    return [
        number
        for number in numbers
        if number % 2 == 0
    ]


print(
    get_even_numbers(
        range(1, 11)
    )
)


# ============================================================
# 89. FUNCTION WITH DICTIONARY COMPREHENSION
# ============================================================

def create_square_map(
    numbers,
):

    return {
        number: number ** 2
        for number in numbers
    }


print(
    create_square_map(
        range(1, 6)
    )
)


# ============================================================
# 90. FUNCTION CHEAT SHEET
# ============================================================

"""
FUNCTION
========

def function_name():
    ...


CALL
====

function_name()


PARAMETERS
==========

def add(a, b):
    ...


ARGUMENTS
=========

add(10, 20)


RETURN
======

def add(a, b):
    return a + b


DEFAULT
=======

def greet(name="Guest"):
    ...


KEYWORD
=======

greet(name="Shiva")


*args
=====

def example(*args):
    ...


**kwargs
========

def example(**kwargs):
    ...


UNPACKING
=========

function(*values)

function(**dictionary)


TYPE HINTS
==========

def add(
    a: int,
    b: int,
) -> int:
    ...


DOCSTRING
=========

def add(a, b):
    # Add two numbers.
    ...


POSITIONAL-ONLY
===============

def add(a, b, /):
    ...


KEYWORD-ONLY
============

def create(*, name):
    ...


NESTED FUNCTION
===============

def outer():

    def inner():
        ...


RECURSION
=========

def factorial(n):

    if n == 0:
        return 1

    return n * factorial(n - 1)


FIRST-CLASS FUNCTIONS
=====================

def greet():
    ...


function = greet

function()


MAIN
====

if __name__ == "__main__":
    main()


IMPORTANT PRINCIPLE
===================

A function should generally do one
clear thing and return a useful result.
"""