"""
Python Control Flow — if / elif / else
=======================================

Control flow determines which parts of a program execute
and in what order.

Decision-making keywords:

    if
    elif
    else

Basic structure:

    if condition:
        # code

    elif condition:
        # code

    else:
        # code

A condition must produce a truthy or falsy result.
"""


# ============================================================
# 1. BASIC IF
# ============================================================

age = 20

if age >= 18:
    print("You are an adult.")


# ============================================================
# 2. IF CONDITION IS FALSE
# ============================================================

age = 15

if age >= 18:
    print("You are an adult.")

# Nothing is printed because the condition is False.


# ============================================================
# 3. IF / ELSE
# ============================================================

age = 20

if age >= 18:
    print("Eligible to vote.")
else:
    print("Not eligible to vote.")


# ============================================================
# 4. IF / ELIF / ELSE
# ============================================================

marks = 85

if marks >= 90:
    print("Grade A+")
elif marks >= 80:
    print("Grade A")
elif marks >= 70:
    print("Grade B")
elif marks >= 60:
    print("Grade C")
elif marks >= 40:
    print("Grade D")
else:
    print("Fail")


# Python checks conditions from TOP to BOTTOM.
# The first True condition executes.


# ============================================================
# 5. MULTIPLE ELIF
# ============================================================

temperature = 35

if temperature >= 40:
    print("Very hot")
elif temperature >= 30:
    print("Hot")
elif temperature >= 20:
    print("Warm")
elif temperature >= 10:
    print("Cool")
else:
    print("Cold")


# ============================================================
# 6. COMPARISON OPERATORS IN CONDITIONS
# ============================================================

number = 10

if number == 10:
    print("Number is 10")

if number != 5:
    print("Number is not 5")

if number > 5:
    print("Number is greater than 5")

if number < 20:
    print("Number is less than 20")

if number >= 10:
    print("Number is greater than or equal to 10")

if number <= 10:
    print("Number is less than or equal to 10")


# ============================================================
# 7. LOGICAL AND
# ============================================================

age = 25
has_id = True

if age >= 18 and has_id:
    print("Entry allowed.")
else:
    print("Entry denied.")


# Both conditions must be True.


# ============================================================
# 8. LOGICAL OR
# ============================================================

is_admin = False
is_manager = True

if is_admin or is_manager:
    print("Access granted.")
else:
    print("Access denied.")


# At least one condition must be True.


# ============================================================
# 9. LOGICAL NOT
# ============================================================

is_blocked = False

if not is_blocked:
    print("User can continue.")


# ============================================================
# 10. CHAINED COMPARISON
# ============================================================

age = 25

if 18 <= age <= 60:
    print("Working-age group.")


# Equivalent to:
#
# if age >= 18 and age <= 60:


# ============================================================
# 11. NESTED IF
# ============================================================

age = 25
has_id = True

if age >= 18:

    if has_id:
        print("Entry allowed.")
    else:
        print("ID required.")

else:
    print("You are underage.")


# An if statement inside another if statement is nested if.


# ============================================================
# 12. NESTED CONDITIONS
# ============================================================

username = "admin"
password = "1234"

if username == "admin":

    if password == "1234":
        print("Login successful.")
    else:
        print("Incorrect password.")

else:
    print("Unknown user.")


# ============================================================
# 13. AVOIDING UNNECESSARY NESTING
# ============================================================

username = "admin"
password = "1234"

if username == "admin" and password == "1234":
    print("Login successful.")
else:
    print("Login failed.")


# Often cleaner than deeply nested conditions.


# ============================================================
# 14. MEMBERSHIP WITH IF
# ============================================================

language = "Python"

if language in ["Python", "Java", "C++"]:
    print("Language found.")


# ============================================================
# 15. STRING MEMBERSHIP
# ============================================================

email = "user@example.com"

if "@" in email:
    print("Looks like an email address.")


# ============================================================
# 16. DICTIONARY MEMBERSHIP
# ============================================================

user = {
    "name": "Shiva",
    "age": 21,
}

if "name" in user:
    print("Name exists.")

if "email" not in user:
    print("Email is missing.")


# ============================================================
# 17. IDENTITY CHECK
# ============================================================

value = None

if value is None:
    print("No value provided.")


# Use `is None`, not `== None`.


# ============================================================
# 18. TRUTHY AND FALSY VALUES
# ============================================================

value = "Python"

if value:
    print("Value exists.")


value = ""

if value:
    print("This will not execute.")
else:
    print("Empty string is falsy.")


# ============================================================
# 19. COMMON FALSY VALUES
# ============================================================

values = [
    False,
    None,
    0,
    0.0,
    "",
    [],
    (),
    {},
    set(),
]

for value in values:
    if value:
        print("Truthy:", value)
    else:
        print("Falsy:", repr(value))


# ============================================================
# 20. TRUTHY VALUES
# ============================================================

values = [
    True,
    1,
    -1,
    "Python",
    [1, 2],
    (1, 2),
    {"name": "Shiva"},
]

for value in values:
    if value:
        print("Truthy:", value)


# ============================================================
# 21. CONDITIONAL EXPRESSION
# ============================================================

age = 20

status = "Adult" if age >= 18 else "Minor"

print(status)


# Syntax:
#
# value_if_true if condition else value_if_false


# ============================================================
# 22. CONDITIONAL EXPRESSION
# ============================================================

marks = 75

result = "Pass" if marks >= 40 else "Fail"

print(result)


# ============================================================
# 23. NESTED CONDITIONAL EXPRESSION
# ============================================================

marks = 85

grade = (
    "A"
    if marks >= 90
    else "B"
    if marks >= 80
    else "C"
    if marks >= 70
    else "D"
)

