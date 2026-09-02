"""
Python Decorators
=================

A decorator is a function that takes another function,
adds or changes behavior, and returns a function.

Core concepts:

    1. First-class functions
    2. Higher-order functions
    3. Nested functions
    4. Closures
    5. Decorators
    6. @ syntax
    7. *args / **kwargs
    8. functools.wraps
    9. Multiple decorators
    10. Practical decorators
"""


# ============================================================
# 1. FUNCTIONS ARE OBJECTS
# ============================================================

def greet():
    print("Hello")


print(greet)

greet()


# ============================================================
# 2. STORE FUNCTION IN A VARIABLE
# ============================================================

def greet():
    print("Hello")


message = greet

message()


"""
Both names refer to the same function.
"""


# ============================================================
# 3. PASS FUNCTION AS AN ARGUMENT
# ============================================================

def greet():
    print("Hello")


def execute(function):
    function()


execute(greet)


"""
A function that receives another function
is called a higher-order function.
"""


# ============================================================
# 4. RETURN A FUNCTION
# ============================================================

def create_greeting():

    def greet():
        print("Hello")

    return greet


function = create_greeting()

function()


# ============================================================
# 5. SIMPLE HIGHER-ORDER FUNCTION
# ============================================================

def execute(function, value):

    return function(value)


def square(number):
    return number * number


result = execute(
    square,
    5,
)

print(result)


# ============================================================
# 6. NESTED FUNCTION
# ============================================================

def outer():

    def inner():
        print("Inside inner")

    inner()


outer()


# ============================================================
# 7. FUNCTION WRAPPER
# ============================================================

def greet():
    print("Hello")


def wrapper():

    print("Before")

    greet()

    print("After")


wrapper()


"""
The wrapper adds behavior around greet().
"""


# ============================================================
# 8. FIRST DECORATOR — MANUALLY
# ============================================================

def greet():
    print("Hello")


def decorator(function):

    def wrapper():

        print("Before function")

        function()

        print("After function")

    return wrapper


greet = decorator(greet)

greet()


"""
Original:

    greet()

becomes:

    wrapper()
"""


# ============================================================
# 9. UNDERSTANDING THE DECORATOR
# ============================================================

def greet():
    print("Hello")


def decorator(function):

    def wrapper():

        print("Before")

        function()

        print("After")

    return wrapper


decorated_function = decorator(greet)

decorated_function()


# ============================================================
# 10. @ DECORATOR SYNTAX
# ============================================================

def decorator(function):

    def wrapper():

        print("Before")

        function()

        print("After")

    return wrapper


@decorator
def greet():

    print("Hello")


greet()


"""
This:

    @decorator
    def greet():
        ...


is equivalent to:

    def greet():
        ...

    greet = decorator(greet)
"""


# ============================================================
# 11. SIMPLE LOGGING DECORATOR
# ============================================================

def log_call(function):

    def wrapper():

        print(
            f"Calling {function.__name__}"
        )

        function()

        print(
            f"Finished {function.__name__}"
        )

    return wrapper


@log_call
def greet():

    print("Hello Shiva")


greet()


# ============================================================
# 12. DECORATOR WITH RETURN VALUE
# ============================================================

def decorator(function):

    def wrapper():

        print("Before")

        result = function()

        print("After")

        return result

    return wrapper


@decorator
def get_number():

    return 100


result = get_number()

print(result)


"""
Important:

A decorator must return the original
function's result when appropriate.
"""


# ============================================================
# 13. DECORATOR WITH ARGUMENT
# ============================================================

def decorator(function):

    def wrapper(name):

        print("Before")

        function(name)

        print("After")

    return wrapper


@decorator
def greet(name):

    print(
        f"Hello {name}"
    )


greet("Shiva")


# ============================================================
# 14. PROBLEM WITH FIXED ARGUMENTS
# ============================================================

def decorator(function):

    def wrapper(name):

        return function(name)

    return wrapper


@decorator
def greet(name):

    print(name)


