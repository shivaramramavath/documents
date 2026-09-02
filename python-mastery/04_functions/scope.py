"""
Python Variable Scope
=====================

Scope determines where a variable can be accessed.

Python follows the LEGB rule:

    L -> Local
    E -> Enclosing
    G -> Global
    B -> Built-in

This file covers:

    1. Local scope
    2. Global scope
    3. Enclosing scope
    4. Built-in scope
    5. LEGB rule
    6. global keyword
    7. nonlocal keyword
    8. Nested functions
    9. Closures
    10. Variable shadowing
    11. Scope best practices
"""


# ============================================================
# 1. GLOBAL VARIABLE
# ============================================================

name = "Shiva"

print(name)


"""
name exists at module/global scope.
"""


# ============================================================
# 2. LOCAL VARIABLE
# ============================================================

def greet():

    message = "Hello"

    print(message)


greet()


"""
message exists only inside greet().
"""


# ============================================================
# 3. LOCAL VARIABLE CANNOT NORMALLY BE ACCESSED OUTSIDE
# ============================================================

def greet():

    message = "Hello"

    print(message)


greet()

# This would raise NameError:
#
# print(message)


# ============================================================
# 4. EACH FUNCTION HAS ITS OWN LOCAL SCOPE
# ============================================================

def first():

    name = "First"

    print(name)


def second():

    name = "Second"

    print(name)


first()
second()


"""
Both functions can have a variable named `name`.

They are different local variables.
"""


# ============================================================
# 5. GLOBAL VARIABLE ACCESS
# ============================================================

name = "Shiva"


def greet():

    print(name)


greet()


"""
Python cannot find name locally,
so it searches the global scope.
"""


# ============================================================
# 6. LOCAL VARIABLE SHADOWS GLOBAL VARIABLE
# ============================================================

name = "Global Shiva"


def greet():

    name = "Local Shiva"

    print(name)


greet()

print(name)


"""
Inside greet():

    name -> Local Shiva

Outside:

    name -> Global Shiva
"""


# ============================================================
# 7. VARIABLE SHADOWING
# ============================================================

value = 100


def example():

    value = 200

    print("Inside:", value)


example()

print("Outside:", value)


"""
The local variable shadows the global variable.
"""


# ============================================================
# 8. LEGB RULE
# ============================================================

"""
Python searches for a variable in this order:

    L -> Local
    E -> Enclosing
    G -> Global
    B -> Built-in
"""


# ============================================================
# 9. LEGB - LOCAL
# ============================================================

value = "global"


def example():

    value = "local"

    print(value)


example()


"""
Python finds value locally first.
"""


# ============================================================
# 10. LEGB - ENCLOSING
# ============================================================

value = "global"


def outer():

    value = "enclosing"

    def inner():

        print(value)

    inner()


outer()


"""
inner() does not have value locally.

Python searches the enclosing scope.
"""


# ============================================================
# 11. LEGB - GLOBAL
# ============================================================

value = "global"


def outer():

    def inner():

        print(value)

    inner()


outer()


"""
No local value.
No enclosing value.

Python finds the global value.
"""


# ============================================================
# 12. LEGB - BUILT-IN
# ============================================================

def example():

    print(len([1, 2, 3]))


example()


"""
len is found in Python's built-in namespace.
"""


# ============================================================
# 13. BUILT-IN VARIABLES / FUNCTIONS
# ============================================================

print(len([1, 2, 3]))
print(sum([1, 2, 3]))
print(max([10, 20, 30]))
print(type(10))


# ============================================================
# 14. DON'T SHADOW BUILT-INS
# ============================================================

"""
Avoid:

    list = [1, 2, 3]
    str = "hello"
    sum = 100
    type = "number"

Example:
"""


# Bad:

# list = [1, 2, 3]

# Then this becomes problematic:
#
# list("Python")


# ============================================================
# 15. GLOBAL KEYWORD
# ============================================================

counter = 0


def increment():

    global counter

    counter += 1


increment()
increment()
increment()

print(counter)


