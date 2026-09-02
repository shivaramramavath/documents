"""
Python Variables
================

A variable is a name that refers to an object.

Example:

    age = 21

Here:

    age  -> variable/name
    21   -> integer object

Python variables do not have a fixed type.
The object has a type, and a variable can later refer
to an object of another type.
"""


# ============================================================
# 1. CREATING A VARIABLE
# ============================================================

name = "Shiva"
age = 21
height = 5.9

print(name)
print(age)
print(height)


# ============================================================
# 2. VARIABLE TYPE
# ============================================================

name = "Shiva"
age = 21
height = 5.9

print(type(name))
print(type(age))
print(type(height))


# ============================================================
# 3. DYNAMIC TYPING
# ============================================================

"""
Python is dynamically typed.

A variable does not need a type declaration.
"""

value = 100

print(value)
print(type(value))

value = "Python"

print(value)
print(type(value))

value = 10.5

print(value)
print(type(value))


# The same variable can refer to different types of objects.


# ============================================================
# 4. VARIABLE ASSIGNMENT
# ============================================================

x = 10

print(x)

x = 20

print(x)

x = 30

print(x)


# Assignment does not mean "x permanently contains 10".
# It means the name x now refers to an object.


# ============================================================
# 5. MULTIPLE VARIABLES
# ============================================================

name = "Shiva"
age = 21
city = "Guntur"

print(name)
print(age)
print(city)


# ============================================================
# 6. MULTIPLE ASSIGNMENT
# ============================================================

a = b = c = 10

print(a)
print(b)
print(c)


# All three names refer to the same integer object.


# ============================================================
# 7. MULTIPLE VALUES IN ONE LINE
# ============================================================

name, age, height = "Shiva", 21, 5.9

print(name)
print(age)
print(height)


# ============================================================
# 8. VARIABLE SWAPPING
# ============================================================

a = 10
b = 20

print("Before:", a, b)

a, b = b, a

print("After:", a, b)


# Python allows swapping without a temporary variable.


# ============================================================
# 9. VARIABLE NAMES
# ============================================================

first_name = "Shiva"
last_name = "Ram"

print(first_name)
print(last_name)


# Valid variable names:

student_name = "Ram"
age2 = 21
_private_value = 100
user123 = "Python"


# ============================================================
# 10. INVALID VARIABLE NAMES
# ============================================================

# These are INVALID:

# 2name = "Shiva"
# first-name = "Shiva"
# first name = "Shiva"
# class = "Python"

# Rules:
#
# 1. Cannot start with a number.
# 2. Cannot contain spaces.
# 3. Cannot use operators such as -.
# 4. Cannot use Python keywords.
# 5. Names are case-sensitive.


# ============================================================
# 11. CASE SENSITIVITY
# ============================================================

name = "Shiva"
Name = "Ram"
NAME = "Python"

print(name)
print(Name)
print(NAME)


# These are three different variable names.


# ============================================================
# 12. PYTHON NAMING CONVENTION
# ============================================================

"""
Python generally uses snake_case for variables.

Good:

    first_name
    student_age
    total_price
    is_logged_in

Avoid:

    firstName
    StudentAge
    TOTALPRICE

Constants are conventionally written in UPPER_CASE.
"""

first_name = "Shiva"
student_age = 21
total_price = 1500

MAX_RETRIES = 3
DEFAULT_TIMEOUT = 30


# ============================================================
# 13. VARIABLES CAN REFER TO OTHER VARIABLES
# ============================================================

first_name = "Shiva"
full_name = first_name + " Ram"

print(full_name)


# ============================================================
# 14. EXPRESSIONS AND VARIABLES
# ============================================================

price = 100
quantity = 3

total = price * quantity

print(total)


# ============================================================
# 15. REASSIGNMENT
# ============================================================

score = 10

print(score)

score = score + 5

print(score)

score += 5

print(score)


# ============================================================
# 16. VARIABLES AND OBJECTS
# ============================================================

"""
Important mental model:

    name = "Shiva"

Python creates/uses an object:

    "Shiva"

and makes the name `name` refer to that object.

Think:

    name ───────► "Shiva"
"""

name = "Shiva"

print(name)


# ============================================================
# 17. TWO VARIABLES CAN REFER TO THE SAME OBJECT
# ============================================================

a = 100
b = a

print(a)
print(b)

print(a == b)
print(a is b)


# For small immutable objects, Python may reuse objects internally.
# Do not use `is` to compare ordinary values.
# Use `==` for value comparison.


# ============================================================
# 18. MUTABLE OBJECT EXAMPLE
# ============================================================

numbers = [1, 2, 3]

other_numbers = numbers

other_numbers.append(4)

print(numbers)
print(other_numbers)


"""
Both names refer to the same list:

numbers
    ↓
[1, 2, 3, 4]
    ↑
other_numbers
"""


# ============================================================
# 19. COPY vs REFERENCE
# ============================================================

original = [1, 2, 3]

reference = original

reference.append(4)

print("Original:", original)
print("Reference:", reference)


# Both changed because both names refer to the same list.


# Create a separate list:

original = [1, 2, 3]

copy = original.copy()

copy.append(4)

print("Original:", original)
print("Copy:", copy)


# ============================================================
# 20. id() FUNCTION
# ============================================================

name = "Python"

print(name)
print(id(name))


# id() gives the identity of an object during its lifetime.


# ============================================================
# 21. VARIABLE DELETION
# ============================================================

temporary_value = 100

print(temporary_value)

del temporary_value

# This would cause NameError:
#
# print(temporary_value)


# `del` removes the name binding.


# ============================================================
# 22. NONE
# ============================================================

result = None

print(result)
print(type(result))


