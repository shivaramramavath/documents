"""
Python Lists
============

A list is an ordered, mutable collection.

Lists can contain:
    - integers
    - floats
    - strings
    - booleans
    - other lists
    - dictionaries
    - objects
    - mixed data types

Lists allow duplicate values.

Example:

    numbers = [10, 20, 30, 40]
"""


# ============================================================
# 1. CREATING LISTS
# ============================================================

numbers = [10, 20, 30, 40]

print(numbers)


# Empty list

empty_list = []

print(empty_list)


# List with different data types

mixed = [
    10,
    3.14,
    "Python",
    True,
]

print(mixed)


# ============================================================
# 2. LIST TYPE
# ============================================================

numbers = [1, 2, 3]

print(type(numbers))


# ============================================================
# 3. LIST LENGTH
# ============================================================

numbers = [10, 20, 30, 40, 50]

print(len(numbers))


# ============================================================
# 4. INDEXING
# ============================================================

numbers = [10, 20, 30, 40, 50]

print(numbers[0])
print(numbers[1])
print(numbers[2])


# Index starts at 0.


# ============================================================
# 5. NEGATIVE INDEXING
# ============================================================

numbers = [10, 20, 30, 40, 50]

print(numbers[-1])
print(numbers[-2])
print(numbers[-3])


# -1 = last element
# -2 = second-last element


# ============================================================
# 6. MODIFYING LIST ITEMS
# ============================================================

numbers = [10, 20, 30, 40]

numbers[0] = 100

print(numbers)


# Lists are mutable.


# ============================================================
# 7. MODIFY MULTIPLE ITEMS
# ============================================================

numbers = [10, 20, 30, 40, 50]

numbers[1:3] = [200, 300]

print(numbers)


# ============================================================
# 8. SLICING
# ============================================================

numbers = [0, 1, 2, 3, 4, 5]

print(numbers[1:4])


# Start included
# Stop excluded


# ============================================================
# 9. SLICE FROM BEGINNING
# ============================================================

numbers = [0, 1, 2, 3, 4, 5]

print(numbers[:3])


# ============================================================
# 10. SLICE TO END
# ============================================================

numbers = [0, 1, 2, 3, 4, 5]

print(numbers[3:])


# ============================================================
# 11. SLICE WITH STEP
# ============================================================

numbers = [0, 1, 2, 3, 4, 5, 6, 7]

print(numbers[::2])


# ============================================================
# 12. REVERSE USING SLICING
# ============================================================

numbers = [1, 2, 3, 4, 5]

print(numbers[::-1])


# ============================================================
# 13. COPY USING SLICING
# ============================================================

numbers = [1, 2, 3, 4, 5]

copy = numbers[:]

print(copy)


# ============================================================
# 14. MEMBERSHIP
# ============================================================

numbers = [10, 20, 30, 40]

print(20 in numbers)
print(100 in numbers)

print(20 not in numbers)


# ============================================================
# 15. ITERATING
# ============================================================

numbers = [10, 20, 30]

for number in numbers:
    print(number)


# ============================================================
# 16. enumerate()
# ============================================================

names = ["Shiva", "Ram", "Raj"]

for index, name in enumerate(names):
    print(index, name)


# ============================================================
# 17. LIST CONCATENATION
# ============================================================

a = [1, 2, 3]
b = [4, 5, 6]

result = a + b

print(result)


# ============================================================
# 18. LIST REPETITION
# ============================================================

numbers = [1, 2, 3]

result = numbers * 3

print(result)


# ============================================================
# 19. append()
# ============================================================

numbers = [1, 2, 3]

numbers.append(4)

print(numbers)


# append() adds ONE item to the end.


# ============================================================
# 20. append() WITH LIST
# ============================================================

numbers = [1, 2, 3]

numbers.append([4, 5])

print(numbers)


# Result:
#
# [1, 2, 3, [4, 5]]
#
# The entire list becomes one element.


# ============================================================
# 21. extend()
# ============================================================

numbers = [1, 2, 3]

numbers.extend([4, 5, 6])

print(numbers)


# Result:
#
# [1, 2, 3, 4, 5, 6]


# ============================================================
# 22. append() vs extend()
# ============================================================

numbers = [1, 2, 3]

