"""
Python Function Arguments
=========================

This file covers:

1. Parameters vs arguments
2. Positional arguments
3. Keyword arguments
4. Default arguments
5. *args
6. **kwargs
7. Argument unpacking
8. Positional-only parameters
9. Keyword-only parameters
10. Combining all parameter types
11. Mutable arguments
12. Argument binding
13. Real-world API design
"""


# ============================================================
# 1. PARAMETERS VS ARGUMENTS
# ============================================================

def greet(name):
    # name -> parameter
    print(f"Hello, {name}")


greet("Shiva")
#       ↑
#       argument


# ============================================================
# 2. POSITIONAL ARGUMENTS
# ============================================================

def introduce(name, age, branch):
    print(name)
    print(age)
    print(branch)


introduce(
    "Shiva",
    21,
    "CSE",
)


"""
Mapping happens by position:

"Shiva" -> name
21      -> age
"CSE"   -> branch
"""


# ============================================================
# 3. POSITION MATTERS
# ============================================================

def subtract(a, b):
    return a - b


print(subtract(10, 5))
print(subtract(5, 10))


# ============================================================
# 4. TOO FEW ARGUMENTS
# ============================================================

def add(a, b):
    return a + b


# This would raise TypeError:
#
# add(10)


# ============================================================
# 5. TOO MANY ARGUMENTS
# ============================================================

def add(a, b):
    return a + b


# This would raise TypeError:
#
# add(10, 20, 30)


# ============================================================
# 6. KEYWORD ARGUMENTS
# ============================================================

def introduce(name, age, branch):
    print(
        f"{name}, {age}, {branch}"
    )


introduce(
    name="Shiva",
    age=21,
    branch="CSE",
)


# ============================================================
# 7. KEYWORD ARGUMENTS IGNORE POSITION
# ============================================================

def introduce(name, age, branch):
    print(name, age, branch)


introduce(
    branch="CSE",
    age=21,
    name="Shiva",
)


# ============================================================
# 8. MIXING POSITIONAL AND KEYWORD
# ============================================================

def introduce(name, age, branch):
    print(name, age, branch)


introduce(
    "Shiva",
    age=21,
    branch="CSE",
)


# ============================================================
# 9. POSITIONAL ARGUMENTS MUST COME BEFORE KEYWORD ARGUMENTS
# ============================================================

def introduce(name, age):
    print(name, age)


introduce(
    "Shiva",
    age=21,
)


# Incorrect:

# introduce(
#     name="Shiva",
#     21,
# )


# ============================================================
# 10. DUPLICATE ARGUMENT
# ============================================================

def greet(name):
    print(name)


# Incorrect:
#
# greet(
#     "Shiva",
#     name="Ram",
# )

# Python would raise:
# TypeError: multiple values for argument


# ============================================================
# 11. DEFAULT ARGUMENT
# ============================================================

def greet(name="Guest"):
    print(f"Hello, {name}")


greet()
greet("Shiva")


# ============================================================
# 12. MULTIPLE DEFAULT ARGUMENTS
# ============================================================

def create_user(
    name="Guest",
    age=0,
    active=True,
):

    print(
        name,
        age,
        active,
    )


create_user()

create_user(
    "Shiva"
)

create_user(
    "Shiva",
    21,
)

create_user(
    "Shiva",
    21,
    False,
)


# ============================================================
# 13. OVERRIDING DEFAULT VALUES
# ============================================================

def connect(
    host="localhost",
    port=8000,
):

    print(
        f"{host}:{port}"
    )


connect()

connect(
    port=9000
)

connect(
    host="127.0.0.1"
)

connect(
    host="192.168.1.10",
    port=5432,
)


# ============================================================
# 14. DEFAULT ARGUMENTS MUST COME AFTER REQUIRED ARGUMENTS
# ============================================================

def greet(
    name,
    message="Hello",
):

    print(
        message,
        name,
    )


greet("Shiva")

greet(
    "Shiva",
    "Welcome",
)


# ============================================================
# 15. *args
# ============================================================

