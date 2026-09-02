"""
Python Type Casting / Type Conversion
=====================================

Type casting means converting a value from one data type
to another data type.

Common conversion functions:

    int()
    float()
    str()
    bool()
    list()
    tuple()
    set()
    dict()

Python supports both:

1. Implicit type conversion
2. Explicit type conversion
"""


# ============================================================
# 1. CHECKING THE TYPE
# ============================================================

value = 100

print(value)
print(type(value))


# ============================================================
# 2. EXPLICIT TYPE CASTING
# ============================================================

# Explicit conversion means we tell Python which type
# we want.

number = "100"

integer_number = int(number)

print(integer_number)
print(type(integer_number))


# ============================================================
# 3. STRING → INTEGER
# ============================================================

age = "21"

age = int(age)

print(age)
print(type(age))


# This is especially important with input():

age = input("Enter your age: ")

print(age)
print(type(age))

age = int(age)

print(age)
print(type(age))


# Shorter version:

age = int(input("Enter your age: "))

print(age)
print(type(age))


# ============================================================
# 4. STRING → FLOAT
# ============================================================

price = "99.99"

price = float(price)

print(price)
print(type(price))


# ============================================================
# 5. INTEGER → FLOAT
# ============================================================

number = 10

result = float(number)

print(result)
print(type(result))


# ============================================================
# 6. FLOAT → INTEGER
# ============================================================

number = 10.99

result = int(number)

print(result)

# Output:
#
# 10
#
# int() removes the decimal portion.
# It does NOT round the number.


number = 10.99

print(int(number))


# ============================================================
# 7. STRING → BOOLEAN
# ============================================================

print(bool("True"))
print(bool("False"))

# Both are True!
#
# Why?
#
# Any non-empty string is truthy.


print(bool(""))
print(bool("hello"))


# If you need to interpret the text "true"/"false",
# you need explicit logic rather than simply bool().


value = "true"

result = value.lower() == "true"

print(result)


# ============================================================
# 8. INTEGER → STRING
# ============================================================

age = 21

age_text = str(age)

print(age_text)
print(type(age_text))


# Useful when combining values with strings.

age = 21

print("Age: " + str(age))


# But f-strings are usually cleaner:

print(f"Age: {age}")


# ============================================================
# 9. FLOAT → STRING
# ============================================================

price = 99.99

price_text = str(price)

print(price_text)
print(type(price_text))


# ============================================================
# 10. BOOLEAN → INTEGER
# ============================================================

print(int(True))
print(int(False))

# True  → 1
# False → 0


# ============================================================
# 11. BOOLEAN → FLOAT
# ============================================================

print(float(True))
print(float(False))


# ============================================================
# 12. BOOLEAN → STRING
# ============================================================

print(str(True))
print(str(False))

print(type(str(True)))


# ============================================================
# 13. INTEGER → BOOLEAN
# ============================================================

print(bool(0))
print(bool(1))
print(bool(10))
print(bool(-10))

# 0     → False
# non-0 → True


# ============================================================
# 14. FLOAT → BOOLEAN
# ============================================================

print(bool(0.0))
print(bool(0.1))
print(bool(-1.5))


# ============================================================
# 15. STRING → LIST
# ============================================================

text = "Python"

characters = list(text)

print(characters)
print(type(characters))


# ============================================================
# 16. STRING → TUPLE
# ============================================================

text = "Python"

characters = tuple(text)

print(characters)
print(type(characters))


# ============================================================
# 17. STRING → SET
# ============================================================

text = "banana"

characters = set(text)

print(characters)
print(type(characters))

# Duplicate characters are removed.


# ============================================================
# 18. LIST → TUPLE
# ============================================================

numbers = [1, 2, 3, 4]

numbers_tuple = tuple(numbers)

print(numbers_tuple)
print(type(numbers_tuple))


# ============================================================
# 19. TUPLE → LIST
# ============================================================

numbers = (1, 2, 3, 4)

numbers_list = list(numbers)

print(numbers_list)
print(type(numbers_list))


# ============================================================
# 20. LIST → SET
# ============================================================

numbers = [1, 2, 2, 3, 3, 4]

unique_numbers = set(numbers)

print(unique_numbers)


# ============================================================
# 21. SET → LIST
# ============================================================

numbers = {1, 2, 3, 4}

numbers_list = list(numbers)

print(numbers_list)


# ============================================================
# 22. DICTIONARY CONVERSION
# ============================================================

pairs = [
    ("name", "Shiva"),
    ("age", 21),
    ("language", "Python"),
]

student = dict(pairs)

print(student)
print(type(student))


# ============================================================
# 23. IMPLICIT TYPE CONVERSION
# ============================================================