numbers.append([4, 5])

print(numbers)


numbers = [1, 2, 3]

numbers.extend([4, 5])

print(numbers)


"""
append:
    [1, 2, 3, [4, 5]]

extend:
    [1, 2, 3, 4, 5]
"""


# ============================================================
# 23. insert()
# ============================================================

numbers = [1, 2, 4, 5]

numbers.insert(2, 3)

print(numbers)


# insert(index, value)


# ============================================================
# 24. INSERT AT BEGINNING
# ============================================================

numbers = [2, 3, 4]

numbers.insert(0, 1)

print(numbers)


# ============================================================
# 25. INSERT AT END
# ============================================================

numbers = [1, 2, 3]

numbers.insert(len(numbers), 4)

print(numbers)


# Usually append() is simpler for adding at the end.


# ============================================================
# 26. remove()
# ============================================================

numbers = [10, 20, 30, 20]

numbers.remove(20)

print(numbers)


# remove() removes the FIRST matching value.


# ============================================================
# 27. remove() — VALUE NOT FOUND
# ============================================================

numbers = [10, 20, 30]

# numbers.remove(100)

# This raises:
# ValueError


# Safer:

if 100 in numbers:
    numbers.remove(100)


# ============================================================
# 28. pop()
# ============================================================

numbers = [10, 20, 30]

value = numbers.pop()

print(value)
print(numbers)


# pop() removes and returns the last item.


# ============================================================
# 29. pop(index)
# ============================================================

numbers = [10, 20, 30, 40]

value = numbers.pop(1)

print(value)
print(numbers)


# ============================================================
# 30. clear()
# ============================================================

numbers = [1, 2, 3, 4]

numbers.clear()

print(numbers)


# clear() removes everything.


# ============================================================
# 31. index()
# ============================================================

numbers = [10, 20, 30, 40]

position = numbers.index(30)

print(position)


# ============================================================
# 32. index() WITH START
# ============================================================

numbers = [10, 20, 30, 20, 40]

position = numbers.index(20, 2)

print(position)


# Search starts from index 2.


# ============================================================
# 33. count()
# ============================================================

numbers = [10, 20, 20, 30, 20]

print(numbers.count(20))


# ============================================================
# 34. sort()
# ============================================================

numbers = [50, 10, 40, 20, 30]

numbers.sort()

print(numbers)


# sort() modifies the original list.


# ============================================================
# 35. SORT DESCENDING
# ============================================================

numbers = [50, 10, 40, 20, 30]

numbers.sort(reverse=True)

print(numbers)


# ============================================================
# 36. sorted()
# ============================================================

numbers = [50, 10, 40, 20, 30]

result = sorted(numbers)

print("Original:", numbers)
print("Sorted:", result)


"""
sort()
    modifies original list

sorted()
    creates a new sorted list
"""


# ============================================================
# 37. SORT STRINGS
# ============================================================

names = ["Shiva", "Raj", "Arun", "Ram"]

names.sort()

print(names)


# ============================================================
# 38. SORT BY LENGTH
# ============================================================

names = ["Shiva", "Ram", "Alexander", "Raj"]

names.sort(key=len)

print(names)


# ============================================================
# 39. SORT BY LENGTH DESCENDING
# ============================================================

names = ["Shiva", "Ram", "Alexander", "Raj"]

names.sort(
    key=len,
    reverse=True,
)

print(names)


# ============================================================
# 40. reverse()
# ============================================================

numbers = [1, 2, 3, 4, 5]

numbers.reverse()

print(numbers)


# reverse() modifies the original list.


# ============================================================
# 41. copy()
# ============================================================

numbers = [1, 2, 3]

copy = numbers.copy()

print(copy)


# ============================================================
# 42. copy() vs ASSIGNMENT
# ============================================================

numbers = [1, 2, 3]

a = numbers

a.append(4)

print(numbers)
print(a)


"""
a = numbers

does NOT create a new list.

Both variables point to the same list.
"""


# ============================================================
# 43. REAL COPY
# ============================================================

numbers = [1, 2, 3]

a = numbers.copy()

a.append(4)

print(numbers)
print(a)


# ============================================================
# 44. is vs ==
# ============================================================

a = [1, 2, 3]
b = [1, 2, 3]

