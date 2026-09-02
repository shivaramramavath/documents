"""
Python match / case
===================

match / case was introduced in Python 3.10.

It is similar to switch/case in other languages,
but Python's match statement is much more powerful.

Basic syntax:

    match value:
        case pattern:
            ...
        case pattern:
            ...
        case _:
            ...

The `_` pattern means "anything else".
"""


# ============================================================
# 1. BASIC MATCH / CASE
# ============================================================

day = 1

match day:

    case 1:
        print("Monday")

    case 2:
        print("Tuesday")

    case 3:
        print("Wednesday")

    case 4:
        print("Thursday")

    case 5:
        print("Friday")

    case 6:
        print("Saturday")

    case 7:
        print("Sunday")

    case _:
        print("Invalid day")


# ============================================================
# 2. match STRING
# ============================================================

command = "start"

match command:

    case "start":
        print("Starting application.")

    case "stop":
        print("Stopping application.")

    case "restart":
        print("Restarting application.")

    case _:
        print("Unknown command.")


# ============================================================
# 3. MATCH WITH MULTIPLE VALUES
# ============================================================

status = "pending"

match status:

    case "pending" | "processing":
        print("Request is still being processed.")

    case "completed":
        print("Request completed.")

    case "failed":
        print("Request failed.")

    case _:
        print("Unknown status.")


# `|` means OR.


# ============================================================
# 4. MATCH MULTIPLE CASES SEPARATELY
# ============================================================

role = "admin"

match role:

    case "admin":
        print("Full access.")

    case "manager":
        print("Management access.")

    case "user":
        print("Normal user access.")

    case "guest":
        print("Limited access.")

    case _:
        print("Unknown role.")


# ============================================================
# 5. DEFAULT CASE
# ============================================================

value = "hello"

match value:

    case "python":
        print("Python")

    case "java":
        print("Java")

    case _:
        print("Something else.")


# `_` is similar to "default" in switch statements.


# ============================================================
# 6. MATCH INTEGER
# ============================================================

number = 10

match number:

    case 0:
        print("Zero")

    case 1:
        print("One")

    case 10:
        print("Ten")

    case _:
        print("Other number")


# ============================================================
# 7. MATCH BOOLEAN
# ============================================================

is_active = True

match is_active:

    case True:
        print("User is active.")

    case False:
        print("User is inactive.")


# ============================================================
# 8. MATCH WITH GUARD
# ============================================================

age = 21

match age:

    case age if age < 13:
        print("Child")

    case age if age < 18:
        print("Teenager")

    case age if age >= 18:
        print("Adult")


# `if` after the pattern is called a guard.


# ============================================================
# 9. GUARD WITH MULTIPLE CONDITIONS
# ============================================================

number = 15

match number:

    case number if number > 0 and number % 2 == 0:
        print("Positive even number")

    case number if number > 0:
        print("Positive odd number")

    case number if number < 0:
        print("Negative number")

    case 0:
        print("Zero")


# ============================================================
# 10. MATCH TUPLES
# ============================================================

point = (10, 20)

match point:

    case (0, 0):
        print("Origin")

    case (0, y):
        print("On Y axis:", y)

    case (x, 0):
        print("On X axis:", x)

    case (x, y):
        print("Point:", x, y)


# ============================================================
# 11. CAPTURE VALUES
# ============================================================

point = (100, 200)

match point:

    case (x, y):
        print("X:", x)
        print("Y:", y)


# x and y capture the values.


# ============================================================
# 12. WILDCARD
# ============================================================

point = (10, 20, 30)

match point:

    case (x, y, _):
        print("X:", x)
        print("Y:", y)


# `_` ignores the third value.


# ============================================================
# 13. LIST PATTERN
# ============================================================

numbers = [1, 2, 3]

match numbers:

    case []:
        print("Empty list")

    case [1]:
        print("List containing only 1")

    case [1, 2]:
        print("List containing 1 and 2")

    case [1, 2, 3]:
        print("List containing 1, 2, 3")

    case _:
        print("Other list")


# ============================================================
# 14. LIST PATTERN WITH CAPTURE
# ============================================================

numbers = [10, 20]

match numbers:

    case [first, second]:
        print("First:", first)
        print("Second:", second)


# ============================================================
# 15. LIST WITH REST OF VALUES
# ============================================================