# None is commonly used to represent:
#
# - no value
# - missing value
# - not initialized result
# - function returning nothing explicitly


# ============================================================
# 23. BOOLEAN VARIABLES
# ============================================================

is_logged_in = True
has_permission = False

print(is_logged_in)
print(has_permission)


# Boolean variable names often start with:
#
# is_
# has_
# can_
# should_


# ============================================================
# 24. CONSTANTS
# ============================================================

"""
Python does not have a true constant keyword.

By convention, uppercase names indicate values
that should not be reassigned.
"""

PI = 3.14159
MAX_USERS = 100
API_VERSION = "v1"

print(PI)
print(MAX_USERS)
print(API_VERSION)


# Python technically allows this:

PI = 4

print(PI)

# But doing so violates the convention.


# ============================================================
# 25. TYPE ANNOTATIONS
# ============================================================

"""
Type annotations allow us to document the expected type.

They do NOT normally enforce the type at runtime.
"""

age: int = 21
name: str = "Shiva"
height: float = 5.9
is_student: bool = True

print(age)
print(name)
print(height)
print(is_student)


# ============================================================
# 26. TYPE ANNOTATION WITHOUT INITIAL VALUE
# ============================================================

username: str

username = "Shiva"

print(username)


# ============================================================
# 27. VARIABLE ANNOTATIONS WITH EXPRESSIONS
# ============================================================

price: float = 100.50
quantity: int = 3

total: float = price * quantity

print(total)


# ============================================================
# 28. GLOBAL VARIABLE — BASIC INTRODUCTION
# ============================================================

"""
A variable created outside a function is generally
available in the module's global scope.
"""

app_name = "Python Mastery"

print(app_name)


# We will study scope properly in:
#
# 04_functions/scope.py


# ============================================================
# 29. LOCAL VARIABLE — BASIC INTRODUCTION
# ============================================================

def greet():
    message = "Hello"

    print(message)


greet()

# `message` exists inside the function's local scope.


# This would cause NameError:
#
# print(message)


# ============================================================
# 30. BUILT-IN NAMES
# ============================================================

"""
Python already provides many built-in names:

    print
    len
    type
    int
    str
    list
    dict
    sum
    max
    min

Avoid naming your variables after important built-ins.
"""

# Bad:

# list = [1, 2, 3]

# Now `list` no longer refers to the built-in list type
# in this scope.


# Good:

numbers = [1, 2, 3]

print(numbers)


# ============================================================
# 31. VARIABLE SHADOWING
# ============================================================

value = 100

def example():
    value = 200
    print("Inside:", value)


example()

print("Outside:", value)


# The local `value` shadows the global `value` inside
# the function.


# ============================================================
# 32. UNPACKING
# ============================================================

numbers = [10, 20, 30]

a, b, c = numbers

print(a)
print(b)
print(c)


# ============================================================
# 33. STAR UNPACKING
# ============================================================

numbers = [1, 2, 3, 4, 5]

first, *middle, last = numbers

print("First:", first)
print("Middle:", middle)
print("Last:", last)


# ============================================================
# 34. DISCARDING VALUES
# ============================================================

name, _, age = ("Shiva", "unused", 21)

print(name)
print(age)


# `_` is conventionally used for a value we don't care about.


# ============================================================
# 35. VARIABLE REFERENCES
# ============================================================

x = 10
y = x

print(x)
print(y)

x = 20

print(x)
print(y)


"""
After:

    x = 20

only x is rebound.

y still refers to the original object.
"""


# ============================================================
# 36. PRACTICAL EXAMPLE — STUDENT
# ============================================================

student_name = "Shiva Ram"
student_age = 21
student_branch = "Computer Science"
student_marks = 85.5
is_passed = True

print("Student:", student_name)
print("Age:", student_age)
print("Branch:", student_branch)
print("Marks:", student_marks)
print("Passed:", is_passed)


# ============================================================
# 37. PRACTICAL EXAMPLE — PRODUCT
# ============================================================

product_name = "Laptop"
product_price = 65000
product_quantity = 2

total_price = product_price * product_quantity

print(f"Product: {product_name}")
print(f"Price: ₹{product_price}")
print(f"Quantity: {product_quantity}")
print(f"Total: ₹{total_price}")


# ============================================================
# 38. VARIABLE LIFECYCLE — SIMPLE MODEL
# ============================================================

"""
Example:

    age = 21

Step 1:
    Python evaluates 21.

Step 2:
    Python has an integer object representing 21.

Step 3:
    The name `age` refers to that object.

Then:

    age = 25

The name `age` is rebound to another integer object.

The old object may later be cleaned up if nothing
else refers to it.
"""


# ============================================================
# 39. IMPORTANT MENTAL MODEL
# ============================================================

"""
Do NOT think:

    age = box containing 21

Think:

    age ───────► 21

Variables are names/references to objects.

This becomes extremely important when learning:

    lists
    dictionaries
    functions
    mutable vs immutable objects
    shallow copy
    deep copy
    classes
    memory management
"""


# ============================================================
# 40. FINAL SUMMARY
# ============================================================

"""
VARIABLES
---------

Creating:
    name = "Shiva"

Dynamic typing:
    value = 10
    value = "Python"

Multiple assignment:
    a = b = c = 10

Unpacking:
    a, b, c = [1, 2, 3]

Swapping:
    a, b = b, a

Type:
    type(value)

Object identity:
    id(value)

Deletion:
    del value

No value:
    value = None

Type annotation:
    age: int = 21

Naming convention:
    snake_case

Constants convention:
    MAX_SIZE = 100

Boolean naming:
    is_active
    has_permission
    can_edit

Most important mental model:

    variable/name ─────► object
"""