greet("Shiva")


"""
But this decorator only supports
one positional argument.

What about:

    greet(first_name, last_name)

or keyword arguments?

Use:

    *args
    **kwargs
"""


# ============================================================
# 15. *args AND **kwargs
# ============================================================

def decorator(function):

    def wrapper(*args, **kwargs):

        print("Before")

        result = function(
            *args,
            **kwargs,
        )

        print("After")

        return result

    return wrapper


@decorator
def greet(name):

    print(
        f"Hello {name}"
    )


greet("Shiva")


# ============================================================
# 16. MULTIPLE ARGUMENTS
# ============================================================

def decorator(function):

    def wrapper(*args, **kwargs):

        print("Before")

        result = function(
            *args,
            **kwargs,
        )

        print("After")

        return result

    return wrapper


@decorator
def add(a, b):

    return a + b


print(
    add(10, 20)
)


# ============================================================
# 17. KEYWORD ARGUMENTS
# ============================================================

print(
    add(
        a=10,
        b=20,
    )
)


# ============================================================
# 18. DECORATOR WITH ANY FUNCTION
# ============================================================

def log_call(function):

    def wrapper(*args, **kwargs):

        print(
            "Calling:",
            function.__name__,
        )

        result = function(
            *args,
            **kwargs,
        )

        print(
            "Result:",
            result,
        )

        return result

    return wrapper


@log_call
def multiply(a, b):

    return a * b


print(
    multiply(5, 4)
)


# ============================================================
# 19. functools.wraps
# ============================================================

from functools import wraps


def decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@decorator
def greet(name):

    """Greet a user."""

    return f"Hello {name}"


print(
    greet.__name__
)

print(
    greet.__doc__
)


"""
functools.wraps preserves metadata
from the original function.
"""


# ============================================================
# 20. WITHOUT functools.wraps
# ============================================================

def bad_decorator(function):

    def wrapper(*args, **kwargs):

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@bad_decorator
def greet():

    """Greeting function."""

    return "Hello"


print(
    greet.__name__
)

print(
    greet.__doc__
)


"""
Without wraps:

    __name__ becomes "wrapper"
    __doc__ may be lost
"""


# ============================================================
# 21. WITH functools.wraps
# ============================================================

def good_decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@good_decorator
def greet():

    """Greeting function."""

    return "Hello"


print(
    greet.__name__
)

print(
    greet.__doc__
)


# ============================================================
# 22. TIMING DECORATOR
# ============================================================

import time