numbers = [1, 2, 3, 4, 5]

match numbers:

    case [first, *rest]:
        print("First:", first)
        print("Rest:", rest)


# Output:
#
# First: 1
# Rest: [2, 3, 4, 5]


# ============================================================
# 16. FIRST + MIDDLE + LAST
# ============================================================

numbers = [10, 20, 30, 40, 50]

match numbers:

    case [first, *middle, last]:
        print("First:", first)
        print("Middle:", middle)
        print("Last:", last)


# ============================================================
# 17. EMPTY LIST
# ============================================================

items = []

match items:

    case []:
        print("No items.")

    case [first, *rest]:
        print("First item:", first)


# ============================================================
# 18. MATCH DICTIONARY
# ============================================================

user = {
    "name": "Shiva",
    "age": 21,
}

match user:

    case {"name": name, "age": age}:
        print("Name:", name)
        print("Age:", age)

    case _:
        print("Unknown user")


# ============================================================
# 19. MATCH DICTIONARY PARTIALLY
# ============================================================

user = {
    "name": "Shiva",
    "age": 21,
    "branch": "CSE",
}

match user:

    case {"name": name}:
        print("Name:", name)


# This can match even when the dictionary contains
# additional keys.


# ============================================================
# 20. DICTIONARY WITH CONDITION
# ============================================================

user = {
    "name": "Shiva",
    "age": 21,
}

match user:

    case {"name": name, "age": age} if age >= 18:
        print(name, "is an adult.")

    case {"name": name, "age": age}:
        print(name, "is a minor.")

    case _:
        print("Invalid user data.")


# ============================================================
# 21. MATCH API RESPONSE
# ============================================================

response = {
    "status": 200,
    "data": {
        "name": "Shiva"
    }
}

match response:

    case {"status": 200, "data": data}:
        print("Success:", data)

    case {"status": 404}:
        print("Not found.")

    case {"status": 500}:
        print("Server error.")

    case _:
        print("Unknown response.")


# ============================================================
# 22. API RESPONSE WITH STATUS RANGE
# ============================================================

response = {
    "status": 201,
    "data": {
        "id": 10
    }
}

match response:

    case {"status": status, "data": data} if 200 <= status < 300:
        print("Success:", status, data)

    case {"status": status} if 400 <= status < 500:
        print("Client error:", status)

    case {"status": status} if 500 <= status < 600:
        print("Server error:", status)

    case _:
        print("Unknown response.")


# ============================================================
# 23. MATCH HTTP METHODS
# ============================================================

method = "POST"

match method:

    case "GET":
        print("Read resource.")

    case "POST":
        print("Create resource.")

    case "PUT":
        print("Replace resource.")

    case "PATCH":
        print("Update resource.")

    case "DELETE":
        print("Delete resource.")

    case _:
        print("Unsupported method.")


# ============================================================
# 24. PRACTICAL CLI MENU
# ============================================================

choice = input(
    "1. Add\n"
    "2. View\n"
    "3. Delete\n"
    "4. Exit\n"
    "Choose: "
)

match choice:

    case "1":
        print("Add selected.")

    case "2":
        print("View selected.")

    case "3":
        print("Delete selected.")

    case "4":
        print("Exit selected.")

    case _:
        print("Invalid choice.")


# ============================================================
# 25. MATCH + FUNCTION
# ============================================================

def handle_command(command):

    match command:

        case "start":
            return "Application started."

        case "stop":
            return "Application stopped."

        case "restart":
            return "Application restarted."

        case _:
            return "Unknown command."


print(handle_command("start"))
print(handle_command("restart"))
print(handle_command("hello"))


# ============================================================
# 26. MATCH COMMAND + ARGUMENT
# ============================================================

command = ("create", "user")

match command:

    case ("create", "user"):
        print("Creating user.")

    case ("create", "post"):
        print("Creating post.")

    case ("delete", "user"):
        print("Deleting user.")

    case ("delete", "post"):
        print("Deleting post.")

    case _:
        print("Unknown command.")


# ============================================================
# 27. MATCH COMMAND + CAPTURE ID
# ============================================================

command = ("delete", 101)

match command:

    case ("delete", user_id):
        print("Deleting user:", user_id)

    case ("create", name):
        print("Creating user:", name)

    case _:
        print("Unknown command.")