"""
global tells Python:

"Use the variable from the global scope."
"""


# ============================================================
# 16. WITHOUT global
# ============================================================

counter = 0


def increment():

    # counter += 1

    pass


"""
This would cause UnboundLocalError:

    counter += 1

Why?

Python treats counter as local because
the function assigns to it.
"""


# ============================================================
# 17. GLOBAL READ VS GLOBAL WRITE
# ============================================================

name = "Shiva"


def show_name():

    print(name)


show_name()


"""
Reading a global variable does not require global.
"""


# ============================================================
# 18. GLOBAL WRITE REQUIRES global
# ============================================================

count = 0


def increment():

    global count

    count += 1


increment()

print(count)


# ============================================================
# 19. GLOBAL ASSIGNMENT
# ============================================================

message = "Hello"


def change_message():

    global message

    message = "Good morning"


change_message()

print(message)


# ============================================================
# 20. GLOBAL DELETE
# ============================================================

value = 100


def delete_value():

    global value

    del value


delete_value()

# value no longer exists.


# ============================================================
# 21. NESTED FUNCTION
# ============================================================

def outer():

    print("Outer")

    def inner():

        print("Inner")

    inner()


outer()


"""
inner() exists inside outer().
"""


# ============================================================
# 22. INNER FUNCTION CAN ACCESS OUTER VARIABLE
# ============================================================

def outer():

    message = "Hello from outer"

    def inner():

        print(message)

    inner()


outer()


"""
inner() searches its local scope.

If message isn't found,
it searches the enclosing scope.
"""


# ============================================================
# 23. ENCLOSING SCOPE
# ============================================================

def outer():

    x = 10

    def inner():

        print(x)

    inner()


outer()


"""
x belongs to outer().

For inner(), it is an enclosing variable.
"""


# ============================================================
# 24. MODIFYING ENCLOSING VARIABLE — PROBLEM
# ============================================================

def outer():

    count = 0

    def inner():

        # count += 1

        pass

    inner()


outer()


"""
This doesn't work because assignment makes
count local to inner().

Use nonlocal.
"""


# ============================================================
# 25. nonlocal KEYWORD
# ============================================================

def outer():

    count = 0

    def inner():

        nonlocal count

        count += 1

        print(count)

    inner()
    inner()
    inner()


outer()


"""
nonlocal means:

"Use the variable from the nearest
enclosing function scope."
"""


# ============================================================
# 26. nonlocal DOES NOT MEAN GLOBAL
# ============================================================

count = 100


def outer():

    count = 10

    def inner():

        nonlocal count

        count += 1

    inner()

    print("Outer:", count)


outer()

print("Global:", count)


"""
nonlocal modified:

    outer count

It did NOT modify:

    global count
"""


# ============================================================
# 27. GLOBAL VS NONLOCAL
# ============================================================

global_value = 100


def outer():

    local_value = 10

    def inner():

        global global_value
        nonlocal local_value

        global_value += 1
        local_value += 1

    inner()

    print(
        "Local:",
        local_value,
    )


outer()

print(
    "Global:",
    global_value,
)


# ============================================================
# 28. MULTIPLE NESTED SCOPES
# ============================================================

def level_one():

    x = 1

    def level_two():

        y = 2

        def level_three():

            z = 3

            print(x)
            print(y)
            print(z)

        level_three()

    level_two()


level_one()


"""
level_three can access:

    z -> local
    y -> enclosing
    x -> enclosing
"""


# ============================================================
# 29. LEGB PRACTICAL EXAMPLE
# ============================================================

x = "global"


def outer():

    x = "enclosing"

    def inner():

        x = "local"

        print(x)

    inner()


outer()


"""
Result:

local

Because Local wins.
"""


# ============================================================
# 30. LEGB WITH BUILT-IN
# ============================================================

def example():

    numbers = [1, 2, 3]

    print(len(numbers))


example()


"""
len is not local.
len is not enclosing.
len is not global.

Python finds it in Built-ins.
"""


# ============================================================
# 31. globals()
# ============================================================

