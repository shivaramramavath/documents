"""
Python Input and Output
=======================

Input:
    Getting data from the user.

Output:
    Displaying data to the user.

Main functions:
    input()
    print()
"""


# ============================================================
# 1. BASIC OUTPUT
# ============================================================

print("Hello, Python!")

print("Learning Python is fun.")

print(100)

print(10 + 20)


# ============================================================
# 2. PRINT MULTIPLE VALUES
# ============================================================

name = "Shiva"
age = 21

print(name, age)

print("Name:", name, "Age:", age)


# ============================================================
# 3. SEPARATOR
# ============================================================

# By default, print() separates multiple values with a space.

print("Python", "Java", "C++")

# Change the separator using sep=

print("Python", "Java", "C++", sep=" | ")

print("2026", "09", "02", sep="-")


# ============================================================
# 4. END PARAMETER
# ============================================================

# By default, print() ends with a newline.

print("Hello")
print("World")

# Change the ending using end=

print("Hello", end=" ")
print("World")

print("Loading", end="...")
print("Done")


# ============================================================
# 5. BASIC INPUT
# ============================================================

name = input("Enter your name: ")

print("Hello", name)


# ============================================================
# 6. INPUT ALWAYS RETURNS STRING
# ============================================================

age = input("Enter your age: ")

print("Age:", age)
print("Type:", type(age))


# Even if the user enters:
#
# 21
#
# Python receives:
#
# "21"
#
# Therefore:

age = input("Enter your age: ")

print(age + "10")

# If user enters 21:
#
# Output:
# 2110
#
# because both values are strings.


# ============================================================
# 7. CONVERTING INPUT
# ============================================================

age = int(input("Enter your age: "))

print("Your age is:", age)
print("Type:", type(age))


# Float input

height = float(input("Enter your height: "))

print("Height:", height)
print("Type:", type(height))


# ============================================================
# 8. MULTIPLE INPUTS
# ============================================================

first_name = input("Enter first name: ")
last_name = input("Enter last name: ")

print("Full name:", first_name, last_name)


# ============================================================
# 9. F-STRING
# ============================================================

name = input("Enter your name: ")
age = int(input("Enter your age: "))

print(f"My name is {name} and I am {age} years old.")


# ============================================================
# 10. STRING FORMATTING
# ============================================================

name = "Shiva"
age = 21
course = "Python"

print(f"Name: {name}")
print(f"Age: {age}")
print(f"Course: {course}")

print(f"{name} is learning {course}.")


# ============================================================
# 11. FORMATTING NUMBERS
# ============================================================

price = 1250.5678

print(f"Price: {price:.2f}")

percentage = 87.4567

print(f"Percentage: {percentage:.2f}%")


# ============================================================
# 12. ESCAPE CHARACTERS
# ============================================================

print("Hello\nWorld")

print("Python\tProgramming")

print("He said \"Hello\"")

print('It\'s Python')


# ============================================================
# 13. RAW STRINGS
# ============================================================

# Useful for paths and regular expressions.

path = r"C:\Users\Shiva\Documents\Python"

print(path)


# ============================================================
# 14. MULTILINE OUTPUT
# ============================================================

print("""
Python
Java
JavaScript
C++
""")


# ============================================================
# 15. BOOLEAN INPUT
# ============================================================

# Be careful:
#
# bool("False") == True
#
# because any non-empty string is truthy.

value = input("Enter something: ")

print("Input:", value)
print("Boolean value:", bool(value))


# ============================================================
# 16. SIMPLE CALCULATOR
# ============================================================

number1 = float(input("Enter first number: "))
number2 = float(input("Enter second number: "))

print(f"Addition:       {number1 + number2}")
print(f"Subtraction:    {number1 - number2}")
print(f"Multiplication: {number1 * number2}")

if number2 != 0:
    print(f"Division:        {number1 / number2}")
else:
    print("Division: Cannot divide by zero.")


# ============================================================
# 17. INPUT + TYPE CONVERSION
# ============================================================

"""
General pattern:

string_value = input("Enter something: ")

integer_value = int(input("Enter an integer: "))

float_value = float(input("Enter a decimal: "))

The flow is:

User
  ↓
input()
  ↓
string
  ↓
type conversion
  ↓
int / float / etc.
"""


# ============================================================
# 18. PRINT RETURN VALUE
# ============================================================

result = print("Hello")

print("Return value:", result)

# print() returns None.


# ============================================================
# KEY TAKEAWAYS
# ============================================================

"""
1. print() is used for output.

2. input() is used for user input.

3. input() ALWAYS returns a string.

4. Convert input when necessary:

       int()
       float()
       str()
       bool()

5. print() supports:

       sep=
       end=

6. f-strings are the preferred way to format strings.

7. Escape characters include:

       \n   newline
       \t   tab
       \\   backslash
       \"   double quote
       \'   single quote
"""