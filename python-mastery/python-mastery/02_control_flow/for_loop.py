"""
Python for Loops
================

A for loop is used to iterate over items in an iterable.

Common iterables:

    list
    tuple
    string
    set
    dictionary
    range
    generator

Basic syntax:

    for item in iterable:
        # code
"""


# ============================================================
# 1. BASIC FOR LOOP
# ============================================================

numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(number)


# Read this as:
#
# "For each number in numbers, print the number."


# ============================================================
# 2. LOOPING THROUGH A STRING
# ============================================================

name = "Python"

for character in name:
    print(character)


# ============================================================
# 3. LOOPING THROUGH A TUPLE
# ============================================================

coordinates = (10, 20, 30)

for coordinate in coordinates:
    print(coordinate)


# ============================================================
# 4. LOOPING THROUGH A SET
# ============================================================

numbers = {10, 20, 30, 40}

for number in numbers:
    print(number)

# Sets are unordered collections.
# Do not depend on the iteration order.


# ============================================================
# 5. LOOPING THROUGH A DICTIONARY
# ============================================================

student = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

for key in student:
    print(key)


# ============================================================
# 6. DICTIONARY VALUES
# ============================================================

for value in student.values():
    print(value)


# ============================================================
# 7. DICTIONARY KEYS + VALUES
# ============================================================

for key, value in student.items():
    print(key, "=", value)


# ============================================================
# 8. range()
# ============================================================

for number in range(5):
    print(number)


# Output:
#
# 0
# 1
# 2
# 3
# 4


# range(5) starts at 0 and stops BEFORE 5.


# ============================================================
# 9. range(start, stop)
# ============================================================

for number in range(1, 6):
    print(number)


# Output:
#
# 1
# 2
# 3
# 4
# 5


# ============================================================
# 10. range(start, stop, step)
# ============================================================

for number in range(0, 11, 2):
    print(number)


# Output:
#
# 0 2 4 6 8 10


# ============================================================
# 11. COUNT BACKWARDS
# ============================================================

for number in range(10, 0, -1):
    print(number)


# ============================================================
# 12. REVERSE RANGE
# ============================================================

for number in range(10, -1, -1):
    print(number)


# ============================================================
# 13. STEP OF 5
# ============================================================

for number in range(0, 51, 5):
    print(number)


# ============================================================
# 14. range() IS NOT A LIST
# ============================================================

numbers = range(5)

print(numbers)
print(type(numbers))


# range is a range object.


# ============================================================
# 15. CONVERT range TO LIST
# ============================================================

numbers = list(range(5))

print(numbers)


# ============================================================
# 16. enumerate()
# ============================================================

names = ["Shiva", "Ram", "Raj"]

for index, name in enumerate(names):
    print(index, name)


# Output:
#
# 0 Shiva
# 1 Ram
# 2 Raj


# ============================================================
# 17. enumerate() WITH START
# ============================================================

names = ["Shiva", "Ram", "Raj"]

for index, name in enumerate(names, start=1):
    print(index, name)


# Output:
#
# 1 Shiva
# 2 Ram
# 3 Raj


# ============================================================
# 18. WHY enumerate() IS BETTER
# ============================================================

names = ["Shiva", "Ram", "Raj"]

# Avoid:

for index in range(len(names)):
    print(index, names[index])


# Prefer:

for index, name in enumerate(names):
    print(index, name)


# ============================================================
# 19. zip()
# ============================================================

names = ["Shiva", "Ram", "Raj"]
ages = [21, 22, 20]

for name, age in zip(names, ages):
    print(name, age)


# ============================================================
# 20. zip() WITH THREE ITERABLES
# ============================================================

names = ["Shiva", "Ram", "Raj"]
ages = [21, 22, 20]
branches = ["CSE", "ECE", "IT"]

for name, age, branch in zip(names, ages, branches):
    print(name, age, branch)


# ============================================================
# 21. zip() STOPS AT THE SHORTEST
# ============================================================