name = "Shiva"


def show_globals():

    print(
        globals()["name"]
    )


show_globals()


"""
globals() returns the global namespace
as a dictionary.
"""


# ============================================================
# 32. locals()
# ============================================================

def example():

    name = "Shiva"
    age = 21

    print(locals())


example()


"""
locals() returns the current local namespace.
"""


# ============================================================
# 33. globals() AND locals()
# ============================================================

name = "Global"


def example():

    value = "Local"

    print(
        "Global:",
        globals()["name"],
    )

    print(
        "Local:",
        locals()["value"],
    )


example()


# ============================================================
# 34. SCOPE OF FUNCTION PARAMETERS
# ============================================================

def greet(name):

    print(name)


greet("Shiva")

# name does not exist here.


# ============================================================
# 35. FUNCTION PARAMETER IS LOCAL
# ============================================================

def calculate(a, b):

    result = a + b

    print(result)


calculate(10, 20)


"""
a
b
result

all belong to calculate()'s local scope.
"""


# ============================================================
# 36. LOOP VARIABLES AND SCOPE
# ============================================================

for i in range(3):

    print(i)


print(i)


"""
Important:

Python's for-loop does NOT create
a separate block scope.

i remains accessible afterward.
"""


# ============================================================
# 37. IF BLOCK DOES NOT CREATE SCOPE
# ============================================================

if True:

    message = "Hello"


print(message)


"""
if/else blocks don't create a new scope.
"""


# ============================================================
# 38. FUNCTION DOES CREATE SCOPE
# ============================================================

def example():

    message = "Hello"


example()

# print(message)
# NameError


# ============================================================
# 39. COMPREHENSION SCOPE
# ============================================================

numbers = [
    x * 2
    for x in range(5)
]

print(numbers)


# In Python 3:

# x is not available here.

# print(x)


"""
List/set/dictionary comprehensions have
their own iteration variable scope.
"""


# ============================================================
# 40. CLASS SCOPE
# ============================================================

class User:

    name = "Shiva"


print(User.name)


"""
Classes have their own namespace.

Class scope behaves differently from
function local scope.
"""


# ============================================================
# 41. CLASS SCOPE AND METHODS
# ============================================================

name = "Global"


class User:

    name = "Class"

    def show(self):

        print(name)


user = User()

user.show()


"""
Inside the method, `name` does NOT automatically
resolve to the class variable.

It resolves using the normal function LEGB rules.
"""


# ============================================================
# 42. ACCESSING CLASS VARIABLE
# ============================================================

class User:

    name = "Shiva"

    def show(self):

        print(self.name)


user = User()

user.show()


# ============================================================
# 43. CLOSURE
# ============================================================

def outer():

    message = "Hello"

    def inner():

        print(message)

    return inner


function = outer()

function()


"""
inner() remembers message even after
outer() has finished.

This is a closure.
"""


# ============================================================
# 44. CLOSURE WITH VALUE
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
double remembers:

    multiplier = 2

triple remembers:

    multiplier = 3
