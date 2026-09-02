"""
Python Modules
==============

A module is simply a Python file (.py) containing
Python code that can be reused from another file.

Topics:

    1. What is a module?
    2. Creating a module
    3. Importing a module
    4. import statement
    5. from ... import
    6. Module aliases
    7. Module namespace
    8. __name__
    9. __main__
    10. Reusable modules
    11. Standard-library modules
    12. Third-party modules
    13. Circular imports
    14. Best practices
"""


# ============================================================
# 1. WHAT IS A MODULE?
# ============================================================

"""
Every .py file can be a Python module.

Example:

    calculator.py

can contain:

    add()
    subtract()
    multiply()

Another file can import them.
"""


# ============================================================
# 2. SIMPLE MODULE EXAMPLE
# ============================================================

"""
Imagine this file:

    calculator.py

Contents:

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b


Another file:

    app.py

can use:

    import calculator

    print(
        calculator.add(10, 20)
    )
"""


# ============================================================
# 3. IMPORT A MODULE
# ============================================================

"""
Example:

    import math

math is a module from Python's
standard library.
"""

import math

print(
    math.sqrt(25)
)

print(
    math.pi
)


# ============================================================
# 4. MODULE.NAMESPACE
# ============================================================

"""
When you write:

    import math

Python gives you the math module object.

Functions/constants are accessed through:

    math.sqrt()
    math.pi
"""

print(
    math.pow(2, 3)
)


# ============================================================
# 5. MODULE ALIAS
# ============================================================

import math as mathematics

print(
    mathematics.sqrt(100)
)


"""
Aliases are useful when:

    - module names are long
    - a shorter conventional name exists
"""


# ============================================================
# 6. COMMON MODULE ALIASES
# ============================================================

"""
Common examples:

    import numpy as np
    import pandas as pd

These are conventions, not special Python syntax.
"""


# ============================================================
# 7. IMPORT SPECIFIC FUNCTION
# ============================================================

from math import sqrt

print(
    sqrt(36)
)


# ============================================================
# 8. IMPORT MULTIPLE ITEMS
# ============================================================

from math import sqrt, pi

print(sqrt(49))
print(pi)


# ============================================================
# 9. IMPORT WITH ALIAS
# ============================================================

from math import sqrt as square_root

print(
    square_root(64)
)


# ============================================================
# 10. import MODULE VS from MODULE import
# ============================================================

"""
Option 1:

    import math

    math.sqrt(25)


Option 2:

    from math import sqrt

    sqrt(25)


Both work.

For larger projects, using:

    module.function()

can make the origin of a function clearer.
"""


# ============================================================
# 11. STANDARD LIBRARY MODULES
# ============================================================

import os
import sys
import json
import random
import datetime

print(
    os.name
)

print(
    sys.version
)

print(
    random.randint(1, 10)
)

print(
    datetime.datetime.now()
)


# ============================================================
# 12. sys MODULE
# ============================================================

"""
sys provides access to Python runtime/system
information.
"""

import sys

print(
    sys.version
)

print(
    sys.platform
)

print(
    sys.path
)


# ============================================================
# 13. sys.argv
# ============================================================

"""
sys.argv contains command-line arguments.

Run:

    python modules.py Shiva 21

Then:

    sys.argv[0] -> modules.py
    sys.argv[1] -> Shiva
    sys.argv[2] -> 21
"""

print(
    sys.argv
)


# ============================================================
# 14. os MODULE
# ============================================================

import os

print(
    os.getcwd()
)

print(
    os.listdir()
)


# ============================================================
# 15. pathlib MODULE
# ============================================================

from pathlib import Path

current_directory = Path.cwd()

print(
    current_directory
)


# ============================================================
# 16. json MODULE
# ============================================================

import json

user = {
    "name": "Shiva",
    "age": 21,
}

json_data = json.dumps(user)

print(
    json_data
)


# ============================================================
# 17. random MODULE
# ============================================================

import random

numbers = [
    10,
    20,
    30,
    40,
]

print(
    random.choice(numbers)
)


# ============================================================
# 18. datetime MODULE
# ============================================================

from datetime import datetime

now = datetime.now()

print(
    now
)


# ============================================================
# 19. CREATE YOUR OWN MODULE
# ============================================================

"""
Suppose your directory contains:

    calculator.py
    modules.py

calculator.py:

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b


Then modules.py can contain:

    import calculator

    print(
        calculator.add(10, 20)
    )
"""