"""
Python can automatically convert certain compatible
numeric types.

For example:

int + float → float
"""

integer_number = 10
float_number = 5.5

result = integer_number + float_number

print(result)
print(type(result))


# Python automatically converts:

# int → float


# ============================================================
# 24. ANOTHER IMPLICIT CONVERSION
# ============================================================

result = 10 + 2.5

print(result)
print(type(result))


# ============================================================
# 25. PYTHON DOES NOT AUTOMATICALLY CONVERT STRINGS
# ============================================================

number = "10"

# This will NOT work:
#
# result = number + 5
#
# Python raises:
#
# TypeError
#
# Because "10" is a string and 5 is an integer.


# Correct:

result = int(number) + 5

print(result)


# ============================================================
# 26. INVALID INTEGER CONVERSION
# ============================================================

# This raises ValueError:
#
# number = int("hello")


# This also raises ValueError:
#
# number = int("10.5")


# Correct:

number = int(float("10.5"))

print(number)


# ============================================================
# 27. INVALID FLOAT CONVERSION
# ============================================================

# This raises ValueError:
#
# number = float("hello")


# ============================================================
# 28. BASE CONVERSION WITH int()
# ============================================================

binary = "1010"

number = int(binary, 2)

print(number)

# 1010 (binary) = 10 (decimal)


hexadecimal = "FF"

number = int(hexadecimal, 16)

print(number)


octal = "17"

number = int(octal, 8)

print(number)


# ============================================================
# 29. INTEGER → DIFFERENT NUMBER BASES
# ============================================================

number = 255

print(bin(number))
print(oct(number))
print(hex(number))


# ============================================================
# 30. TYPE CASTING IN CALCULATIONS
# ============================================================

first = input("Enter first number: ")
second = input("Enter second number: ")

first = int(first)
second = int(second)

print("Sum:", first + second)


# ============================================================
# 31. PRACTICAL EXAMPLE — STUDENT MARKS
# ============================================================

marks = input("Enter your marks: ")

marks = float(marks)

print("Marks:", marks)

if marks >= 40:
    print("Pass")
else:
    print("Fail")


# ============================================================
# 32. PRACTICAL EXAMPLE — SHOPPING
# ============================================================

price = float(input("Enter product price: "))
quantity = int(input("Enter quantity: "))

total = price * quantity

print(f"Total: ₹{total:.2f}")


# ============================================================
# 33. PRACTICAL EXAMPLE — TEMPERATURE
# ============================================================

celsius = float(input("Enter temperature in Celsius: "))

fahrenheit = (celsius * 9 / 5) + 32

print(f"Fahrenheit: {fahrenheit:.2f}")


# ============================================================
# 34. TYPE CASTING vs TYPE CHECKING
# ============================================================

value = "100"

print(type(value))

value = int(value)

print(type(value))


# type()
#   → tells us the type
#
# int(), float(), str(), etc.
#   → convert the value


# ============================================================
# 35. isinstance()
# ============================================================

value = 100

print(isinstance(value, int))
print(isinstance(value, float))
print(isinstance(value, str))


# ============================================================
# 36. SAFE INTEGER CONVERSION
# ============================================================

value = "123"

try:
    number = int(value)
    print("Converted:", number)

except ValueError:
    print("Invalid integer")


# ============================================================
# 37. COMMON CONVERSION TABLE
# ============================================================

"""
int("10")       → 10
float("10.5")   → 10.5
str(100)        → "100"
bool(0)         → False
bool(1)         → True

list("abc")     → ['a', 'b', 'c']
tuple([1, 2])   → (1, 2)
set([1, 1, 2])  → {1, 2}
dict([...])     → dictionary
"""


# ============================================================
# 38. IMPORTANT DIFFERENCE
# ============================================================

number = 10.99

print(int(number))
print(round(number))

# int(10.99)   → 10
# round(10.99)  → 11


# ============================================================
# 39. NO UNIVERSAL TYPE CASTING
# ============================================================

"""
Not every type can be converted to every other type.

Examples:

int("100")       → works
int("hello")     → ValueError

float("10.5")    → works
float("hello")   → ValueError

int(10.5)        → works
int(None)        → TypeError

list(123)        → TypeError
"""


# ============================================================
# 40. FINAL EXAMPLE
# ============================================================

"""
User input
    ↓
input()
    ↓
string
    ↓
type conversion
    ↓
int / float
    ↓
calculation
    ↓
output
"""

name = input("Enter your name: ")
age = int(input("Enter your age: "))
salary = float(input("Enter your monthly salary: "))

print()
print("----- Profile -----")
print(f"Name: {name}")
print(f"Age: {age}")
print(f"Salary: ₹{salary:.2f}")
print(f"Annual salary: ₹{salary * 12:.2f}")