"""


# ============================================================
# 45. CLOSURE STATE
# ============================================================

def create_counter():

    count = 0

    def counter():

        nonlocal count

        count += 1

        return count

    return counter


counter = create_counter()

print(counter())
print(counter())
print(counter())


# ============================================================
# 46. CLOSURE HAS PERSISTENT STATE
# ============================================================

def create_counter():

    count = 0

    def increment():

        nonlocal count

        count += 1

        return count

    return increment


counter_a = create_counter()
counter_b = create_counter()


print(counter_a())
print(counter_a())

print(counter_b())
print(counter_b())


"""
counter_a and counter_b have
independent enclosed state.
"""


# ============================================================
# 47. CLOSURE __closure__
# ============================================================

def create_multiplier(multiplier):

    def multiply(number):

        return number * multiplier

    return multiply


double = create_multiplier(2)

print(double.__closure__)


# ============================================================
# 48. CLOSURE CELL
# ============================================================

def create_multiplier(multiplier):

    def multiply(number):

        return number * multiplier

    return multiply


double = create_multiplier(2)

if double.__closure__:

    for cell in double.__closure__:

        print(
            cell.cell_contents
        )


# ============================================================
# 49. CLOSURE VS GLOBAL
# ============================================================

multiplier = 2


def multiply_global(number):

    return number * multiplier


print(
    multiply_global(10)
)


def create_multiplier(multiplier):

    def multiply(number):

        return number * multiplier

    return multiply


multiply_by_two = create_multiplier(2)

print(
    multiply_by_two(10)
)


"""
Closures allow state/configuration to be
encapsulated without using global variables.
"""


# ============================================================
# 50. VARIABLE SHADOWING
# ============================================================

name = "Global"


def outer():

    name = "Outer"

    def inner():

        name = "Inner"

        print(name)

    inner()


outer()


"""
The closest scope wins.
"""


# ============================================================
# 51. SHADOWING WITH PARAMETERS
# ============================================================

name = "Global"


def greet(name):

    print(name)


greet("Shiva")


"""
The parameter name shadows the global name.
"""


# ============================================================
# 52. AVOID EXCESSIVE GLOBAL VARIABLES
# ============================================================

"""
Avoid:

    database_connection = ...

    current_user = ...

    configuration = ...


    def function():
        global database_connection
        ...


Large applications become difficult
to reason about when global mutable state
is everywhere.
"""


# ============================================================
# 53. PREFER FUNCTION PARAMETERS
# ============================================================

def calculate_total(
    price,
    quantity,
):

    return price * quantity


print(
    calculate_total(
        100,
        5,
    )
)


"""
Dependencies are explicit.
"""


# ============================================================
# 54. PREFER RETURN VALUES
# ============================================================

def calculate_total(
    price,
    quantity,
):

    return price * quantity


total = calculate_total(
    100,
    5,
)

print(total)


"""
Returning values is usually easier to test
than modifying global state.
"""


# ============================================================
# 55. DEPENDENCY THROUGH PARAMETERS
# ============================================================

def send_message(
    message,
    logger,
):

    logger(message)


def logger(message):

    print(
        "LOG:",
        message,
    )


send_message(
    "Hello",
    logger,
)


"""
The function receives its dependency
instead of accessing a global logger.

This idea becomes important in:

    dependency injection
    FastAPI
    testing
    clean architecture
"""


# ============================================================
# 56. CLOSURE AS CONFIGURATION
# ============================================================

def create_logger(prefix):

    def log(message):

        print(
            f"[{prefix}] {message}"
        )

    return log


info = create_logger("INFO")
error = create_logger("ERROR")


info("Server started")
error("Database failed")


# ============================================================
# 57. NESTED FUNCTION + nonlocal
# ============================================================

def create_account():

    balance = 0

    def deposit(amount):

        nonlocal balance

        balance += amount

        return balance

    def withdraw(amount):

        nonlocal balance

        if amount > balance:
            return False

        balance -= amount

        return True

    return deposit, withdraw


deposit, withdraw = create_account()

print(
    deposit(100)
)

print(
    withdraw(30)
)

print(
    deposit(50)
)


"""
The balance is private to the closure.

This is one way to achieve encapsulated state.
"""


# ============================================================
# 58. LEGB EXAMPLE
# ============================================================

x = "GLOBAL"


def outer():

    x = "ENCLOSING"

    def inner():

        x = "LOCAL"

        print(x)

    inner()


outer()


# ============================================================
# 59. BUILT-IN SHADOWING EXAMPLE
# ============================================================

def example():

    len = 100

    print(len)


example()


"""
Inside this function:

len -> 100

The built-in len() is shadowed.

