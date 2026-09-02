"""
Python while Loops
==================

A while loop repeatedly executes a block of code
while a condition is True.

Basic syntax:

    while condition:
        # code

A while loop is useful when you don't know in advance
exactly how many times something should run.
"""


# ============================================================
# 1. BASIC WHILE LOOP
# ============================================================

count = 1

while count <= 5:
    print(count)
    count += 1


# Output:
#
# 1
# 2
# 3
# 4
# 5


# ============================================================
# 2. HOW A WHILE LOOP WORKS
# ============================================================

count = 1

while count <= 3:
    print("Count:", count)

    count += 1


"""
Execution:

count = 1
    ↓
1 <= 3 → True
    ↓
print 1
    ↓
count = 2
    ↓
2 <= 3 → True
    ↓
print 2
    ↓
count = 3
    ↓
3 <= 3 → True
    ↓
print 3
    ↓
count = 4
    ↓
4 <= 3 → False
    ↓
loop ends
"""


# ============================================================
# 3. DECREMENTING
# ============================================================

count = 5

while count >= 1:
    print(count)
    count -= 1


# ============================================================
# 4. COUNTDOWN
# ============================================================

count = 10

while count > 0:
    print(count)
    count -= 1

print("Go!")


# ============================================================
# 5. INCREMENT BY DIFFERENT VALUES
# ============================================================

number = 0

while number <= 20:
    print(number)
    number += 5


# Output:
#
# 0
# 5
# 10
# 15
# 20


# ============================================================
# 6. WHILE WITH MULTIPLE CONDITIONS
# ============================================================

age = 10

while age <= 18:
    print("Age:", age)
    age += 2


# ============================================================
# 7. WHILE + AND
# ============================================================

number = 1

while number <= 20 and number != 10:
    print(number)
    number += 1


# ============================================================
# 8. WHILE + OR
# ============================================================

number = 1

while number <= 5 or number == 10:
    print(number)

    if number == 5:
        break

    number += 1


# ============================================================
# 9. WHILE WITH IF
# ============================================================

number = 1

while number <= 10:

    if number % 2 == 0:
        print(number, "Even")
    else:
        print(number, "Odd")

    number += 1


# ============================================================
# 10. BREAK
# ============================================================

number = 1

while number <= 10:

    if number == 5:
        break

    print(number)

    number += 1


# Output:
#
# 1
# 2
# 3
# 4


# break immediately exits the loop.


# ============================================================
# 11. CONTINUE
# ============================================================

number = 0

while number < 10:

    number += 1

    if number == 5:
        continue

    print(number)


# 5 is skipped.


# ============================================================
# 12. IMPORTANT: CONTINUE AND INFINITE LOOPS
# ============================================================

"""
Be careful with continue.

BAD:

    number = 0

    while number < 10:

        if number == 5:
            continue

        number += 1

At number == 5:

    continue

runs forever because number never increases.
"""


# Correct:

number = 0

while number < 10:

    number += 1

    if number == 5:
        continue

    print(number)


# ============================================================
# 13. WHILE TRUE
# ============================================================

"""
while True creates a loop whose condition is always True.

Usually, we use break to exit it.
"""

counter = 0

while True:

    counter += 1

    print(counter)

    if counter == 5:
        break


# ============================================================
# 14. WHILE TRUE + USER INPUT
# ============================================================

while True:

    command = input("Enter command (quit to exit): ")

    if command == "quit":
        break

    print("You entered:", command)


# ============================================================
# 15. INPUT VALIDATION
# ============================================================

while True:

    age = int(input("Enter your age: "))

    if age >= 0:
        break

    print("Age cannot be negative.")


print("Valid age:", age)


# ============================================================
# 16. INPUT VALIDATION — RANGE
# ============================================================

while True:

    marks = float(input("Enter marks (0-100): "))

    if 0 <= marks <= 100:
        break

    print("Marks must be between 0 and 100.")


print("Valid marks:", marks)


# ============================================================
# 17. PASSWORD VALIDATION
# ============================================================

correct_password = "python123"

while True:

    password = input("Enter password: ")

    if password == correct_password:
        print("Login successful.")
        break

    print("Incorrect password.")


# ============================================================
# 18. LIMIT LOGIN ATTEMPTS
# ============================================================

correct_password = "python123"

attempts = 0
max_attempts = 3

while attempts < max_attempts:

    password = input("Enter password: ")

    attempts += 1

    if password == correct_password:
        print("Login successful.")
        break

    print("Incorrect password.")

else:
    print("Account temporarily locked.")


# ============================================================
# 19. WHILE-ELSE
# ============================================================

number = 1

while number <= 5:
    print(number)
    number += 1

else:
    print("Loop completed.")


# ============================================================
# 20. WHILE-ELSE WITH BREAK
# ============================================================

number = 1

while number <= 5:

    if number == 3:
        break

    print(number)

    number += 1

else:
    print("Loop completed.")


# The else does not execute because break occurred.


# ============================================================
# 21. SUM USING WHILE
# ============================================================

number = 1
total = 0

while number <= 10:

    total += number
    number += 1