print(grade)

# This is possible, but normal if/elif is usually more readable.


# ============================================================
# 24. PASS
# ============================================================

age = 20

if age >= 18:
    pass

# `pass` does nothing.
# It is useful when you need an empty code block temporarily.


# ============================================================
# 25. MULTIPLE CONDITIONS
# ============================================================

age = 22
marks = 85
attendance = 90

if age >= 18 and marks >= 60 and attendance >= 75:
    print("Eligible.")
else:
    print("Not eligible.")


# ============================================================
# 26. PRACTICAL — EVEN / ODD
# ============================================================

number = int(input("Enter a number: "))

if number % 2 == 0:
    print("Even")
else:
    print("Odd")


# ============================================================
# 27. PRACTICAL — POSITIVE / NEGATIVE / ZERO
# ============================================================

number = float(input("Enter a number: "))

if number > 0:
    print("Positive")
elif number < 0:
    print("Negative")
else:
    print("Zero")


# ============================================================
# 28. PRACTICAL — STUDENT GRADE
# ============================================================

marks = float(input("Enter marks: "))

if marks < 0 or marks > 100:
    print("Invalid marks.")
elif marks >= 90:
    print("Grade: A+")
elif marks >= 80:
    print("Grade: A")
elif marks >= 70:
    print("Grade: B")
elif marks >= 60:
    print("Grade: C")
elif marks >= 40:
    print("Grade: D")
else:
    print("Grade: F")


# ============================================================
# 29. PRACTICAL — LOGIN
# ============================================================

username = input("Username: ")
password = input("Password: ")

if username == "admin" and password == "1234":
    print("Login successful.")
else:
    print("Invalid username or password.")


# ============================================================
# 30. PRACTICAL — DISCOUNT
# ============================================================

amount = float(input("Enter purchase amount: "))

if amount >= 10000:
    discount = 20
elif amount >= 5000:
    discount = 10
elif amount >= 2000:
    discount = 5
else:
    discount = 0

discount_amount = amount * discount / 100
final_price = amount - discount_amount

print(f"Discount: {discount}%")
print(f"Discount amount: ₹{discount_amount:.2f}")
print(f"Final price: ₹{final_price:.2f}")


# ============================================================
# 31. PRACTICAL — LEAP YEAR
# ============================================================

year = int(input("Enter year: "))

if year % 400 == 0:
    print("Leap year")
elif year % 100 == 0:
    print("Not a leap year")
elif year % 4 == 0:
    print("Leap year")
else:
    print("Not a leap year")


# ============================================================
# 32. PRACTICAL — LARGEST OF THREE NUMBERS
# ============================================================

a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
c = float(input("Enter third number: "))

if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c

print("Largest:", largest)


# ============================================================
# 33. GUARD CLAUSE
# ============================================================

"""
Instead of deeply nesting conditions, we can return early.

This technique becomes very useful when writing functions.
"""

age = 15

if age < 18:
    print("Access denied.")
else:
    print("Access granted.")


# Later, inside functions, this becomes:

def check_access(age):
    if age < 18:
        return "Access denied."

    return "Access granted."


print(check_access(20))


# ============================================================
# 34. CONDITIONS WITH FUNCTION RESULTS
# ============================================================

name = "Shiva"

if len(name) >= 5:
    print("Name has at least 5 characters.")


# ============================================================
# 35. CONDITIONS WITH EXPRESSIONS
# ============================================================

numbers = [10, 20, 30]

if len(numbers) > 0:
    print("List contains values.")


# Cleaner Python:

if numbers:
    print("List contains values.")


# ============================================================
# 36. SHORT-CIRCUIT EVALUATION
# ============================================================

"""
Python evaluates:

    and
    or

from left to right and may stop early.

Example:

    False and something

Python doesn't need to evaluate `something`.

Similarly:

    True or something

Python doesn't need to evaluate `something`.
"""

age = 15

if age >= 18 and "admin":
    print("This will not execute.")


# ============================================================
# 37. COMBINING AND / OR
# ============================================================

age = 25
is_student = True
is_employee = False

if age >= 18 and (is_student or is_employee):
    print("Eligible.")


# Parentheses make the intended logic clear.


# ============================================================
# 38. COMMON MISTAKE: = vs ==
# ============================================================

"""
Wrong:

    if age = 18:

`=` means assignment.

Correct:

    if age == 18:

`==` means comparison.
"""


# ============================================================
# 39. COMMON MISTAKE: BOOLEAN COMPARISON
# ============================================================

is_active = True

# Less Pythonic:
if is_active == True:
    print("Active")

# Better:
if is_active:
    print("Active")


# ============================================================
# 40. COMMON MISTAKE: TOO MANY NESTED IFs
# ============================================================

"""
Avoid code like:

if user:
    if user["active"]:
        if user["verified"]:
            if user["has_permission"]:
                print("Allowed")

As programs become larger, this becomes difficult to read.

Later, you'll learn:

    guard clauses
    functions
    validation
    permissions
    decorators

to structure this better.
"""


# ============================================================
# 41. FINAL CONTROL FLOW MODEL
# ============================================================

"""
Basic:

    if condition:
        action


Two choices:

    if condition:
        action_a
    else:
        action_b


Multiple choices:

    if condition_a:
        action_a
    elif condition_b:
        action_b
    else:
        action_c


Nested:

    if condition_a:
        if condition_b:
            action


Conditional expression:

    result = A if condition else B


The condition can use:

    comparisons
    logical operators
    membership
    identity
    function results
    truthy/falsy values
"""


# ============================================================
# END
# ============================================================