# ============================================================
# 20. USER-DEFINED MODULE EXAMPLE
# ============================================================

"""
Create:

    05_modules_packages/
        modules.py
        calculator.py

calculator.py:

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b


Then:

    import calculator

    print(
        calculator.add(10, 20)
    )
"""


# ============================================================
# 21. IMPORTING YOUR OWN MODULE
# ============================================================

"""
Example code:

    import calculator

    result = calculator.add(
        10,
        20,
    )

    print(result)

The important point:

    calculator.add()

The module name provides namespace separation.
"""


# ============================================================
# 22. MODULE VARIABLES
# ============================================================

"""
calculator.py:

    PI = 3.14159

    def circle_area(radius):
        return PI * radius ** 2


Then:

    import calculator

    print(calculator.PI)

    print(
        calculator.circle_area(10)
    )
"""


# ============================================================
# 23. MODULE CONSTANTS
# ============================================================

"""
A module can contain constants:

    DEFAULT_TIMEOUT = 30
    API_VERSION = "v1"

Python does not enforce constants.

UPPERCASE is a convention.
"""


# ============================================================
# 24. MODULE CLASSES
# ============================================================

"""
A module can contain classes too.

Example:

    user.py

    class User:

        def __init__(self, name):
            self.name = name


Then:

    from user import User

    user = User("Shiva")
"""


# ============================================================
# 25. MODULE CAN CONTAIN EVERYTHING
# ============================================================

"""
A module can contain:

    variables
    constants
    functions
    classes
    imports
    executable statements
"""


# ============================================================
# 26. __name__
# ============================================================

print(
    __name__
)


"""
When you execute this file directly:

    python modules.py

__name__ is:

    "__main__"


When another file imports it:

    import modules

__name__ becomes:

    "modules"
"""


# ============================================================
# 27. __main__
# ============================================================

if __name__ == "__main__":

    print(
        "This file is being executed directly."
    )


"""
This is one of the most important Python patterns.

It allows a file to behave differently when:

    1. executed directly
    2. imported as a module
"""


# ============================================================
# 28. WHY __main__ MATTERS
# ============================================================

"""
Suppose:

    calculator.py

contains:

    def add(a, b):
        return a + b

    if __name__ == "__main__":
        print(add(10, 20))


Running:

    python calculator.py

prints:

    30


But:

    import calculator

does not execute the main example.

The function is simply imported.
"""


# ============================================================
# 29. MODULE EXECUTION
# ============================================================

"""
When Python imports a module, its top-level
code is executed once during that import.

Example:

    print("calculator loaded")

inside calculator.py.

Then:

    import calculator

will print:

    calculator loaded
"""


# ============================================================
# 30. IMPORT CACHING
# ============================================================

"""
Python caches imported modules in:

    sys.modules

Example:

    import sys

    print(
        "math" in sys.modules
    )

Once imported, Python normally reuses
the already-loaded module.
"""


# ============================================================
# 31. sys.modules
# ============================================================

import sys

print(
    list(sys.modules.keys())[:10]
)


# ============================================================
# 32. IMPORT SAME MODULE TWICE
# ============================================================

import math
import math

"""
The module isn't normally executed from scratch
the second time.

Python uses its module cache.
"""


# ============================================================
# 33. MODULE SEARCH PATH
# ============================================================

import sys

for path in sys.path:

    print(path)


"""
Python searches these locations when
resolving imports.

This is important when debugging:

    ModuleNotFoundError
"""


# ============================================================
# 34. ModuleNotFoundError
# ============================================================

"""
If Python cannot find:

    import my_module

you may get:

    ModuleNotFoundError

Common causes:

    - wrong filename
    - wrong working directory
    - incorrect package structure
    - virtual environment issue
    - module isn't installed
"""


# ============================================================
# 35. IMPORT ERROR
# ============================================================

"""
ModuleNotFoundError is one type of ImportError.

Example:

    from math import something_that_does_not_exist

can raise:

    ImportError
"""


# ============================================================
# 36. from module import *
# ============================================================

"""
Avoid:

    from math import *

Why?

It puts many names into your current namespace
and can cause naming conflicts.

Prefer:

    import math

or:

    from math import sqrt
"""


# ============================================================
# 37. NAME COLLISIONS
# ============================================================

"""
Suppose:

    from module_a import value
    from module_b import value

The second import overwrites the first name.

Using:

    import module_a
    import module_b

avoids this ambiguity:

    module_a.value
    module_b.value
"""