print("Total:", total)


# ============================================================
# 22. FACTORIAL USING WHILE
# ============================================================

number = 5

factorial = 1
counter = 1

while counter <= number:

    factorial *= counter
    counter += 1

print("Factorial:", factorial)


# ============================================================
# 23. REVERSE A NUMBER
# ============================================================

number = 12345

reverse = 0

while number > 0:

    digit = number % 10

    reverse = reverse * 10 + digit

    number //= 10

print("Reverse:", reverse)


# ============================================================
# 24. COUNT DIGITS
# ============================================================

number = 123456

count = 0

while number > 0:

    number //= 10
    count += 1

print("Digits:", count)


# ============================================================
# 25. SUM OF DIGITS
# ============================================================

number = 12345

total = 0

while number > 0:

    digit = number % 10

    total += digit

    number //= 10

print("Digit sum:", total)


# ============================================================
# 26. PALINDROME NUMBER
# ============================================================

number = 121

original = number
reverse = 0

while number > 0:

    digit = number % 10

    reverse = reverse * 10 + digit

    number //= 10


if original == reverse:
    print("Palindrome")
else:
    print("Not palindrome")


# ============================================================
# 27. ARMSTRONG NUMBER — THREE DIGITS
# ============================================================

number = 153

original = number
total = 0

while number > 0:

    digit = number % 10

    total += digit ** 3

    number //= 10


if total == original:
    print("Armstrong number")
else:
    print("Not an Armstrong number")


# ============================================================
# 28. FIBONACCI USING WHILE
# ============================================================

count = 0
limit = 10

a = 0
b = 1

while count < limit:

    print(a)

    a, b = b, a + b

    count += 1


# ============================================================
# 29. SEARCH WITH WHILE
# ============================================================

numbers = [10, 20, 30, 40, 50]

target = 30

index = 0

while index < len(numbers):

    if numbers[index] == target:
        print("Found at index:", index)
        break

    index += 1


# ============================================================
# 30. SEARCH WITHOUT BREAK
# ============================================================

numbers = [10, 20, 30, 40, 50]

target = 30

index = 0
found = False

while index < len(numbers):

    if numbers[index] == target:
        found = True
        break

    index += 1


if found:
    print("Found")
else:
    print("Not found")


# ============================================================
# 31. MENU-DRIVEN PROGRAM
# ============================================================

while True:

    print("\n--- MENU ---")
    print("1. Say Hello")
    print("2. Say Goodbye")
    print("3. Exit")

    choice = input("Choose: ")

    if choice == "1":
        print("Hello!")

    elif choice == "2":
        print("Goodbye!")

    elif choice == "3":
        print("Exiting...")
        break

    else:
        print("Invalid choice.")


# ============================================================
# 32. SIMPLE CALCULATOR
# ============================================================

while True:

    print("\n--- Calculator ---")
    print("1. Add")
    print("2. Subtract")
    print("3. Multiply")
    print("4. Divide")
    print("5. Exit")

    choice = input("Choose: ")

    if choice == "5":
        print("Calculator closed.")
        break

    if choice in {"1", "2", "3", "4"}:

        a = float(input("Enter first number: "))
        b = float(input("Enter second number: "))

        if choice == "1":
            print("Result:", a + b)

        elif choice == "2":
            print("Result:", a - b)

        elif choice == "3":
            print("Result:", a * b)

        elif choice == "4":

            if b == 0:
                print("Cannot divide by zero.")
            else:
                print("Result:", a / b)

    else:
        print("Invalid choice.")


# ============================================================
# 33. SENTINEL VALUE
# ============================================================

"""
A sentinel is a special value that tells the loop to stop.
"""

total = 0

while True:

    number = int(input("Enter number (0 to stop): "))

    if number == 0:
        break

    total += number


print("Total:", total)


# ============================================================
# 34. SENTINEL WITH TEXT
# ============================================================

total = 0

while True:

    value = input("Enter number (done to stop): ")

    if value.lower() == "done":
        break

    number = float(value)

    total += number


print("Total:", total)


# ============================================================
# 35. PROCESS UNTIL EMPTY INPUT
# ============================================================

while True:

    name = input("Enter name (empty to stop): ")

    if not name:
        break

    print("Hello,", name)


# ============================================================
# 36. NESTED WHILE LOOPS
# ============================================================

i = 1

while i <= 3:

    j = 1

    while j <= 3:

        print(i, j)

        j += 1

    i += 1


# ============================================================
# 37. PATTERN WITH WHILE
# ============================================================

row = 1

while row <= 5:

    column = 1

    while column <= row:

        print("*", end=" ")

        column += 1

    print()

    row += 1


# Output:
#
# *
# * *
# * * *
# * * * *
# * * * * *


# ============================================================
# 38. PROCESSING A QUEUE
# ============================================================

tasks = [
    "Learn Python",
    "Practice loops",
    "Build a project",
]

while tasks:

    task = tasks.pop(0)

    print("Processing:", task)


# The loop stops when the list becomes empty.


# ============================================================
# 39. PROCESSING A STACK
# ============================================================