def show_numbers(*numbers):

    print(numbers)


show_numbers(
    10,
    20,
    30,
)


"""
*args collects additional positional
arguments into a tuple.
"""


# ============================================================
# 16. TYPE OF *args
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
# 17. USING *args
# ============================================================

def calculate_sum(*numbers):

    total = 0

    for number in numbers:
        total += number

    return total


print(
    calculate_sum(
        1,
        2,
        3,
        4,
        5,
    )
)


# ============================================================
# 18. *args CAN BE EMPTY
# ============================================================

def show(*args):

    print(args)


show()


# ============================================================
# 19. REQUIRED PARAMETER + *args
# ============================================================

def greet_users(first_name, *other_names):

    print("First:", first_name)
    print("Others:", other_names)


greet_users(
    "Shiva",
    "Ram",
    "Krishna",
    "Arjun",
)


# ============================================================
# 20. **kwargs
# ============================================================

def show_details(**details):

    print(details)


show_details(
    name="Shiva",
    age=21,
    branch="CSE",
)


"""
**kwargs collects additional keyword
arguments into a dictionary.
"""


# ============================================================
# 21. TYPE OF **kwargs
# ============================================================

def show_details(**kwargs):

    print(kwargs)
    print(type(kwargs))


show_details(
    name="Shiva",
    age=21,
)


# ============================================================
# 22. ITERATING THROUGH **kwargs
# ============================================================

def show_details(**kwargs):

    for key, value in kwargs.items():
        print(
            f"{key}: {value}"
        )


show_details(
    name="Shiva",
    age=21,
    city="Guntur",
)


# ============================================================
# 23. REQUIRED PARAMETER + **kwargs
# ============================================================

def create_user(name, **details):

    print("Name:", name)
    print("Details:", details)


create_user(
    "Shiva",
    age=21,
    branch="CSE",
)


# ============================================================
# 24. *args + **kwargs
# ============================================================

def example(*args, **kwargs):

    print("Positional:", args)
    print("Keyword:", kwargs)


example(
    10,
    20,
    30,
    name="Shiva",
    age=21,
)


# ============================================================
# 25. COMPLETE PARAMETER ORDER
# ============================================================

def example(
    required,
    default="default",
    *args,
    keyword_only=True,
    **kwargs,
):

    print("required:", required)
    print("default:", default)
    print("args:", args)
    print("keyword_only:", keyword_only)
    print("kwargs:", kwargs)


example(
    "A",
    "B",
    "C",
    "D",
    keyword_only=False,
    name="Shiva",
    age=21,
)


"""
General order:

    positional parameters
    default parameters
    *args
    keyword-only parameters
    **kwargs
"""


# ============================================================
# 26. ARGUMENT UNPACKING WITH *
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


"""
Equivalent to:

add(
    numbers[0],
    numbers[1],
    numbers[2],
)
"""


# ============================================================
# 27. TUPLE UNPACKING
# ============================================================

def multiply(a, b, c):

    return a * b * c


numbers = (
    2,
    3,
    4,
)

print(
    multiply(*numbers)
)


# ============================================================
# 28. SET UNPACKING
# ============================================================

def add(a, b, c):

    return a + b + c


numbers = {
    1,
    2,
    3,
}

print(
    add(*numbers)
)


"""
Be careful:

Sets are unordered.

Do not depend on positional order
when unpacking a set.
"""


# ============================================================
# 29. DICTIONARY UNPACKING WITH **
# ============================================================

def create_user(
    name,
    age,
    branch,
):

    return {
        "name": name,
        "age": age,
        "branch": branch,
    }


user = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

print(
    create_user(**user)
)


# ============================================================
# 30. DICTIONARY KEYS MUST MATCH PARAMETERS
# ============================================================

def greet(name, age):

    print(
        f"{name} is {age}"
    )


data = {
    "name": "Shiva",
    "age": 21,
}

greet(**data)


# ============================================================
# 31. UNPACKING WITH ADDITIONAL KEYWORD ARGUMENTS
# ============================================================

def create_user(
    name,
    age,
    active,
):

    print(
        name,
        age,
        active,
    )