# ============================================================
# 38. IMPORT ALIAS SOLVES COLLISIONS
# ============================================================

"""
You can also write:

    from module_a import value as a_value
    from module_b import value as b_value

Then:

    a_value
    b_value
"""


# ============================================================
# 39. RELATIVE IMPORTS — CONCEPT
# ============================================================

"""
Inside a package:

    from .module import function

means:

    import from the current package


And:

    from ..module import function

means:

    import from the parent package.
"""


# ============================================================
# 40. ABSOLUTE IMPORTS — CONCEPT
# ============================================================

"""
Example:

    from myapp.services.user import UserService

This is an absolute import.

It starts from the package/module namespace.
"""


# ============================================================
# 41. ABSOLUTE VS RELATIVE
# ============================================================

"""
Absolute:

    from myapp.services.user import UserService


Relative:

    from .user import UserService


In larger applications, absolute imports
are often easier to understand.
"""


# ============================================================
# 42. CIRCULAR IMPORT — BAD DESIGN
# ============================================================

"""
Example:

module_a.py:

    from module_b import function_b


module_b.py:

    from module_a import function_a


Now:

    module_a
        ↓
    module_b
        ↓
    module_a

This is a circular import.
"""


# ============================================================
# 43. AVOID CIRCULAR IMPORTS
# ============================================================

"""
Instead of:

    A → B
    B → A

restructure:

    A → C
    B → C

where C contains shared functionality.
"""


# ============================================================
# 44. MODULE RESPONSIBILITY
# ============================================================

"""
A good module usually has a clear responsibility.

Good:

    database.py
    authentication.py
    logging.py
    validation.py


Less useful:

    everything.py
"""


# ============================================================
# 45. MODULE API
# ============================================================

"""
A module can expose a public API.

Example:

    user_service.py

    def create_user():
        ...


    def delete_user():
        ...


Internal helper:

    def _validate_user():
        ...


Leading underscore communicates:

    "This is intended to be internal."
"""


# ============================================================
# 46. SINGLE UNDERSCORE
# ============================================================

def _internal_function():

    print(
        "Internal function"
    )


"""
A leading underscore is a convention indicating
that the name is not intended as public API.

It does not create true privacy.
"""


# ============================================================
# 47. MODULE DOCSTRING
# ============================================================

"""
A module can start with a docstring:

    '''
    User management utilities.
    '''

This documents the purpose of the module.
"""


# ============================================================
# 48. MODULE METADATA
# ============================================================

print(
    __name__
)

print(
    __doc__
)


# ============================================================
# 49. PACKAGE CONCEPT
# ============================================================

"""
A package is a directory used to organize modules.

Example:

    myapp/
        __init__.py
        users.py
        orders.py
        database.py


Conceptually:

    myapp
      ├── users
      ├── orders
      └── database
"""


# ============================================================
# 50. MODULE VS PACKAGE
# ============================================================

"""
MODULE:

    calculator.py


PACKAGE:

    calculator/
        __init__.py
        basic.py
        scientific.py
"""


# ============================================================
# 51. STANDARD LIBRARY PACKAGE EXAMPLES
# ============================================================

"""
Examples include:

    email
    urllib
    xml
    collections

A package can contain multiple modules
and even subpackages.
"""


# ============================================================
# 52. SUBMODULE CONCEPT
# ============================================================

"""
Example:

    myapp/
        users/
            __init__.py
            service.py
            repository.py


Here:

    users

is a package.

    service

is a module.

    repository

is another module.
"""


# ============================================================
# 53. PRACTICAL PROJECT STRUCTURE
# ============================================================

"""
A small backend could eventually look like:

    app/
        __init__.py

        main.py

        models/
            __init__.py
            user.py
            order.py

        services/
            __init__.py
            user_service.py
            order_service.py

        repositories/
            __init__.py
            user_repository.py
"""


# ============================================================
# 54. IMPORT FROM PROJECT
# ============================================================

"""
Example:

    from app.services.user_service import (
        create_user
    )


This allows:

    create_user(...)
"""


# ============================================================
# 55. WHY MODULES MATTER
# ============================================================

"""
Modules provide:

    Reusability
    Organization
    Separation of concerns
    Namespace management
    Testability
    Maintainability
"""


# ============================================================
# 56. REUSABLE MODULE EXAMPLE
# ============================================================