tasks = [
    "Task 1",
    "Task 2",
    "Task 3",
]

while tasks:

    task = tasks.pop()

    print("Processing:", task)


# ============================================================
# 40. STATE-BASED LOOP
# ============================================================

balance = 1000

while balance > 0:

    print("Current balance:", balance)

    payment = 250

    balance -= payment


print("Balance exhausted.")


# ============================================================
# 41. PRACTICAL — ATM MENU
# ============================================================

balance = 10000

while True:

    print("\n--- ATM ---")
    print("1. Check Balance")
    print("2. Deposit")
    print("3. Withdraw")
    print("4. Exit")

    choice = input("Choose: ")

    if choice == "1":

        print("Balance:", balance)

    elif choice == "2":

        amount = float(input("Deposit amount: "))

        if amount > 0:
            balance += amount
            print("Deposited successfully.")
        else:
            print("Invalid amount.")

    elif choice == "3":

        amount = float(input("Withdraw amount: "))

        if amount <= 0:
            print("Invalid amount.")

        elif amount > balance:
            print("Insufficient balance.")

        else:
            balance -= amount
            print("Withdrawal successful.")

    elif choice == "4":

        print("Thank you.")
        break

    else:

        print("Invalid choice.")


# ============================================================
# 42. PRACTICAL — GUESSING GAME
# ============================================================

secret_number = 42

while True:

    guess = int(input("Guess the number: "))

    if guess == secret_number:

        print("Correct!")
        break

    elif guess < secret_number:

        print("Too low.")

    else:

        print("Too high.")


# ============================================================
# 43. GUESSING GAME WITH ATTEMPTS
# ============================================================

secret_number = 42

attempts = 0
max_attempts = 5

while attempts < max_attempts:

    guess = int(input("Guess the number: "))

    attempts += 1

    if guess == secret_number:

        print("Correct!")
        break

    elif guess < secret_number:

        print("Too low.")

    else:

        print("Too high.")

else:

    print("You ran out of attempts.")


# ============================================================
# 44. for vs while
# ============================================================

"""
Use FOR when:

    You are iterating over a collection.

Example:

    for user in users:
        process(user)


Use WHILE when:

    The loop depends on a condition/state.

Example:

    while balance > 0:
        process_payment()


Use WHILE when:

    You don't know beforehand how many iterations
    will be required.
"""


# ============================================================
# 45. SAME PROBLEM — FOR
# ============================================================

for number in range(1, 6):
    print(number)


# ============================================================
# 46. SAME PROBLEM — WHILE
# ============================================================

number = 1

while number <= 5:

    print(number)

    number += 1


# ============================================================
# 47. INFINITE LOOP
# ============================================================

"""
This is an infinite loop:

    while True:
        print("Running")

It will continue forever unless something external
stops the program.

Normally:

    while True:
        ...
        if condition:
            break
"""


# ============================================================
# 48. COMMON INFINITE LOOP BUG
# ============================================================

"""
BAD:

    count = 1

    while count <= 5:
        print(count)

There is no:

    count += 1

Therefore count remains 1 forever.
"""


# Correct:

count = 1

while count <= 5:

    print(count)

    count += 1


# ============================================================
# 49. LOOP VARIABLE MUST CHANGE
# ============================================================

number = 1

while number <= 100:

    print(number)

    number *= 2


# Output:
#
# 1
# 2
# 4
# 8
# 16
# 32
# 64


# ============================================================
# 50. WHILE LOOP WITH FUNCTIONS
# ============================================================

def process(number):
    print("Processing:", number)


number = 1

while number <= 5:

    process(number)

    number += 1


# ============================================================
# 51. PRACTICAL — RETRY PATTERN
# ============================================================

attempt = 0
max_attempts = 3

while attempt < max_attempts:

    attempt += 1

    print(f"Attempt {attempt}")

    success = attempt == 3

    if success:
        print("Operation successful.")
        break

else:
    print("Operation failed.")


# This pattern is very common in backend programming.


# ============================================================
# 52. PRACTICAL — RETRY WITH STATE
# ============================================================

attempt = 0
max_attempts = 5

while attempt < max_attempts:

    attempt += 1

    print("Trying operation...")

    # Simulated condition
    operation_successful = attempt >= 3

    if operation_successful:
        print("Success!")
        break

    print("Failed. Retrying...")


# ============================================================
# 53. WHILE LOOP + COLLECTION
# ============================================================

numbers = [10, 20, 30, 40, 50]

while numbers:

    number = numbers.pop()

    print("Processing:", number)


# ============================================================
# 54. FINAL MODEL
# ============================================================

"""
WHILE LOOP

                ┌──────────────┐
                │   condition  │
                └──────┬───────┘
                       │
                  True │
                       ↓
                ┌──────────────┐
                │  loop body   │
                └──────┬───────┘
                       │
                       ↓
                update state
                       │
                       └───────────┐
                                   │
                                   ↓
                              condition

                  False
                    ↓
                loop ends


Important concepts:

    while
    break
    continue
    while-else
    while True
    sentinel values
    input validation
    retry loops
    state-based loops
    nested while loops
    infinite loops
"""