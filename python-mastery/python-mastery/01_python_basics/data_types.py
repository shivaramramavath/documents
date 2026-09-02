"""
Python Data Types
=================

Python is dynamically typed, which means a variable does not need
an explicit type declaration.

Example:

    age = 21

Python determines that `age` refers to an integer object.
"""

# ============================================================
# 1. NUMERIC TYPES
# ============================================================

# int - Integer
age = 21
negative_number = -10

print("Integer:", age)
print("Type:", type(age))

# float - Decimal number
height = 5.9
temperature = -2.5

print("Float:", height)
print("Type:", type(height))

# complex - Complex number
complex_number = 3 + 4j

print("Complex:", complex_number)
print("Type:", type(complex_number))

print("Real part:", complex_number.real)
print("Imaginary part:", complex_number.imag)


# ============================================================
# 2. BOOLEAN
# ============================================================

is_student = True
is_working = False

print("Is student:", is_student)
print("Type:", type(is_student))

print("True + True:", True + True)
print("True + False:", True + False)


# ============================================================
# 3. STRING
# ============================================================

name = "Shiva Ram"
message = 'Hello Python'

print("Name:", name)
print("Type:", type(name))

# Multiline string
description = """
Python is a powerful programming language.
It is widely used in backend development and AI.
"""

print(description)


# ============================================================
# 4. LIST
# ============================================================

# Ordered and mutable collection
languages = ["Python", "Java", "JavaScript"]

print("Languages:", languages)
print("Type:", type(languages))

languages.append("C++")

print("After append:", languages)


# ============================================================
# 5. TUPLE
# ============================================================

# Ordered and immutable collection
coordinates = (10, 20)

print("Coordinates:", coordinates)
print("Type:", type(coordinates))


# ============================================================
# 6. SET
# ============================================================

# Unordered collection of unique values
numbers = {1, 2, 3, 3, 4, 4}

print("Set:", numbers)
print("Type:", type(numbers))


# ============================================================
# 7. DICTIONARY
# ============================================================

# Key-value collection
student = {
    "name": "Shiva Ram",
    "age": 21,
    "course": "Computer Science",
}

print("Student:", student)
print("Type:", type(student))


# ============================================================
# 8. NONE
# ============================================================

# None represents the absence of a value.
result = None

print("Result:", result)
print("Type:", type(result))


# ============================================================
# 9. TYPE CHECKING
# ============================================================

value = 100

print(type(value))

print(isinstance(value, int))
print(isinstance(value, str))


# ============================================================
# 10. MUTABLE vs IMMUTABLE
# ============================================================

"""
Mutable:
    Can be changed after creation.

    list
    dict
    set

Immutable:
    Cannot be changed after creation.

    int
    float
    bool
    str
    tuple
    complex
    NoneType
"""

numbers_list = [1, 2, 3]

numbers_list.append(4)

print("Mutable list:", numbers_list)


name = "Python"

# This creates a new string rather than modifying the existing string.
name = name + " Programming"

print("Immutable string:", name)


# ============================================================
# 11. PYTHON DATA TYPES SUMMARY
# ============================================================

data = {
    "integer": 10,
    "float": 10.5,
    "complex": 2 + 3j,
    "boolean": True,
    "string": "Python",
    "list": [1, 2, 3],
    "tuple": (1, 2, 3),
    "set": {1, 2, 3},
    "dictionary": {"name": "Python"},
    "none": None,
}

for name, value in data.items():
    print(f"{name:12} -> {value!r:20} -> {type(value).__name__}")