# ============================================================
# 28. MATCH EVENT TYPES
# ============================================================

event = {
    "type": "user.created",
    "user_id": 123,
}

match event:

    case {
        "type": "user.created",
        "user_id": user_id,
    }:
        print("User created:", user_id)

    case {
        "type": "user.deleted",
        "user_id": user_id,
    }:
        print("User deleted:", user_id)

    case _:
        print("Unknown event.")


# This pattern is useful for event-driven systems.


# ============================================================
# 29. MATCH NESTED DATA
# ============================================================

response = {
    "status": "success",
    "user": {
        "id": 1,
        "name": "Shiva",
    },
}

match response:

    case {
        "status": "success",
        "user": {
            "id": user_id,
            "name": name,
        },
    }:
        print(user_id, name)

    case _:
        print("Invalid response.")


# ============================================================
# 30. MATCH WITH OR PATTERN
# ============================================================

status = "pending"

match status:

    case "pending" | "processing":
        print("Still processing.")

    case "success" | "completed":
        print("Completed successfully.")

    case "failed" | "cancelled":
        print("Operation failed.")

    case _:
        print("Unknown status.")


# ============================================================
# 31. MATCH CLASS INSTANCES
# ============================================================

class Point:

    def __init__(self, x, y):
        self.x = x
        self.y = y


point = Point(10, 20)

match point:

    case Point(x, y):
        print("Point:", x, y)


# Class patterns become especially useful when working
# with OOP and dataclasses.


# ============================================================
# 32. DATACLASS + MATCH
# ============================================================

from dataclasses import dataclass


@dataclass
class User:
    name: str
    age: int


user = User("Shiva", 21)

match user:

    case User(name, age) if age >= 18:
        print(name, "is an adult.")

    case User(name, age):
        print(name, "is a minor.")


# ============================================================
# 33. MATCH NONE
# ============================================================

value = None

match value:

    case None:
        print("No value.")

    case _:
        print("Value exists.")


# ============================================================
# 34. MATCH BOOLEAN
# ============================================================

authenticated = False

match authenticated:

    case True:
        print("Authenticated.")

    case False:
        print("Not authenticated.")


# ============================================================
# 35. MATCH WITH ENUM-LIKE VALUES
# ============================================================

status = "ACTIVE"

match status:

    case "ACTIVE":
        print("Account active.")

    case "INACTIVE":
        print("Account inactive.")

    case "BLOCKED":
        print("Account blocked.")

    case _:
        print("Unknown account status.")


# ============================================================
# 36. MATCH DATA TYPE
# ============================================================

value = 100

match value:

    case int():
        print("Integer")

    case float():
        print("Float")

    case str():
        print("String")

    case list():
        print("List")

    case _:
        print("Other type")


# ============================================================
# 37. MATCH INTEGER WITH GUARDS
# ============================================================

number = 42

match number:

    case int() if number > 0:
        print("Positive integer.")

    case int() if number < 0:
        print("Negative integer.")

    case 0:
        print("Zero.")

    case _:
        print("Not an integer.")


# ============================================================
# 38. MATCH TUPLE + GUARD
# ============================================================

point = (10, 20)

match point:

    case (x, y) if x == y:
        print("Diagonal point.")

    case (x, y):
        print("Normal point:", x, y)


# ============================================================
# 39. MATCH NESTED LIST
# ============================================================

data = [
    ["Shiva", 21],
    ["Ram", 22],
]

match data:

    case [[name1, age1], [name2, age2]]:
        print(name1, age1)
        print(name2, age2)

    case _:
        print("Unexpected structure.")


# ============================================================
# 40. PRACTICAL — AUTHORIZATION
# ============================================================

request = {
    "user": {
        "role": "admin"
    },
    "action": "delete",
}

match request:

    case {
        "user": {"role": "admin"},
        "action": "delete",
    }:
        print("Delete allowed.")

    case {
        "user": {"role": "user"},
        "action": "delete",
    }:
        print("Delete denied.")

    case _:
        print("Unknown request.")


# ============================================================
# 41. PRACTICAL — PAYMENT STATUS
# ============================================================

payment = {
    "status": "success",
    "amount": 500,
}