data = {
    "name": "Shiva",
    "age": 21,
}

create_user(
    **data,
    active=True,
)


# ============================================================
# 32. POSITIONAL-ONLY PARAMETERS
# ============================================================

def add(a, b, /):

    return a + b


print(
    add(10, 20)
)


"""
Everything before / is positional-only.

This is valid:

    add(10, 20)

This is invalid:

    add(a=10, b=20)
"""


# ============================================================
# 33. KEYWORD-ONLY PARAMETERS
# ============================================================

def create_user(
    *,
    name,
    age,
):

    return {
        "name": name,
        "age": age,
    }


print(
    create_user(
        name="Shiva",
        age=21,
    )
)


"""
Everything after * is keyword-only.
"""


# ============================================================
# 34. POSITIONAL-ONLY + KEYWORD-ONLY
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
# 35. REAL-WORLD API STYLE
# ============================================================

def request(
    url,
    /,
    *,
    method="GET",
    timeout=30,
    headers=None,
):

    print("URL:", url)
    print("Method:", method)
    print("Timeout:", timeout)
    print("Headers:", headers)


request(
    "https://example.com",
    method="POST",
    timeout=10,
)


"""
This style is common in well-designed APIs.

The URL is naturally positional.

Configuration options are explicitly named.
"""


# ============================================================
# 36. MUTABLE ARGUMENT
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
# 37. IMMUTABLE ARGUMENT
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

The original integer remains 10.
"""


# ============================================================
# 38. MUTABLE DEFAULT ARGUMENT — PROBLEM
# ============================================================

"""
Never normally do this:

    def add_item(item, items=[]):
        items.append(item)
        return items

The default list is created once,
not every time the function is called.
"""


# ============================================================
# 39. SAFE DEFAULT ARGUMENT
# ============================================================

def add_item(
    item,
    items=None,
):

    if items is None:
        items = []

    items.append(item)

    return items


print(
    add_item("Python")
)

print(
    add_item("SQL")
)


# ============================================================
# 40. ARGUMENT BINDING
# ============================================================

def example(a, b, c):

    print(a, b, c)


example(
    10,
    20,
    30,
)


"""
Python binds:

a = 10
b = 20
c = 30
"""


# ============================================================
# 41. inspect.signature()
# ============================================================

import inspect


def create_user(
    name,
    age=0,
    *,
    active=True,
):

    pass


signature = inspect.signature(
    create_user
)

print(signature)


# ============================================================
# 42. inspect PARAMETERS
# ============================================================

for name, parameter in signature.parameters.items():

    print(
        name,
        parameter.kind,
        parameter.default,
    )


"""
Parameter kinds include:

POSITIONAL_ONLY
POSITIONAL_OR_KEYWORD
VAR_POSITIONAL
KEYWORD_ONLY
VAR_KEYWORD
"""


# ============================================================
# 43. ARGUMENT BINDING WITH inspect
# ============================================================

def create_user(
    name,
    age,
    *,
    active=True,
):

    pass


signature = inspect.signature(
    create_user
)

bound = signature.bind(
    "Shiva",
    21,
    active=True,
)

print(bound.arguments)


# ============================================================
# 44. DEFAULT ARGUMENT BINDING
# ============================================================

def create_user(
    name,
    age=0,
    active=True,
):

    pass


signature = inspect.signature(
    create_user
)

bound = signature.bind(
    "Shiva"
)

bound.apply_defaults()

print(bound.arguments)


# ============================================================
# 45. *args UNPACKING
# ============================================================

def show(a, b, c):

    print(a, b, c)


values = [
    10,
    20,
    30,
]

show(*values)


# ============================================================
# 46. **kwargs UNPACKING
# ============================================================

def show(name, age):

    print(name, age)


values = {
    "name": "Shiva",
    "age": 21,
}

show(**values)


# ============================================================
# 47. COMBINING BOTH UNPACKING TYPES
# ============================================================

def create_user(
    name,
    age,
    branch,
):

    print(
        name,
        age,
        branch,
    )


args = [
    "Shiva",
    21,
]

kwargs = {
    "branch": "CSE",
}

create_user(
    *args,
    **kwargs,
)


# ============================================================
# 48. MERGING DICTIONARIES FOR **kwargs
# ============================================================

def create_user(
    name,
    age,
    branch,
):

    print(
        name,
        age,
        branch,
    )


user = {
    "name": "Shiva",
    "age": 21,
}

extra = {
    "branch": "CSE",
}

create_user(
    **user,
    **extra,
)


# ============================================================
# 49. MULTIPLE ** UNPACKING
# ============================================================

def show(**kwargs):

    print(kwargs)


first = {
    "name": "Shiva",
}

second = {
    "age": 21,
}

show(
    **first,
    **second,
)


# ============================================================
# 50. DICTIONARY MERGE WITH **
# ============================================================

defaults = {
    "timeout": 30,
    "retries": 3,
}

custom = {
    "timeout": 60,
}

config = {
    **defaults,
    **custom,
}

print(config)


"""
Later values override earlier values.
"""


# ============================================================
# 51. DEFAULT CONFIGURATION PATTERN
# ============================================================

def connect(**config):

    defaults = {
        "host": "localhost",
        "port": 8000,
        "timeout": 30,
    }

    final_config = {
        **defaults,
        **config,
    }

    print(final_config)


connect()

connect(
    port=9000,
    timeout=10,
)


# ============================================================
# 52. FUNCTION FOR DATABASE CONFIGURATION
# ============================================================

def create_database_config(
    host="localhost",
    port=5432,
    database="app",
    **options,
):

    config = {
        "host": host,
        "port": port,
        "database": database,
        **options,
    }

    return config


print(
    create_database_config(
        host="db.example.com",
        database="production",
        pool_size=10,
    )
)


# ============================================================
# 53. FUNCTION FOR API REQUEST
# ============================================================

def make_request(
    url,
    *,
    method="GET",
    timeout=30,
    headers=None,
    params=None,
):

    return {
        "url": url,
        "method": method,
        "timeout": timeout,
        "headers": headers,
        "params": params,
    }


request_data = make_request(
    "https://api.example.com/users",
    method="GET",
    timeout=10,
)

print(request_data)


# ============================================================
# 54. WHY KEYWORD-ONLY PARAMETERS ARE USEFUL
# ============================================================

def create_connection(
    host,
    port,
    *,
    timeout=30,
    ssl=True,
):

    print(
        host,
        port,
        timeout,
        ssl,
    )


create_connection(
    "localhost",
    5432,
    timeout=10,
    ssl=False,
)


"""
Without keyword-only parameters:

create_connection(
    "localhost",
    5432,
    10,
    False,
)

is harder to read.

Keyword-only arguments make intent clear.
"""


# ============================================================
# 55. ARGUMENT VALIDATION
# ============================================================

def set_age(age):

    if not isinstance(age, int):
        raise TypeError(
            "age must be an integer"
        )

    if age < 0:
        raise ValueError(
            "age cannot be negative"
        )

    return age


print(
    set_age(21)
)


# ============================================================
# 56. *args WITH VALIDATION
# ============================================================

def calculate_average(*numbers):

    if not numbers:
        raise ValueError(
            "At least one number is required"
        )

    return sum(numbers) / len(numbers)


print(
    calculate_average(
        10,
        20,
        30,
    )
)


# ============================================================
# 57. **kwargs VALIDATION
# ============================================================

def create_user(**data):

    required_fields = [
        "name",
        "email",
    ]

    for field in required_fields:

        if field not in data:
            raise ValueError(
                f"Missing field: {field}"
            )

    return data


print(
    create_user(
        name="Shiva",
        email="shiva@example.com",
    )
)


# ============================================================
# 58. FORWARDING ARGUMENTS
# ============================================================

def add(a, b):

    return a + b


def execute(function, *args):

    return function(*args)


print(
    execute(
        add,
        10,
        20,
    )
)


# ============================================================
# 59. FORWARDING *args AND **kwargs
# ============================================================

def create_user(
    name,
    age,
    *,
    active=True,
):

    return {
        "name": name,
        "age": age,
        "active": active,
    }


def execute(
    function,
    *args,
    **kwargs,
):

    return function(
        *args,
        **kwargs,
    )


user = execute(
    create_user,
    "Shiva",
    21,
    active=True,
)

print(user)


"""
This pattern is extremely important.