print(a == b)
print(a is b)


"""
==

Checks values.

is

Checks object identity.
"""


# ============================================================
# 45. SHALLOW COPY
# ============================================================

original = [
    [1, 2],
    [3, 4],
]

copy = original.copy()

copy[0].append(99)

print("Original:", original)
print("Copy:", copy)


"""
The outer list is copied,
but nested lists are shared.
"""


# ============================================================
# 46. DEEPCOPY
# ============================================================

import copy

original = [
    [1, 2],
    [3, 4],
]

deep_copy = copy.deepcopy(original)

deep_copy[0].append(99)

print("Original:", original)
print("Deep copy:", deep_copy)


# ============================================================
# 47. NESTED LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
]

print(matrix)


# ============================================================
# 48. ACCESS NESTED LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

print(matrix[0])
print(matrix[0][0])
print(matrix[1][2])


# ============================================================
# 49. MODIFY NESTED LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

matrix[0][1] = 100

print(matrix)


# ============================================================
# 50. ITERATE NESTED LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

for row in matrix:

    for value in row:
        print(value)


# ============================================================
# 51. FLATTEN NESTED LIST
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

flattened = []

for row in matrix:

    for value in row:
        flattened.append(value)

print(flattened)


# ============================================================
# 52. FLATTEN WITH COMPREHENSION
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

flattened = [
    value
    for row in matrix
    for value in row
]

print(flattened)


# ============================================================
# 53. LIST COMPREHENSION
# ============================================================

numbers = [1, 2, 3, 4, 5]

squares = [
    number ** 2
    for number in numbers
]

print(squares)


# ============================================================
# 54. LIST COMPREHENSION WITH CONDITION
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even_numbers = [
    number
    for number in numbers
    if number % 2 == 0
]

print(even_numbers)


# ============================================================
# 55. LIST COMPREHENSION IF / ELSE
# ============================================================

numbers = [1, 2, 3, 4, 5]

labels = [
    "Even" if number % 2 == 0 else "Odd"
    for number in numbers
]

print(labels)


# ============================================================
# 56. LIST FROM range()
# ============================================================

numbers = list(range(1, 11))

print(numbers)


# ============================================================
# 57. LIST FROM STRING
# ============================================================

characters = list("Python")

print(characters)


# ============================================================
# 58. LIST FROM TUPLE
# ============================================================

values = (10, 20, 30)

numbers = list(values)

print(numbers)


# ============================================================
# 59. LIST UNPACKING
# ============================================================

numbers = [10, 20, 30]

a, b, c = numbers

print(a)
print(b)
print(c)


# ============================================================
# 60. STAR UNPACKING
# ============================================================

numbers = [10, 20, 30, 40, 50]

first, *middle, last = numbers

print(first)
print(middle)
print(last)


# ============================================================
# 61. FIRST ITEM
# ============================================================

numbers = [10, 20, 30]

first, *rest = numbers

print(first)
print(rest)


# ============================================================
# 62. LAST ITEM
# ============================================================

numbers = [10, 20, 30]

*rest, last = numbers

print(rest)
print(last)


# ============================================================
# 63. SWAP VALUES
# ============================================================

a = 10
b = 20

a, b = b, a

print(a)
print(b)


# ============================================================
# 64. SWAP LIST ITEMS
# ============================================================

numbers = [10, 20, 30]

numbers[0], numbers[2] = numbers[2], numbers[0]

print(numbers)


# ============================================================
# 65. min()
# ============================================================

numbers = [10, 5, 30, 2, 50]

print(min(numbers))


# ============================================================
# 66. max()
# ============================================================

numbers = [10, 5, 30, 2, 50]

print(max(numbers))


# ============================================================
# 67. sum()
# ============================================================

numbers = [10, 20, 30, 40]

print(sum(numbers))


# ============================================================
# 68. any()
# ============================================================

numbers = [0, 0, 1, 0]

print(any(numbers))


# True because at least one value is truthy.


# ============================================================
# 69. all()
# ============================================================

numbers = [1, 1, 1, 1]

print(all(numbers))


# True because all values are truthy.


# ============================================================
# 70. ANY WITH CONDITION
# ============================================================

numbers = [1, 3, 5, 8]