def timer(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        start = time.perf_counter()

        result = function(
            *args,
            **kwargs,
        )

        end = time.perf_counter()

        print(
            f"{function.__name__} "
            f"took {end - start:.6f} seconds"
        )

        return result

    return wrapper


@timer
def slow_function():

    time.sleep(0.5)

    return "Done"


print(
    slow_function()
)


# ============================================================
# 23. LOGGING DECORATOR
# ============================================================

def log_function(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print(
            f"[LOG] {function.__name__}"
        )

        print(
            f"[LOG] args={args}"
        )

        print(
            f"[LOG] kwargs={kwargs}"
        )

        result = function(
            *args,
            **kwargs,
        )

        print(
            f"[LOG] result={result}"
        )

        return result

    return wrapper


@log_function
def add(a, b):

    return a + b


print(
    add(10, 20)
)


# ============================================================
# 24. VALIDATION DECORATOR
# ============================================================

def require_positive(function):

    @wraps(function)
    def wrapper(number):

        if number <= 0:

            raise ValueError(
                "Number must be positive"
            )

        return function(number)

    return wrapper


@require_positive
def square(number):

    return number * number


print(
    square(5)
)


# This would raise ValueError:

# print(square(-5))


# ============================================================
# 25. AUTHORIZATION-STYLE DECORATOR
# ============================================================

def require_admin(function):

    @wraps(function)
    def wrapper(user, *args, **kwargs):

        if user.get("role") != "admin":

            raise PermissionError(
                "Admin access required"
            )

        return function(
            user,
            *args,
            **kwargs,
        )

    return wrapper


@require_admin
def delete_user(user, user_id):

    print(
        f"Deleting user {user_id}"
    )


admin = {
    "name": "Shiva",
    "role": "admin",
}

delete_user(
    admin,
    101,
)


# ============================================================
# 26. STACKABLE DECORATORS
# ============================================================

def decorator_one(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("Decorator 1 - before")

        result = function(
            *args,
            **kwargs,
        )

        print("Decorator 1 - after")

        return result

    return wrapper


def decorator_two(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("Decorator 2 - before")

        result = function(
            *args,
            **kwargs,
        )

        print("Decorator 2 - after")

        return result

    return wrapper


@decorator_one
@decorator_two
def greet():

    print("Hello")


greet()


"""
Execution:

decorator_one
    ↓
decorator_two
    ↓
greet


Before order:

Decorator 1
Decorator 2
greet

After order:

Decorator 2
Decorator 1
"""


# ============================================================
# 27. DECORATOR ORDER MATTERS
# ============================================================

def add_prefix(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        return "PREFIX: " + function(
            *args,
            **kwargs,
        )

    return wrapper


def add_suffix(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        return function(
            *args,
            **kwargs,
        ) + " :SUFFIX"

    return wrapper


@add_prefix
@add_suffix
def message():

    return "Hello"


print(
    message()
)


# ============================================================
# 28. DECORATOR FACTORY
# ============================================================

def repeat(times):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            result = None

            for _ in range(times):

                result = function(
                    *args,
                    **kwargs,
                )

            return result

        return wrapper

    return decorator


@repeat(3)
def greet():

    print("Hello")


greet()


"""
Here we have three levels:

repeat()
    ↓
decorator()
    ↓
wrapper()
"""


# ============================================================
# 29. DECORATOR WITH CONFIGURATION
# ============================================================

def prefix(text):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            result = function(
                *args,
                **kwargs,
            )

            return f"{text}{result}"

        return wrapper

    return decorator


@prefix("Hello: ")
def get_name():

    return "Shiva"


print(
    get_name()
)


# ============================================================
# 30. RETRY DECORATOR
# ============================================================

def retry(times):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            last_error = None

            for attempt in range(times):

                try:

                    return function(
                        *args,
                        **kwargs,
                    )

                except Exception as error:

                    last_error = error

                    print(
                        f"Attempt "
                        f"{attempt + 1} failed"
                    )

            raise last_error

        return wrapper

    return decorator


attempts = 0


@retry(3)
def unstable_function():

    global attempts

    attempts += 1

    if attempts < 3:

        raise RuntimeError(
            "Temporary failure"
        )

    return "Success"


print(
    unstable_function()
)


# ============================================================
# 31. CACHE DECORATOR — CONCEPT
# ============================================================

from functools import lru_cache


@lru_cache
def fibonacci(number):

    if number < 2:

        return number

    return (
        fibonacci(number - 1)
        + fibonacci(number - 2)
    )


print(
    fibonacci(20)
)


"""
lru_cache is itself a decorator.
"""


# ============================================================
# 32. DECORATOR FOR TYPE CHECKING
# ============================================================

def require_integer(function):

    @wraps(function)
    def wrapper(number):

        if not isinstance(
            number,
            int,
        ):

            raise TypeError(
                "number must be an integer"
            )

        return function(number)

    return wrapper


@require_integer
def double(number):

    return number * 2


print(
    double(10)
)


# ============================================================
# 33. DECORATOR WITH *args / **kwargs
# ============================================================

def debug(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print(
            "Function:",
            function.__name__,
        )

        print(
            "Arguments:",
            args,
        )

        print(
            "Keyword arguments:",
            kwargs,
        )

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@debug
def create_user(
    name,
    age,
    city=None,
):

    return {
        "name": name,
        "age": age,
        "city": city,
    }


print(
    create_user(
        "Shiva",
        21,
        city="Guntur",
    )
)


# ============================================================
# 34. DECORATOR THAT MODIFIES RETURN VALUE
# ============================================================

def uppercase(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        result = function(
            *args,
            **kwargs,
        )

        return result.upper()

    return wrapper


@uppercase
def message():

    return "hello python"


print(
    message()
)


# ============================================================
# 35. DECORATOR THAT MODIFIES ARGUMENT
# ============================================================

def strip_arguments(function):

    @wraps(function)
    def wrapper(name):

        name = name.strip()

        return function(name)

    return wrapper


@strip_arguments
def greet(name):

    return f"Hello {name}"


print(
    greet("   Shiva   ")
)


# ============================================================
# 36. CLASS METHOD DECORATORS
# ============================================================

def log_call(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print(
            f"Calling {function.__name__}"
        )

        return function(
            *args,
            **kwargs,
        )

    return wrapper


class Calculator:

    @log_call
    def add(self, a, b):

        return a + b


calculator = Calculator()

print(
    calculator.add(10, 20)
)


# ============================================================
# 37. DECORATOR AND EXCEPTIONS
# ============================================================

def handle_errors(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        try:

            return function(
                *args,
                **kwargs,
            )

        except Exception as error:

            print(
                f"Error: {error}"
            )

            return None

    return wrapper


@handle_errors
def divide(a, b):

    return a / b


print(
    divide(10, 2)
)

print(
    divide(10, 0)
)


# ============================================================
# 38. BEFORE / AFTER / ERROR
# ============================================================

def monitor(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("START")

        try:

            result = function(
                *args,
                **kwargs,
            )

            print("SUCCESS")

            return result

        except Exception:

            print("FAILED")

            raise

        finally:

            print("END")

    return wrapper


@monitor
def divide(a, b):

    return a / b


print(
    divide(10, 2)
)


# ============================================================
# 39. DECORATOR USING A CLOSURE
# ============================================================

def prefix_logger(prefix):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            print(
                f"[{prefix}] "
                f"{function.__name__}"
            )

            return function(
                *args,
                **kwargs,
            )

        return wrapper

    return decorator


@prefix_logger("API")
def get_users():

    return [
        "Shiva",
        "Ram",
    ]


print(
    get_users()
)


# ============================================================
# 40. MULTIPLE CONFIGURABLE DECORATORS
# ============================================================

def log_level(level):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            print(
                f"[{level}] "
                f"{function.__name__}"
            )

            return function(
                *args,
                **kwargs,
            )

        return wrapper

    return decorator


@log_level("INFO")
def start_server():

    print("Server started")


start_server()


# ============================================================
# 41. DECORATOR EXECUTION TIME
# ============================================================

def decorator(function):

    print(
        f"Decorating {function.__name__}"
    )

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("Calling function")

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@decorator
def greet():

    print("Hello")


"""
Notice:

"Decorating greet"

runs when Python defines the function.

"Calling function"

runs when greet() is called.
"""


greet()


# ============================================================
# 42. DECORATOR VS FUNCTION CALL
# ============================================================

def decorator(function):

    @wraps(function)
    def wrapper():

        print("Before")

        function()

    return wrapper


@decorator
def greet():

    print("Hello")


"""
At definition time:

    greet = decorator(greet)


At runtime:

    greet()

calls wrapper().
"""


# ============================================================
# 43. DECORATOR PRESERVES RETURN VALUE
# ============================================================

def decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        result = function(
            *args,
            **kwargs,
        )

        return result

    return wrapper


@decorator
def calculate(a, b):

    return a + b


result = calculate(
    10,
    20,
)

print(result)


# ============================================================
# 44. DECORATOR SHOULD GENERALLY PRESERVE EXCEPTIONS
# ============================================================

def logging_decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print(
            "Calling:",
            function.__name__,
        )

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@logging_decorator
def divide(a, b):

    return a / b


try:

    divide(10, 0)

except ZeroDivisionError:

    print(
        "Exception reached caller"
    )


# ============================================================
# 45. PRACTICAL API DECORATOR
# ============================================================

def endpoint(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print(
            f"Handling endpoint: "
            f"{function.__name__}"
        )

        result = function(
            *args,
            **kwargs,
        )

        return result

    return wrapper


@endpoint
def get_users():

    return [
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
    get_users()
)


# ============================================================
# 46. PRACTICAL SERVICE DECORATOR
# ============================================================

def transaction(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("BEGIN TRANSACTION")

        try:

            result = function(
                *args,
                **kwargs,
            )

            print("COMMIT")

            return result

        except Exception:

            print("ROLLBACK")

            raise

    return wrapper


@transaction
def create_order():

    print("Creating order")

    return "Order created"


print(
    create_order()
)


# ============================================================
# 47. PRACTICAL AUTHORIZATION DECORATOR
# ============================================================

def require_role(role):

    def decorator(function):

        @wraps(function)
        def wrapper(user, *args, **kwargs):

            if user.get("role") != role:

                raise PermissionError(
                    f"{role} role required"
                )

            return function(
                user,
                *args,
                **kwargs,
            )

        return wrapper

    return decorator


@require_role("admin")
def delete_account(user, account_id):

    return (
        f"Deleted account {account_id}"
    )


admin = {
    "name": "Shiva",
    "role": "admin",
}

print(
    delete_account(
        admin,
        100,
    )
)


# ============================================================
# 48. DECORATOR CHAIN
# ============================================================

def log(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("LOG")

        return function(
            *args,
            **kwargs,
        )

    return wrapper


def validate(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("VALIDATE")

        return function(
            *args,
            **kwargs,
        )

    return wrapper


def authorize(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        print("AUTHORIZE")

        return function(
            *args,
            **kwargs,
        )

    return wrapper


@log
@validate
@authorize
def process_request():

    print("PROCESS")


process_request()


"""
Request pipeline:

LOG
 ↓
VALIDATE
 ↓
AUTHORIZE
 ↓
PROCESS
"""


# ============================================================
# 49. DECORATOR FACTORY + *args + **kwargs
# ============================================================

def retry(times):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            for attempt in range(1, times + 1):

                try:

                    return function(
                        *args,
                        **kwargs,
                    )

                except Exception as error:

                    print(
                        f"Attempt "
                        f"{attempt}: {error}"
                    )

            raise RuntimeError(
                "All attempts failed"
            )

        return wrapper

    return decorator


# ============================================================
# 50. COMPLETE DECORATOR TEMPLATE
# ============================================================

def my_decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        # Before behavior
        print("Before")

        # Original function
        result = function(
            *args,
            **kwargs,
        )

        # After behavior
        print("After")

        # Preserve return value
        return result

    return wrapper


@my_decorator
def example(a, b):

    return a + b


print(
    example(10, 20)
)


# ============================================================
# 51. DECORATOR CHEAT SHEET
# ============================================================

"""
BASIC DECORATOR
===============

def decorator(function):

    @wraps(function)
    def wrapper(*args, **kwargs):

        result = function(
            *args,
            **kwargs,
        )

        return result

    return wrapper


USAGE
=====

@decorator
def function():
    ...


EQUIVALENT
==========

function = decorator(function)


DECORATOR FACTORY
=================

def decorator_factory(value):

    def decorator(function):

        @wraps(function)
        def wrapper(*args, **kwargs):

            ...

        return wrapper

    return decorator


USAGE
=====

@decorator_factory(value)
def function():
    ...


IMPORTANT
=========

*args
    captures positional arguments

**kwargs
    captures keyword arguments

@wraps(function)
    preserves function metadata


COMMON USE CASES
================

Logging
Timing
Caching
Authentication
Authorization
Validation
Retry
Transactions
Monitoring
Permissions
Tracing
Rate limiting


CORE IDEA
=========

Original function:

    function()

Decorator:

    function
       ↓
    wrapper
       ↓
    original function


A decorator adds behavior
without changing the original
function's implementation.
"""