Avoid this in real code.
"""


# ============================================================
# 60. GLOBAL VS LOCAL STATE
# ============================================================

counter = 0


def bad_increment():

    global counter

    counter += 1


bad_increment()

print(counter)


def good_increment(counter):

    return counter + 1


counter = 0

counter = good_increment(counter)

print(counter)


"""
The second design makes state flow explicit.
"""


# ============================================================
# 61. SCOPE AND IMPORTS
# ============================================================

import math


def calculate_circle_area(radius):

    return math.pi * radius ** 2


print(
    calculate_circle_area(5)
)


"""
Imported names are normally available
in the module/global namespace.
"""


# ============================================================
# 62. LOCAL IMPORT
# ============================================================

def calculate_square_root(number):

    import math

    return math.sqrt(number)


print(
    calculate_square_root(25)
)


"""
Imports can technically be local.

Usually place imports at module level unless
there is a specific reason not to.
"""


# ============================================================
# 63. NONLOCAL WITH MULTIPLE LEVELS
# ============================================================

def level_one():

    value = 10

    def level_two():

        def level_three():

            nonlocal value

            value += 1

        level_three()

        print(value)

    level_two()


level_one()


"""
nonlocal searches enclosing function scopes
until it finds the variable.
"""


# ============================================================
# 64. NONLOCAL CAN'T TARGET GLOBAL
# ============================================================

value = 10


def example():

    # nonlocal value
    pass


"""
This is invalid.

nonlocal requires an enclosing function scope.

It cannot directly target a global variable.
"""


# ============================================================
# 65. GLOBAL + NONLOCAL CONCEPT
# ============================================================

global_count = 0


def outer():

    local_count = 0

    def inner():

        global global_count
        nonlocal local_count

        global_count += 1
        local_count += 1

    inner()

    print(
        "Local:",
        local_count,
    )


outer()

print(
    "Global:",
    global_count,
)


# ============================================================
# 66. PRACTICAL CONFIGURATION CLOSURE
# ============================================================

def create_api_client(
    base_url,
):

    def get_url(endpoint):

        return (
            f"{base_url}/{endpoint}"
        )

    return get_url


client = create_api_client(
    "https://api.example.com"
)

print(
    client("users")
)

print(
    client("products")
)


# ============================================================
# 67. CLOSURE FOR AUTHORIZATION
# ============================================================

def create_authorizer(
    required_role,
):

    def authorize(user):

        return (
            user.get("role")
            == required_role
        )

    return authorize


is_admin = create_authorizer(
    "admin"
)

is_student = create_authorizer(
    "student"
)


admin = {
    "role": "admin",
}

student = {
    "role": "student",
}


print(
    is_admin(admin)
)

print(
    is_student(student)
)


# ============================================================
# 68. SCOPE BEST PRACTICE
# ============================================================

"""
Prefer:

    def calculate(price, quantity):
        return price * quantity


Over:

    price = 100
    quantity = 5

    def calculate():
        return price * quantity


Why?

Explicit dependencies are:

    easier to understand
    easier to test
    easier to reuse
    easier to maintain
"""


# ============================================================
# 69. SCOPE CHEAT SHEET
# ============================================================

"""
LOCAL
=====

def function():

    value = 10


ENCLOSING
=========

def outer():

    value = 10

    def inner():
        print(value)


GLOBAL
======

value = 10


def function():
    print(value)


BUILT-IN
========

len()
sum()
max()
min()
print()
type()


LEGB
====

Local
Enclosing
Global
Built-in


GLOBAL KEYWORD
==============

count = 0


def increment():

    global count

    count += 1


NONLOCAL
========

def outer():

    count = 0

    def inner():

        nonlocal count

        count += 1


CLOSURE
=======

def outer():

    value = 10

    def inner():

        return value

    return inner


function = outer()

function()


IMPORTANT
=========

global
    -> modify global variable

nonlocal
    -> modify variable in enclosing function


FUNCTION SCOPE
==============

Functions create scope.


IF / FOR
========

if and for blocks do not normally
create a separate scope.


COMPREHENSIONS
==============

Python 3 comprehensions have their
own iteration-variable scope.


BEST PRACTICE
=============

Prefer:

    parameters
    return values
    local state
    dependency injection

Avoid unnecessary:

    global mutable state
    variable shadowing
    hidden dependencies
"""