has_even = any(
    number % 2 == 0
    for number in numbers
)

print(has_even)


# ============================================================
# 71. ALL WITH CONDITION
# ============================================================

numbers = [2, 4, 6, 8]

all_even = all(
    number % 2 == 0
    for number in numbers
)

print(all_even)


# ============================================================
# 72. FILTERING
# ============================================================

numbers = [10, 25, 30, 45, 50]

result = []

for number in numbers:

    if number >= 30:
        result.append(number)

print(result)


# ============================================================
# 73. map()
# ============================================================

numbers = [1, 2, 3, 4]

squares = list(
    map(lambda number: number ** 2, numbers)
)

print(squares)


# List comprehension is usually more readable:

squares = [
    number ** 2
    for number in numbers
]

print(squares)


# ============================================================
# 74. filter()
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even_numbers = list(
    filter(
        lambda number: number % 2 == 0,
        numbers,
    )
)

print(even_numbers)


# ============================================================
# 75. REDUCE
# ============================================================

from functools import reduce

numbers = [1, 2, 3, 4, 5]

total = reduce(
    lambda a, b: a + b,
    numbers,
)

print(total)


# Usually prefer:

print(sum(numbers))


# ============================================================
# 76. SORT DICTIONARIES INSIDE A LIST
# ============================================================

students = [
    {
        "name": "Shiva",
        "marks": 85,
    },
    {
        "name": "Ram",
        "marks": 72,
    },
    {
        "name": "Raj",
        "marks": 95,
    },
]

students.sort(
    key=lambda student: student["marks"]
)

print(students)


# ============================================================
# 77. SORT STUDENTS DESCENDING
# ============================================================

students = [
    {
        "name": "Shiva",
        "marks": 85,
    },
    {
        "name": "Ram",
        "marks": 72,
    },
    {
        "name": "Raj",
        "marks": 95,
    },
]

students.sort(
    key=lambda student: student["marks"],
    reverse=True,
)

print(students)


# ============================================================
# 78. FIND OBJECT
# ============================================================

students = [
    {"id": 1, "name": "Shiva"},
    {"id": 2, "name": "Ram"},
    {"id": 3, "name": "Raj"},
]

target_id = 2

for student in students:

    if student["id"] == target_id:
        print("Found:", student)
        break


# ============================================================
# 79. REMOVE DUPLICATES
# ============================================================

numbers = [1, 2, 2, 3, 3, 4, 5, 5]

unique_numbers = list(set(numbers))

print(unique_numbers)


"""
Important:

This removes duplicates but does not guarantee
the original order in the general set approach.
"""


# ============================================================
# 80. REMOVE DUPLICATES — PRESERVE ORDER
# ============================================================

numbers = [1, 2, 2, 3, 3, 4, 5, 5]

unique_numbers = list(dict.fromkeys(numbers))

print(unique_numbers)


# ============================================================
# 81. MANUAL DUPLICATE REMOVAL
# ============================================================

numbers = [1, 2, 2, 3, 3, 4]

unique_numbers = []

for number in numbers:

    if number not in unique_numbers:
        unique_numbers.append(number)

print(unique_numbers)


# ============================================================
# 82. LIST ALIASING
# ============================================================

a = [1, 2, 3]

b = a

b.append(4)

print("a:", a)
print("b:", b)


# Both reference the same list.


# ============================================================
# 83. COPY WITH list()
# ============================================================

a = [1, 2, 3]

b = list(a)

b.append(4)

print("a:", a)
print("b:", b)


# ============================================================
# 84. COPY WITH SLICING
# ============================================================

a = [1, 2, 3]

b = a[:]

b.append(4)

print("a:", a)
print("b:", b)


# ============================================================
# 85. COPY WITH copy()
# ============================================================

a = [1, 2, 3]

b = a.copy()

b.append(4)

print("a:", a)
print("b:", b)


# ============================================================
# 86. LIST OF LISTS — IMPORTANT BUG
# ============================================================

# Avoid:

matrix = [[0] * 3] * 3

matrix[0][0] = 1

print(matrix)


"""
All rows changed because they reference the same
inner list.
"""


# ============================================================
# 87. CORRECT NESTED LIST CREATION
# ============================================================

