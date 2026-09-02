"""
Python Operators
================

Operators are symbols or keywords used to perform operations
on values and variables.

Categories covered:

1. Arithmetic operators
2. Comparison operators
3. Logical operators
4. Assignment operators
5. Membership operators
6. Identity operators
7. Bitwise operators
8. Operator precedence
"""

# ============================================================
# 1. ARITHMETIC OPERATORS
# ============================================================

a = 10
b = 3

print("a =", a)
print("b =", b)

print("Addition:       ", a + b)
print("Subtraction:    ", a - b)
print("Multiplication: ", a * b)
print("Division:        ", a / b)
print("Floor division: ", a // b)
print("Modulus:         ", a % b)
print("Exponentiation: ", a ** b)


# ------------------------------------------------------------
# Arithmetic operators
# ------------------------------------------------------------
#
# +    Addition
# -    Subtraction
# *    Multiplication
# /    Division
# //   Floor division
# %    Remainder
# **   Power
#


# ============================================================
# 2. DIVISION vs FLOOR DIVISION
# ============================================================

print(10 / 3)
print(10 // 3)

print(20 / 6)
print(20 // 6)

# / always produces a floating-point result.
#
# // performs floor division.
#
# Important:
# Floor division rounds DOWN, not simply toward zero.

print(10 // 3)      # 3
print(-10 // 3)     # -4


# ============================================================
# 3. MODULUS OPERATOR
# ============================================================

print(10 % 3)
print(15 % 5)
print(17 % 4)

# Modulus gives the remainder.

# Useful for checking even/odd numbers.

number = 10

print("Even:", number % 2 == 0)


# ============================================================
# 4. EXPONENTIATION
# ============================================================

print(2 ** 3)
print(5 ** 2)
print(10 ** 3)

# 2 ** 3 = 2 × 2 × 2 = 8


# ============================================================
# 5. COMPARISON OPERATORS
# ============================================================

x = 10
y = 20

print("Equal:              ", x == y)
print("Not equal:          ", x != y)
print("Greater than:       ", x > y)
print("Less than:          ", x < y)
print("Greater/equal:      ", x >= y)
print("Less/equal:         ", x <= y)


# Comparison operators always return True or False.


# ============================================================
# 6. COMPARISON WITH STRINGS
# ============================================================

name1 = "Python"
name2 = "Python"

print(name1 == name2)

print("apple" < "banana")


# ============================================================
# 7. CHAINED COMPARISONS
# ============================================================

age = 21

print(18 <= age <= 60)

# Equivalent to:
#
# age >= 18 and age <= 60


marks = 85

print(0 <= marks <= 100)


# ============================================================
# 8. LOGICAL OPERATORS
# ============================================================

# and
# or
# not

age = 21
has_id = True

print(age >= 18 and has_id)

print(age < 18 or has_id)

print(not has_id)


# ------------------------------------------------------------
# AND
# ------------------------------------------------------------

print(True and True)
print(True and False)
print(False and True)
print(False and False)


# ------------------------------------------------------------
# OR
# ------------------------------------------------------------

print(True or True)
print(True or False)
print(False or True)
print(False or False)


# ------------------------------------------------------------
# NOT
# ------------------------------------------------------------

print(not True)
print(not False)


# ============================================================
# 9. LOGICAL OPERATORS WITH CONDITIONS
# ============================================================

age = 22
is_student = True

can_get_discount = age < 25 and is_student

print("Discount:", can_get_discount)


# ============================================================
# 10. ASSIGNMENT OPERATORS
# ============================================================

number = 10

print(number)

number += 5
print(number)

number -= 3
print(number)

number *= 2
print(number)

number /= 4
print(number)

number //= 2
print(number)

number %= 3
print(number)

number **= 2
print(number)


# ------------------------------------------------------------
# Assignment operators
# ------------------------------------------------------------
#
# =     assignment
# +=    add and assign
# -=    subtract and assign
# *=    multiply and assign
# /=    divide and assign
# //=   floor divide and assign
# %=    modulus and assign
# **=   power and assign
#


# ============================================================
# 11. WALRUS OPERATOR :=
# ============================================================

# The walrus operator assigns a value as part of an expression.

if (length := len("Python")) > 5:
    print("Length:", length)

# Use this carefully.
# It can make code shorter, but excessive use can reduce readability.


# ============================================================
# 12. MEMBERSHIP OPERATORS
# ============================================================

# in
# not in

languages = ["Python", "Java", "C++"]

print("Python" in languages)
print("Rust" in languages)

print("Rust" not in languages)


# Strings also support membership testing.

text = "Python Programming"

print("Python" in text)
print("Java" in text)


# Dictionary membership checks KEYS.

student = {
    "name": "Shiva",
    "age": 21,
}

print("name" in student)
print("Shiva" in student)  # False


# ============================================================
# 13. IDENTITY OPERATORS
# ============================================================

# is
# is not

a = None

print(a is None)
print(a is not None)


# Use `is` primarily when checking object identity,
# especially for None.

value = None

if value is None:
    print("Value is missing.")


# ============================================================
# 14. == vs is
# ============================================================

a = [1, 2, 3]
b = [1, 2, 3]

print("a == b:", a == b)
print("a is b:", a is b)

# == checks VALUE equality.
#
# is checks OBJECT IDENTITY.
#
# These are different concepts.


# ============================================================
# 15. OBJECT IDENTITY
# ============================================================

a = [1, 2, 3]
b = a

print(a == b)
print(a is b)

print("ID of a:", id(a))
print("ID of b:", id(b))


# `a` and `b` refer to the same list object.


# ============================================================
# 16. BITWISE OPERATORS
# ============================================================

a = 10
b = 6

print("a & b :", a & b)
print("a | b :", a | b)
print("a ^ b :", a ^ b)
print("~a    :", ~a)
print("a << 1:", a << 1)
print("a >> 1:", a >> 1)


# ------------------------------------------------------------
# Bitwise operators
# ------------------------------------------------------------
#
# &     AND
# |     OR
# ^     XOR
# ~     NOT
# <<    left shift
# >>    right shift
#
# These operate on the binary representation of integers.
#


# ============================================================
# 17. BINARY REPRESENTATION
# ============================================================

number = 10

print(bin(number))

# 10 in binary:
#
# 1010


# ============================================================
# 18. BITWISE AND EXAMPLE
# ============================================================

a = 10  # 1010
b = 6   # 0110

print(a & b)

#     1010
# AND 0110
#     ----
#     0010
#
# Result = 2


# ============================================================
# 19. BITWISE OR EXAMPLE
# ============================================================

print(a | b)

#     1010
# OR  0110
#     ----
#     1110
#
# Result = 14


# ============================================================
# 20. BITWISE XOR EXAMPLE
# ============================================================

print(a ^ b)

#     1010
# XOR 0110
#     ----
#     1100
#
# Result = 12


# ============================================================
# 21. LEFT SHIFT
# ============================================================

number = 5

print(number << 1)
print(number << 2)

# Roughly equivalent to multiplying by powers of 2:
#
# 5 << 1 = 10
# 5 << 2 = 20


# ============================================================
# 22. RIGHT SHIFT
# ============================================================

number = 20

print(number >> 1)
print(number >> 2)

# Roughly equivalent to integer division by powers of 2:
#
# 20 >> 1 = 10
# 20 >> 2 = 5


# ============================================================
# 23. OPERATOR PRECEDENCE
# ============================================================

result = 10 + 2 * 3

print(result)

# Multiplication happens before addition.
#
# 10 + (2 * 3)
# = 16


result = (10 + 2) * 3

print(result)

# Parentheses change the order.
#
# (10 + 2) * 3
# = 36


# ============================================================
# 24. COMMON PRECEDENCE ORDER
# ============================================================

"""
Higher precedence → lower precedence:

1. ()
2. **
3. +x, -x, ~x
4. *, /, //, %
5. +, -
6. <<, >>
7. &
8. ^
9. |
10. ==, !=, <, <=, >, >=
11. is, is not
12. in, not in
13. not
14. and
15. or
16. :=

When in doubt, use parentheses.
"""


# ============================================================
# 25. TRUTHY AND FALSY VALUES
# ============================================================

print(bool(0))
print(bool(1))

print(bool(""))
print(bool("Python"))

print(bool([]))
print(bool([1, 2, 3]))

print(bool(None))


# Common falsy values include:
#
# False
# None
# 0
# 0.0
# ""
# []
# ()
# {}
# set()
#
# Most other values are truthy.


# ============================================================
# 26. SHORT-CIRCUIT EVALUATION
# ============================================================

# `and` stops when it finds a falsy value.
# `or` stops when it finds a truthy value.

print(False and 100)

print(True or 100)


# This is commonly used for conditional expressions.

name = ""

display_name = name or "Guest"

print(display_name)


# ============================================================
# 27. OPERATOR RETURN VALUES
# ============================================================

# `and` and `or` do not necessarily return True/False.

print("Python" and "Programming")

print("" and "Programming")

print("Python" or "Programming")

print("" or "Programming")


# ============================================================
# 28. PRACTICAL EXAMPLE — ELIGIBILITY
# ============================================================

age = 22
marks = 75

eligible = age >= 18 and marks >= 60

print("Eligible:", eligible)


# ============================================================
# 29. PRACTICAL EXAMPLE — EVEN / ODD
# ============================================================

number = 17

if number % 2 == 0:
    print("Even")
else:
    print("Odd")


# ============================================================
# 30. PRACTICAL EXAMPLE — RANGE CHECK
# ============================================================

marks = 85

if 0 <= marks <= 100:
    print("Valid marks")
else:
    print("Invalid marks")


# ============================================================
# SUMMARY
# ============================================================

"""
Arithmetic:
    +  -  *  /  //  %  **

Comparison:
    ==  !=  >  <  >=  <=

Logical:
    and  or  not

Assignment:
    =  +=  -=  *=  /=  //=  %=  **=  :=

Membership:
    in  not in

Identity:
    is  is not

Bitwise:
    &  |  ^  ~  <<  >>

Important:
    ==  → compares values
    is  → compares object identity

    /   → normal division
    //  → floor division

    %   → remainder
    **  → exponentiation

    and/or → short-circuit evaluation

    input() → returns str
"""