names = ["Shiva", "Ram", "Raj"]
ages = [21, 22]

for name, age in zip(names, ages):
    print(name, age)

# Raj is not processed because there is no third age.


# ============================================================
# 22. break
# ============================================================

for number in range(1, 11):

    if number == 5:
        break

    print(number)


# Output:
#
# 1
# 2
# 3
# 4


# break immediately exits the loop.


# ============================================================
# 23. continue
# ============================================================

for number in range(1, 11):

    if number == 5:
        continue

    print(number)


# 5 is skipped.


# ============================================================
# 24. break vs continue
# ============================================================

"""
break
-----
Stops the entire loop.

continue
--------
Skips the current iteration and continues
with the next iteration.
"""


# ============================================================
# 25. PASS
# ============================================================

for number in range(5):
    pass


# pass does nothing.
# Useful as a placeholder.


# ============================================================
# 26. for-else
# ============================================================

for number in range(5):
    print(number)
else:
    print("Loop completed.")


# The else executes when the loop finishes normally.


# ============================================================
# 27. for-else WITH break
# ============================================================

for number in range(5):

    if number == 3:
        break

    print(number)

else:
    print("Loop completed.")


# The else does NOT execute because break occurred.


# ============================================================
# 28. SEARCH USING for-else
# ============================================================

numbers = [10, 20, 30, 40]

target = 30

for number in numbers:

    if number == target:
        print("Found:", target)
        break

else:
    print("Not found.")


# This is one of the useful patterns for for-else.


# ============================================================
# 29. SEARCH WHEN ITEM DOES NOT EXIST
# ============================================================

numbers = [10, 20, 30, 40]

target = 50

for number in numbers:

    if number == target:
        print("Found:", target)
        break

else:
    print("Not found.")


# ============================================================
# 30. NESTED FOR LOOPS
# ============================================================

for i in range(3):

    for j in range(3):
        print(i, j)


# The inner loop runs completely for each
# iteration of the outer loop.


# ============================================================
# 31. MULTIPLICATION TABLE
# ============================================================

number = 5

for i in range(1, 11):
    print(f"{number} x {i} = {number * i}")


# ============================================================
# 32. MULTIPLICATION TABLES
# ============================================================

for number in range(1, 6):

    print(f"\nTable of {number}")

    for i in range(1, 11):
        print(f"{number} x {i} = {number * i}")


# ============================================================
# 33. NESTED LOOP — MATRIX
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

for row in matrix:

    for number in row:
        print(number)


# ============================================================
# 34. PRINT MATRIX ROW BY ROW
# ============================================================

for row in matrix:
    print(row)


# ============================================================
# 35. MATRIX WITH INDEX
# ============================================================

for row_index, row in enumerate(matrix):

    for column_index, value in enumerate(row):

        print(
            f"matrix[{row_index}][{column_index}] = {value}"
        )


# ============================================================
# 36. UNPACKING IN FOR LOOP
# ============================================================

students = [
    ("Shiva", 21),
    ("Ram", 22),
    ("Raj", 20),
]

for name, age in students:
    print(name, age)


# Python automatically unpacks each tuple.


# ============================================================
# 37. DICTIONARY ITEMS UNPACKING
# ============================================================

student = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

for key, value in student.items():
    print(key, value)


# ============================================================
# 38. LOOPING THROUGH OBJECTS
# ============================================================

products = [
    {
        "name": "Laptop",
        "price": 65000,
    },
    {
        "name": "Phone",
        "price": 30000,
    },
    {
        "name": "Mouse",
        "price": 1000,
    },
]

for product in products:
    print(product["name"])
    print(product["price"])


# ============================================================
# 39. FILTERING WITH A LOOP
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even_numbers = []

for number in numbers:

    if number % 2 == 0:
        even_numbers.append(number)

print(even_numbers)


# This is the normal-loop equivalent of:
#
# [number for number in numbers if number % 2 == 0]