matrix = [
    [0] * 3
    for _ in range(3)
]

matrix[0][0] = 1

print(matrix)


# ============================================================
# 88. LIST METHOD SUMMARY
# ============================================================

"""
IMPORTANT LIST METHODS

append(x)
    Add one item at the end.

extend(iterable)
    Add multiple items.

insert(index, x)
    Insert an item at a position.

remove(x)
    Remove first matching value.

pop()
    Remove and return last item.

pop(index)
    Remove and return item at index.

clear()
    Remove all items.

index(x)
    Find first index of value.

count(x)
    Count occurrences.

sort()
    Sort list in place.

reverse()
    Reverse list in place.

copy()
    Create a shallow copy.
"""


# ============================================================
# 89. METHODS THAT MODIFY THE LIST
# ============================================================

numbers = [3, 1, 2]

numbers.append(4)
numbers.extend([5, 6])
numbers.insert(0, 0)

numbers.remove(3)

removed = numbers.pop()

numbers.sort()
numbers.reverse()

print(numbers)
print("Removed:", removed)


# ============================================================
# 90. METHODS THAT RETURN INFORMATION
# ============================================================

numbers = [10, 20, 20, 30]

print(numbers.index(20))
print(numbers.count(20))


# ============================================================
# 91. IMPORTANT — METHODS RETURN None
# ============================================================

numbers = [3, 1, 2]

result = numbers.sort()

print(numbers)
print(result)


"""
sort() modifies the list and returns None.

Therefore DON'T do:

    numbers = numbers.sort()

Correct:

    numbers.sort()
"""


# ============================================================
# 92. PRACTICAL — SHOPPING CART
# ============================================================

cart = []

cart.append("Laptop")
cart.append("Mouse")
cart.append("Keyboard")

print(cart)


cart.remove("Mouse")

print(cart)


# ============================================================
# 93. SHOPPING CART WITH PRICES
# ============================================================

cart = [
    {
        "name": "Laptop",
        "price": 65000,
    },
    {
        "name": "Mouse",
        "price": 1000,
    },
    {
        "name": "Keyboard",
        "price": 2000,
    },
]

total = sum(
    item["price"]
    for item in cart
)

print("Total:", total)


# ============================================================
# 94. PRACTICAL — STUDENT MARKS
# ============================================================

marks = [85, 72, 91, 65, 45]

print("Highest:", max(marks))
print("Lowest:", min(marks))
print("Total:", sum(marks))
print("Average:", sum(marks) / len(marks))


# ============================================================
# 95. PRACTICAL — PASS STUDENTS
# ============================================================

marks = [85, 35, 72, 25, 90, 45]

passed = [
    mark
    for mark in marks
    if mark >= 40
]

failed = [
    mark
    for mark in marks
    if mark < 40
]

print("Passed:", passed)
print("Failed:", failed)


# ============================================================
# 96. PRACTICAL — BATCH PROCESSING
# ============================================================

items = [
    "item1",
    "item2",
    "item3",
    "item4",
    "item5",
]

batch_size = 2

for index in range(0, len(items), batch_size):

    batch = items[index:index + batch_size]

    print("Batch:", batch)


# This pattern is useful in backend/data processing.


# ============================================================
# 97. CHUNK A LIST
# ============================================================

numbers = list(range(1, 11))

chunk_size = 3

chunks = [
    numbers[index:index + chunk_size]
    for index in range(
        0,
        len(numbers),
        chunk_size,
    )
]

print(chunks)


# ============================================================
# 98. MATRIX TRANSPOSE
# ============================================================

matrix = [
    [1, 2, 3],
    [4, 5, 6],
]

transposed = [
    list(column)
    for column in zip(*matrix)
]

print(transposed)


# ============================================================
# 99. LIST COMPREHENSION WITH ENUMERATE
# ============================================================

names = ["Shiva", "Ram", "Raj"]

indexed = [
    (index, name)
    for index, name in enumerate(names)
]

print(indexed)


# ============================================================
# 100. LIST COMPREHENSION WITH ZIP
# ============================================================

names = ["Shiva", "Ram", "Raj"]
marks = [85, 72, 91]

students = [
    {
        "name": name,
        "marks": mark,
    }
    for name, mark in zip(names, marks)
]

print(students)