match payment:

    case {"status": "success", "amount": amount}:
        print("Payment successful:", amount)

    case {"status": "pending"}:
        print("Payment pending.")

    case {"status": "failed"}:
        print("Payment failed.")

    case _:
        print("Unknown payment status.")


# ============================================================
# 42. PRACTICAL — DATABASE RESULT
# ============================================================

result = {
    "found": True,
    "user": {
        "id": 10,
        "name": "Shiva",
    },
}

match result:

    case {
        "found": True,
        "user": user,
    }:
        print("User found:", user)

    case {"found": False}:
        print("User not found.")

    case _:
        print("Invalid database response.")


# ============================================================
# 43. MATCH vs if / elif
# ============================================================

value = "python"

# if / elif:

if value == "python":
    print("Python")

elif value == "java":
    print("Java")

else:
    print("Other")


# match / case:

match value:

    case "python":
        print("Python")

    case "java":
        print("Java")

    case _:
        print("Other")


# For simple equality checks, both can be readable.


# ============================================================
# 44. WHEN MATCH IS BETTER
# ============================================================

"""
match is especially useful when matching STRUCTURE.

Example:

    event = {
        "type": "user.created",
        "user_id": 10,
    }

    match event:
        case {
            "type": "user.created",
            "user_id": user_id,
        }:
            ...


This is more expressive than many nested if statements.
"""


# ============================================================
# 45. MATCH IS NOT JUST SWITCH/CASE
# ============================================================

"""
Traditional switch:

    switch value:
        case 1:
        case 2:

Python:

    match value:
        case 1:
        case 2:

But Python additionally supports:

    tuple patterns
    list patterns
    dictionary patterns
    class patterns
    value capture
    OR patterns
    wildcard patterns
    guards
    nested patterns
"""


# ============================================================
# 46. IMPORTANT — VARIABLE CAPTURE
# ============================================================

"""
Be careful:

    match value:
        case x:
            print(x)

This does NOT mean:

    "if value == x"

Instead, x captures whatever value is being matched.

For constants, use literal values or qualified names.
"""


# ============================================================
# 47. PRACTICAL EVENT HANDLER
# ============================================================

def handle_event(event):

    match event:

        case {
            "type": "user.created",
            "user_id": user_id,
        }:
            return f"Create user event: {user_id}"

        case {
            "type": "user.updated",
            "user_id": user_id,
        }:
            return f"Update user event: {user_id}"

        case {
            "type": "user.deleted",
            "user_id": user_id,
        }:
            return f"Delete user event: {user_id}"

        case _:
            return "Unknown event"


events = [
    {
        "type": "user.created",
        "user_id": 1,
    },
    {
        "type": "user.updated",
        "user_id": 2,
    },
    {
        "type": "user.deleted",
        "user_id": 3,
    },
]

for event in events:
    print(handle_event(event))


# ============================================================
# 48. PRACTICAL — COMMAND ROUTER
# ============================================================

def route_command(command):

    match command:

        case ("user", "create", name):
            return f"Creating user {name}"

        case ("user", "delete", user_id):
            return f"Deleting user {user_id}"

        case ("post", "create", title):
            return f"Creating post: {title}"

        case ("post", "delete", post_id):
            return f"Deleting post {post_id}"

        case _:
            return "Unknown command"


print(route_command(("user", "create", "Shiva")))
print(route_command(("user", "delete", 10)))
print(route_command(("post", "create", "Python Tutorial")))


# ============================================================
# 49. FINAL CHEAT SHEET
# ============================================================

"""
BASIC
-----

match value:
    case 1:
        ...
    case 2:
        ...
    case _:
        ...


OR
--

match value:
    case "start" | "run":
        ...


GUARD
-----

match value:
    case x if x > 10:
        ...


TUPLE
-----

match point:
    case (0, 0):
        ...
    case (x, y):
        ...


LIST
----

match values:
    case []:
        ...
    case [first, *rest]:
        ...


DICTIONARY
----------

match user:
    case {"name": name, "age": age}:
        ...


NESTED
------

match response:
    case {
        "status": 200,
        "data": data,
    }:
        ...


CLASS
-----

match user:
    case User(name, age):
        ...


WILDCARD
--------

case _:
    ...


OR PATTERN
----------

case "pending" | "processing":
    ...


GUARD
-----

case x if condition:
    ...
"""


# ============================================================
# END
# ============================================================