"""
calculator.py

    def add(a, b):
        return a + b


main.py

    from calculator import add

    result = add(10, 20)

    print(result)


This is the basic foundation of
Python application architecture.
"""


# ============================================================
# 57. __name__ PRACTICE
# ============================================================

def hello():

    print(
        "Hello from module"
    )


if __name__ == "__main__":

    hello()


"""
This is the recommended pattern for
code that should run only when the file
is executed directly.
"""


# ============================================================
# 58. IMPORT SIDE EFFECTS
# ============================================================

"""
Avoid putting unnecessary executable code
at module level.

Bad:

    connect_to_database()

    delete_old_files()

    start_server()


These execute during import.

Prefer explicit functions:

    def connect():
        ...


    if __name__ == "__main__":
        connect()
"""


# ============================================================
# 59. GOOD MODULE DESIGN
# ============================================================

"""
A good module should generally:

    - have one clear responsibility
    - expose a small public API
    - avoid unnecessary side effects
    - avoid circular dependencies
    - use descriptive names
    - document important behavior
    - keep dependencies manageable
"""


# ============================================================
# 60. IMPORT ORDER
# ============================================================

"""
Common convention:

1. Standard library

2. Third-party packages

3. Local application modules


Example:

    import json
    import os

    import requests

    from app.services import UserService
"""


# ============================================================
# 61. THIRD-PARTY MODULE
# ============================================================

"""
Third-party modules are installed separately.

Example:

    pip install requests

Then:

    import requests


Unlike:

    math
    json
    os

requests does not come from the
Python standard library.
"""


# ============================================================
# 62. __all__
# ============================================================

"""
A module can define:

    __all__ = [
        "add",
        "subtract",
    ]

This can define what is exported for:

    from module import *
"""


# ============================================================
# 63. __all__ EXAMPLE
# ============================================================

__all__ = [
    "hello",
]


def public_function():

    print(
        "Public"
    )


def hello():

    print(
        "Hello"
    )


def _internal():

    print(
        "Internal"
    )


# ============================================================
# 64. MODULE OBJECT
# ============================================================

"""
A module is an object.

You can inspect it:

    import math

    print(type(math))
"""


import math

print(
    type(math)
)


# ============================================================
# 65. dir() MODULE
# ============================================================

print(
    dir(math)[:20]
)


"""
dir() shows names available on an object.
"""


# ============================================================
# 66. getattr()
# ============================================================

function_name = "sqrt"

sqrt_function = getattr(
    math,
    function_name,
)

print(
    sqrt_function(81)
)


"""
getattr() can dynamically retrieve
an attribute from an object.
"""


# ============================================================
# 67. MODULE INTROSPECTION
# ============================================================

print(
    math.__name__
)

print(
    math.__doc__[:100]
)


# ============================================================
# 68. IMPORTLIB
# ============================================================

import importlib

math_module = importlib.import_module(
    "math"
)

print(
    math_module.sqrt(144)
)


"""
importlib allows dynamic imports.

This becomes useful in advanced applications,
plugin systems, and frameworks.
"""


# ============================================================
# 69. RELOAD MODULE
# ============================================================

"""
importlib.reload(module)

can reload an already imported module.

Example:

    import calculator
    import importlib

    importlib.reload(calculator)

Usually useful during development or
special dynamic systems.

Don't use it as normal application flow.
"""


# ============================================================
# 70. FINAL SUMMARY
# ============================================================

"""
MODULE
======

A .py file containing reusable Python code.


IMPORT
======

import module


FROM IMPORT
===========

from module import function


ALIAS
=====

import module as alias


FUNCTION ALIAS
==============

from module import function as alias


__name__
========

Identifies the current module.


__main__
========

The value of __name__ when a file
is executed directly.


MAIN GUARD
==========

if __name__ == "__main__":
    ...


PACKAGE
=======

Directory organizing modules.


ABSOLUTE IMPORT
===============

from app.services.user import UserService


RELATIVE IMPORT
===============

from .user import User


CIRCULAR IMPORT
===============

A → B → A

Avoid this through better architecture.


sys.path
========

Locations Python searches for imports.


sys.modules
===========

Python's loaded-module cache.


BEST PRACTICES
==============

- Keep modules focused.
- Prefer explicit imports.
- Avoid import *.
- Avoid circular imports.
- Avoid import-time side effects.
- Use __main__ for executable examples.
- Keep public APIs small.
- Use clear package structure.
"""