# ============================================================
# 101. FILTER ACTIVE USERS
# ============================================================

users = [
    {
        "name": "Shiva",
        "active": True,
    },
    {
        "name": "Ram",
        "active": False,
    },
    {
        "name": "Raj",
        "active": True,
    },
]

active_users = [
    user
    for user in users
    if user["active"]
]

print(active_users)


# ============================================================
# 102. EXTRACT VALUES FROM OBJECTS
# ============================================================

users = [
    {
        "name": "Shiva",
        "age": 21,
    },
    {
        "name": "Ram",
        "age": 22,
    },
    {
        "name": "Raj",
        "age": 20,
    },
]

names = [
    user["name"]
    for user in users
]

print(names)


# ============================================================
# 103. PRACTICAL — FIND DUPLICATES
# ============================================================

numbers = [1, 2, 3, 2, 4, 5, 1]

seen = set()
duplicates = []

for number in numbers:

    if number in seen:

        if number not in duplicates:
            duplicates.append(number)

    else:
        seen.add(number)

print("Duplicates:", duplicates)


# ============================================================
# 104. PRACTICAL — PARTITION DATA
# ============================================================

numbers = [1, 2, 3, 4, 5, 6]

even = []
odd = []

for number in numbers:

    if number % 2 == 0:
        even.append(number)
    else:
        odd.append(number)

print("Even:", even)
print("Odd:", odd)


# ============================================================
# 105. PRACTICAL — SORT PRODUCTS
# ============================================================

products = [
    {"name": "Laptop", "price": 65000},
    {"name": "Mouse", "price": 1000},
    {"name": "Phone", "price": 30000},
]

products.sort(
    key=lambda product: product["price"],
    reverse=True,
)

for product in products:
    print(product)


# ============================================================
# 106. LIST PERFORMANCE — IMPORTANT
# ============================================================

"""
List operations have different performance costs.

Fast / usually O(1):

    list[index]
    append()
    pop()              # from end

Usually O(n):

    search
    value in list
    remove()
    index()
    count()

Potentially O(n):

    insert(0, value)
    pop(0)

Why?

A Python list is a dynamic array.

Inserting/removing at the beginning can require
shifting many elements.
"""


# ============================================================
# 107. STACK USING LIST
# ============================================================

stack = []

stack.append("A")
stack.append("B")
stack.append("C")

print(stack)

item = stack.pop()

print("Popped:", item)
print(stack)


# List works very well as a stack.


# ============================================================
# 108. QUEUE — BE CAREFUL
# ============================================================

queue = []

queue.append("A")
queue.append("B")
queue.append("C")

# This works but pop(0) is O(n).

item = queue.pop(0)

print(item)


# For real queues, use collections.deque.


# ============================================================
# 109. deque
# ============================================================

from collections import deque

queue = deque()

queue.append("A")
queue.append("B")
queue.append("C")

print(queue)

item = queue.popleft()

print("Removed:", item)
print(queue)


# ============================================================
# 110. LIST AS STACK
# ============================================================

stack = []

stack.append("Task 1")
stack.append("Task 2")
stack.append("Task 3")

while stack:

    task = stack.pop()

    print("Processing:", task)


# ============================================================
# 111. FINAL LIST CHEAT SHEET
# ============================================================

"""
CREATE
------

numbers = [1, 2, 3]


ACCESS
------

numbers[0]
numbers[-1]


SLICE
-----

numbers[1:4]
numbers[:3]
numbers[3:]
numbers[::2]
numbers[::-1]


MODIFY
------

numbers[0] = 100


ADD
---

append()
extend()
insert()


REMOVE
------

remove()
pop()
clear()


SEARCH
------

index()
count()
in


SORT
----

sort()
sorted()


REVERSE
-------

reverse()
[::-1]


COPY
----

copy()
list()
[:]

For nested structures:

copy.deepcopy()


UTILITY
-------

len()
min()
max()
sum()
any()
all()


ITERATION
---------

for item in numbers:
    ...


ENUMERATE
---------

for index, item in enumerate(numbers):
    ...


COMPREHENSION
-------------

[x ** 2 for x in numbers]


UNPACKING
---------

first, *middle, last = numbers
"""


# ============================================================
# END
# ============================================================