# ============================================================
# 40. TRANSFORMING DATA WITH A LOOP
# ============================================================

numbers = [1, 2, 3, 4, 5]

squares = []

for number in numbers:
    squares.append(number ** 2)

print(squares)


# ============================================================
# 41. ACCUMULATOR PATTERN
# ============================================================

numbers = [10, 20, 30, 40]

total = 0

for number in numbers:
    total += number

print(total)


# ============================================================
# 42. FIND MAXIMUM MANUALLY
# ============================================================

numbers = [10, 50, 20, 90, 30]

largest = numbers[0]

for number in numbers:

    if number > largest:
        largest = number

print("Largest:", largest)


# ============================================================
# 43. COUNTING
# ============================================================

numbers = [10, 15, 20, 25, 30, 35]

count = 0

for number in numbers:

    if number % 5 == 0:
        count += 1

print("Count:", count)


# ============================================================
# 44. STRING CHARACTER COUNT
# ============================================================

text = "python programming"

count = 0

for character in text:

    if character == "p":
        count += 1

print("p appears:", count, "times")


# ============================================================
# 45. REVERSE A STRING
# ============================================================

text = "Python"

reversed_text = ""

for character in text:
    reversed_text = character + reversed_text

print(reversed_text)


# Pythonic alternative later:

print(text[::-1])


# ============================================================
# 46. FACTORIAL
# ============================================================

number = 5

factorial = 1

for i in range(1, number + 1):
    factorial *= i

print("Factorial:", factorial)


# ============================================================
# 47. FIBONACCI
# ============================================================

n = 10

a = 0
b = 1

for _ in range(n):

    print(a)

    a, b = b, a + b


# `_` means:
# "I don't need the loop variable."


# ============================================================
# 48. PRIME NUMBER CHECK
# ============================================================

number = 29

if number < 2:
    print("Not prime")

else:

    for divisor in range(2, int(number ** 0.5) + 1):

        if number % divisor == 0:
            print("Not prime")
            break

    else:
        print("Prime")


# ============================================================
# 49. FIND ALL PRIME NUMBERS
# ============================================================

for number in range(2, 51):

    for divisor in range(2, int(number ** 0.5) + 1):

        if number % divisor == 0:
            break

    else:
        print(number)


# ============================================================
# 50. LOOPING THROUGH TWO LISTS
# ============================================================

names = ["Shiva", "Ram", "Raj"]
marks = [85, 72, 91]

for name, mark in zip(names, marks):

    print(f"{name}: {mark}")


# ============================================================
# 51. ENUMERATE + ZIP
# ============================================================

names = ["Shiva", "Ram", "Raj"]
marks = [85, 72, 91]

for index, (name, mark) in enumerate(zip(names, marks), start=1):

    print(f"{index}. {name}: {mark}")


# ============================================================
# 52. LOOPING WITH CONDITIONS
# ============================================================

numbers = range(1, 21)

for number in numbers:

    if number % 2 == 0:
        print(number, "Even")
    else:
        print(number, "Odd")


# ============================================================
# 53. LOOP + FUNCTION
# ============================================================

def square(number):
    return number ** 2


numbers = [1, 2, 3, 4, 5]

for number in numbers:
    print(square(number))


# ============================================================
# 54. LOOPING THROUGH USER INPUT
# ============================================================

for _ in range(3):

    name = input("Enter your name: ")

    print(f"Hello, {name}")


# ============================================================
# 55. INPUT UNTIL VALID VALUE
# ============================================================

for _ in range(3):

    number = int(input("Enter a positive number: "))

    if number > 0:
        print("Valid number.")
        break

    print("Invalid number.")

else:
    print("Too many invalid attempts.")


# ============================================================
# 56. LOOP CONTROL WITH FLAGS
# ============================================================

numbers = [10, 20, 30, 40]

found = False

for number in numbers:

    if number == 30:
        found = True
        break

if found:
    print("Found")