It appears in:

    decorators
    middleware
    wrappers
    frameworks
    dependency injection
    logging
"""


# ============================================================
# 60. WRAPPER FUNCTION
# ============================================================

def add(a, b):

    return a + b


def wrapper(*args, **kwargs):

    print("Before function")

    result = add(
        *args,
        **kwargs,
    )

    print("After function")

    return result


print(
    wrapper(10, 20)
)


# ============================================================
# 61. REAL-WORLD SERVICE FUNCTION
# ============================================================

def create_student(
    name,
    roll_number,
    *,
    branch="CSE",
    year=1,
):

    return {
        "name": name,
        "roll_number": roll_number,
        "branch": branch,
        "year": year,
    }


student = create_student(
    "Shiva",
    "23501A05E8",
    branch="CSE",
    year=3,
)

print(student)


# ============================================================
# 62. REAL-WORLD FILTER FUNCTION
# ============================================================

def filter_users(
    users,
    *,
    active=None,
    role=None,
):

    result = users

    if active is not None:

        result = [
            user
            for user in result
            if user["active"] == active
        ]

    if role is not None:

        result = [
            user
            for user in result
            if user["role"] == role
        ]

    return result


users = [
    {
        "name": "Shiva",
        "active": True,
        "role": "student",
    },
    {
        "name": "Ram",
        "active": False,
        "role": "student",
    },
    {
        "name": "Admin",
        "active": True,
        "role": "admin",
    },
]

print(
    filter_users(
        users,
        active=True,
    )
)

print(
    filter_users(
        users,
        role="student",
    )
)


# ============================================================
# 63. API-STYLE FUNCTION
# ============================================================

def fetch_users(
    *,
    page=1,
    limit=10,
    search=None,
    active=None,
):

    print(
        "page:",
        page,
    )

    print(
        "limit:",
        limit,
    )

    print(
        "search:",
        search,
    )

    print(
        "active:",
        active,
    )


fetch_users(
    page=2,
    limit=20,
    search="Shiva",
    active=True,
)


# ============================================================
# 64. FUNCTION SIGNATURE AS AN API CONTRACT
# ============================================================

def create_order(
    product_id: int,
    quantity: int,
    *,
    discount: float = 0.0,
    priority: bool = False,
):

    return {
        "product_id": product_id,
        "quantity": quantity,
        "discount": discount,
        "priority": priority,
    }


order = create_order(
    101,
    2,
    discount=0.10,
    priority=True,
)

print(order)


"""
A good function signature communicates:

    What is required?
    What is optional?
    What should be positional?
    What should be named?
"""


# ============================================================
# 65. ARGUMENT CHEAT SHEET
# ============================================================

"""
POSITIONAL
==========

def add(a, b):
    ...


add(10, 20)


KEYWORD
=======

add(
    a=10,
    b=20,
)


DEFAULT
=======

def greet(name="Guest"):
    ...


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


POSITIONAL-ONLY
===============

def add(a, b, /):
    ...


KEYWORD-ONLY
============

def create(*, name, age):
    ...


FULL PATTERN
============

def function(
    positional,
    /,
    normal,
    default="value",
    *args,
    keyword_only=True,
    **kwargs,
):
    ...


ARGUMENT FORWARDING
===================

def wrapper(
    *args,
    **kwargs,
):

    return function(
        *args,
        **kwargs,
    )


IMPORTANT
=========

Use keyword-only parameters when they
make function calls clearer.

Use *args when the number of positional
arguments is variable.

Use **kwargs when the number of keyword
arguments is variable.

Avoid mutable default arguments such as [] or {}.

Prefer explicit, readable function signatures.
"""