else:
    print("Not found")


# for-else can often make this cleaner.


# ============================================================
# 57. PRACTICAL — STUDENT MARKS
# ============================================================

students = [
    ("Shiva", 85),
    ("Ram", 35),
    ("Raj", 72),
    ("Arun", 28),
]

for name, marks in students:

    if marks >= 40:
        result = "Pass"
    else:
        result = "Fail"

    print(f"{name}: {marks} → {result}")


# ============================================================
# 58. PRACTICAL — ACTIVE USERS
# ============================================================

users = [
    {"name": "Shiva", "active": True},
    {"name": "Ram", "active": False},
    {"name": "Raj", "active": True},
]

for user in users:

    if user["active"]:
        print(user["name"], "is active")


# ============================================================
# 59. PRACTICAL — API DATA
# ============================================================

users = [
    {
        "id": 1,
        "name": "Shiva",
        "role": "admin",
    },
    {
        "id": 2,
        "name": "Ram",
        "role": "user",
    },
    {
        "id": 3,
        "name": "Raj",
        "role": "admin",
    },
]

for user in users:

    if user["role"] == "admin":
        print(
            f"Admin: {user['name']} "
            f"(ID: {user['id']})"
        )


# ============================================================
# 60. PRACTICAL — SUM OF EVEN NUMBERS
# ============================================================

numbers = range(1, 101)

total = 0

for number in numbers:

    if number % 2 == 0:
        total += number

print("Sum:", total)


# ============================================================
# 61. PRACTICAL — WORD SEARCH
# ============================================================

sentence = "Python is powerful and Python is easy"

words = sentence.split()

for word in words:

    if word == "Python":
        print("Found Python")


# ============================================================
# 62. PRACTICAL — DUPLICATE DETECTION
# ============================================================

numbers = [1, 2, 3, 2, 4, 5, 1]

seen = set()

duplicates = set()

for number in numbers:

    if number in seen:
        duplicates.add(number)
    else:
        seen.add(number)

print("Duplicates:", duplicates)


# ============================================================
# 63. LOOP WITH ELSE — SEARCH PATTERN
# ============================================================

users = [
    {"id": 1, "name": "Shiva"},
    {"id": 2, "name": "Ram"},
    {"id": 3, "name": "Raj"},
]

target_id = 2

for user in users:

    if user["id"] == target_id:
        print("Found:", user)
        break

else:
    print("User not found.")


# ============================================================
# 64. PERFORMANCE IDEA
# ============================================================

"""
A for loop processes items sequentially.

Example:

    for user in users:
        process(user)

For a small list this is straightforward.

For millions of items, later you will learn:

    generators
    iterators
    lazy evaluation
    multiprocessing
    asyncio
    database batching

These concepts become important for backend and
data-processing applications.
"""


# ============================================================
# 65. IMPORTANT: ITERABLE vs ITERATOR
# ============================================================

numbers = [1, 2, 3]

for number in numbers:
    print(number)


"""
A list is iterable.

The for loop internally obtains an iterator and repeatedly
gets the next item.

Conceptually:

    iterator = iter(numbers)

    next(iterator)
    next(iterator)
    next(iterator)

We will study this deeply in:

    09_pythonic_programming/iterators.py
"""


# ============================================================
# 66. FINAL SUMMARY
# ============================================================

"""
FOR LOOP
--------

Basic:

    for item in iterable:
        ...


range():

    for i in range(10):
        ...


enumerate():

    for index, item in enumerate(items):
        ...


zip():

    for a, b in zip(list_a, list_b):
        ...


Dictionary:

    for key, value in dictionary.items():
        ...


break:

    exit the loop


continue:

    skip current iteration


else:

    runs when loop finishes normally


Nested loop:

    for outer in data:
        for inner in data:
            ...


Unpacking:

    for name, age in students:
        ...


Common patterns:

    filtering
    transformation
    accumulation
    counting
    searching
    nested iteration
"""