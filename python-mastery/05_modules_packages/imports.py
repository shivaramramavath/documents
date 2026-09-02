"""
Python Imports
==============

This file explains how Python imports modules,
functions, classes, variables, and packages.

Topics:

    1. import module
    2. from module import
    3. aliases
    4. multiple imports
    5. standard library imports
    6. local imports
    7. absolute imports
    8. relative imports
    9. import *
    10. __name__
    11. __main__
    12. sys.path
    13. sys.modules
    14. import execution
    15. circular imports
    16. import best practices
"""


# ============================================================
# 1. BASIC IMPORT
# ============================================================

import math

print(math.sqrt(25))


"""
Syntax:

    import module

Access members using:

    module.member
"""


# ============================================================
# 2. IMPORT MULTIPLE MODULES
# ============================================================

import math
import random
import json

print(math.pi)
print(random.randint(1, 10))

data = {
    "name": "Shiva",
}

print(json.dumps(data))


# ============================================================
# 3. FROM IMPORT
# ============================================================

from math import sqrt

print(sqrt(36))


"""
Instead of:

    math.sqrt(36)

we can write:

    sqrt(36)
"""


# ============================================================
# 4. IMPORT MULTIPLE MEMBERS
# ============================================================

from math import sqrt, pi

print(sqrt(49))
print(pi)


# ============================================================
# 5. IMPORT EVERYTHING
# ============================================================

"""
You may see:

    from math import *

This imports many names into the current namespace.

Avoid this in production code.

Why?

    - unclear where names came from
    - possible naming conflicts
    - difficult to maintain
"""


# ============================================================
# 6. MODULE ALIAS
# ============================================================

import math as m

print(m.sqrt(64))


"""
Syntax:

    import module as alias
"""


# ============================================================
# 7. FUNCTION ALIAS
# ============================================================

from math import sqrt as square_root

print(
    square_root(81)
)


# ============================================================
# 8. STANDARD LIBRARY IMPORTS
# ============================================================

import os
import sys
import pathlib
import datetime

print(os.getcwd())

print(sys.version)

print(pathlib.Path.cwd())

print(datetime.datetime.now())


# ============================================================
# 9. IMPORT YOUR OWN MODULE
# ============================================================

"""
Suppose the directory contains:

    imports.py
    calculator.py

calculator.py:

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b


Then:

    import calculator

    calculator.add(10, 20)
"""


# ============================================================
# 10. LOCAL MODULE IMPORT
# ============================================================

"""
If calculator.py exists in the same directory:

    import calculator


Then:

    result = calculator.add(
        10,
        20,
    )

    print(result)
"""


# ============================================================
# 11. FROM LOCAL MODULE
# ============================================================

"""
You can also write:

    from calculator import add

Then:

    print(
        add(10, 20)
    )
"""


# ============================================================
# 12. LOCAL MODULE ALIAS
# ============================================================

"""
Example:

    import calculator as calc

Then:

    calc.add(10, 20)
"""


# ============================================================
# 13. MULTIPLE FROM IMPORTS
# ============================================================

"""
Example:

    from calculator import (
        add,
        subtract,
        multiply,
    )


This is useful when importing several
specific members.
"""


# ============================================================
# 14. IMPORT CLASS
# ============================================================

"""
Suppose:

    user.py

contains:

    class User:
        ...


Then:

    from user import User

    user = User()
"""


# ============================================================
# 15. IMPORT VARIABLE
# ============================================================

"""
Suppose:

    config.py

contains:

    API_VERSION = "v1"

Then:

    from config import API_VERSION

    print(API_VERSION)
"""


# ============================================================
# 16. IMPORT FUNCTION
# ============================================================

"""
Suppose:

    utils.py

contains:

    def format_name(name):
        return name.title()


Then:

    from utils import format_name

    print(
        format_name("shiva ram")
    )
"""


# ============================================================
# 17. MODULE NAMESPACE
# ============================================================

import math

print(
    math.sqrt(100)
)

print(
    math.pi
)


"""
math is a namespace.

It prevents names from different modules
from colliding easily.
"""


# ============================================================
# 18. NAME COLLISION
# ============================================================

"""
Imagine:

module_a.py:

    value = 100


module_b.py:

    value = 200


Avoid:

    from module_a import value
    from module_b import value


The second value replaces the first one.
"""


# ============================================================
# 19. SOLVE COLLISION WITH ALIASES
# ============================================================

"""
Better:

    from module_a import value as a_value
    from module_b import value as b_value

Then:

    print(a_value)
    print(b_value)
"""


# ============================================================
# 20. SOLVE COLLISION WITH MODULE NAMES
# ============================================================

"""
Another solution:

    import module_a
    import module_b

Then:

    module_a.value
    module_b.value
"""


# ============================================================
# 21. IMPORT EXECUTION
# ============================================================

"""
Important:

When Python imports a module,
Python executes the module's top-level code.

Example:

    calculator.py

    print("Calculator loaded")

Then:

    import calculator

will print:

    Calculator loaded
"""


# ============================================================
# 22. WHY IMPORT SIDE EFFECTS ARE BAD
# ============================================================

"""
Avoid:

    connect_to_database()

    start_server()

    delete_files()

directly at module level.

Because:

    import module

would execute those operations.
"""


# ============================================================
# 23. MAIN GUARD
# ============================================================

if __name__ == "__main__":

    print(
        "Running imports.py directly"
    )


"""
This code executes only when:

    python imports.py

It does NOT execute when another
module imports imports.py.
"""


# ============================================================
# 24. __name__
# ============================================================

print(
    "__name__ =",
    __name__,
)


"""
If directly executed:

    __name__ == "__main__"


If imported:

    __name__ == module_name
"""


# ============================================================
# 25. MAIN FUNCTION PATTERN
# ============================================================

def main():

    print(
        "Application started"
    )


if __name__ == "__main__":

    main()


"""
This is a common Python application pattern.
"""


# ============================================================
# 26. sys.path
# ============================================================

import sys

for path in sys.path:

    print(path)


"""
sys.path contains locations Python searches
when resolving imports.
"""


# ============================================================
# 27. CURRENT DIRECTORY AND IMPORTS
# ============================================================

"""
Suppose:

    project/
        main.py
        calculator.py


Running:

    python main.py

usually allows:

    import calculator


because the project directory is available
to Python's import search path.
"""


# ============================================================
# 28. PYTHONPATH
# ============================================================

"""
PYTHONPATH is an environment variable that can
add directories to Python's module search path.

Conceptually:

    PYTHONPATH
        ↓
    sys.path
        ↓
    import resolution
"""


# ============================================================
# 29. sys.modules
# ============================================================

import sys

print(
    "math" in sys.modules
)


"""
sys.modules stores modules that have already
been imported in the current Python process.
"""


# ============================================================
# 30. IMPORT CACHING
# ============================================================

import math
import math
import math


"""
Python normally reuses the already-loaded module
from sys.modules.
"""


# ============================================================
# 31. IMPORTLIB
# ============================================================

import importlib

math_module = importlib.import_module(
    "math"
)

print(
    math_module.sqrt(144)
)


"""
importlib.import_module()
allows dynamic importing.
"""


# ============================================================
# 32. DYNAMIC IMPORT
# ============================================================

module_name = "math"

module = importlib.import_module(
    module_name
)

print(
    module.pi
)


"""
This becomes useful in:

    - plugin systems
    - configuration-driven applications
    - frameworks
    - dynamic loaders
"""


# ============================================================
# 33. RELATIVE IMPORT
# ============================================================

"""
Suppose:

    app/
        __init__.py
        main.py

        services/
            __init__.py
            user.py
            auth.py


Inside services/auth.py:

    from .user import UserService


The dot means:

    current package
"""


# ============================================================
# 34. TWO DOTS
# ============================================================

"""
Example:

    from ..database import connection

Meaning:

    go to parent package
    then import database
"""


# ============================================================
# 35. ABSOLUTE IMPORT
# ============================================================

"""
Example:

    from app.services.user import UserService


This starts from the package root.
"""


# ============================================================
# 36. ABSOLUTE VS RELATIVE
# ============================================================

"""
Absolute:

    from app.services.user import UserService


Relative:

    from .user import UserService


Absolute imports are often easier to understand
in large projects.
"""


# ============================================================
# 37. PACKAGE IMPORT
# ============================================================

"""
Example:

    app/
        __init__.py
        users/
            __init__.py
            service.py


You can import:

    from app.users.service import UserService
"""


# ============================================================
# 38. __init__.py
# ============================================================

"""
__init__.py traditionally marks a directory as
a Python package.

Example:

    users/
        __init__.py
        service.py
        repository.py
"""


# ============================================================
# 39. PACKAGE API
# ============================================================

"""
You can expose selected objects through __init__.py.

users/__init__.py:

    from .service import UserService


Then:

    from users import UserService
"""


# ============================================================
# 40. EMPTY __init__.py
# ============================================================

"""
An __init__.py file can be completely empty.

Example:

    users/
        __init__.py
        service.py

It can simply participate in package structure.
"""


# ============================================================
# 41. __all__
# ============================================================

"""
A module can define:

    __all__ = [
        "add",
        "subtract",
    ]

This controls names used by:

    from module import *
"""


# ============================================================
# 42. SINGLE UNDERSCORE
# ============================================================

"""
Names beginning with "_" are conventionally
treated as internal.

Example:

    def _validate():
        ...


This does NOT provide true access restriction.
"""


# ============================================================
# 43. DOUBLE UNDERSCORE MODULE NAMES
# ============================================================

"""
Python has special names such as:

    __name__
    __doc__
    __package__
    __file__
    __spec__
    __loader__
"""


# ============================================================
# 44. __file__
# ============================================================

print(
    __file__
)


"""
__file__ represents the path of the current
Python module when available.
"""


# ============================================================
# 45. __package__
# ============================================================

print(
    __package__
)


"""
__package__ contains package information used
for resolving relative imports.
"""


# ============================================================
# 46. __doc__
# ============================================================

print(
    __doc__[:100]
)


"""
__doc__ contains the module's docstring.
"""


# ============================================================
# 47. CIRCULAR IMPORT
# ============================================================

"""
Bad architecture:

    user.py
        ↓
    order.py
        ↓
    user.py


Example:

user.py:

    from order import Order


order.py:

    from user import User


This creates a circular dependency.
"""


# ============================================================
# 48. AVOID CIRCULAR IMPORTS
# ============================================================

"""
Instead of:

    user → order
    order → user


Try:

    user → common
    order → common


or restructure the architecture.
"""


# ============================================================
# 49. TYPE CHECKING IMPORTS
# ============================================================

"""
Sometimes imports are needed only for type hints.

Example:

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from user import User


This can help avoid some runtime circular imports.
"""


# ============================================================
# 50. LAZY IMPORT
# ============================================================

"""
Instead of:

    import expensive_module


at module level, sometimes an application can do:

    def function():
        import expensive_module

        ...


This delays importing until the function runs.

Use this intentionally, not everywhere.
"""


# ============================================================
# 51. CONDITIONAL IMPORT
# ============================================================

"""
Sometimes libraries support optional dependencies.

Conceptually:

    try:
        import optional_library
    except ImportError:
        optional_library = None
"""


# ============================================================
# 52. IMPORT ERROR
# ============================================================

try:

    from math import something_that_does_not_exist

except ImportError as error:

    print(
        "Import error:",
        error,
    )


# ============================================================
# 53. MODULE NOT FOUND
# ============================================================

"""
Example:

    import package_that_does_not_exist


would produce:

    ModuleNotFoundError


Common causes:

    - package not installed
    - incorrect import path
    - wrong virtual environment
    - wrong working directory
    - spelling mistake
"""


# ============================================================
# 54. pip INSTALLATION
# ============================================================

"""
For third-party packages:

    pip install requests

Then:

    import requests


pip installs packages into the Python
environment you're using.
"""


# ============================================================
# 55. VIRTUAL ENVIRONMENT
# ============================================================

"""
A project normally uses a virtual environment:

Windows:

    python -m venv .venv


Activate:

    .venv\\Scripts\\activate


Then:

    pip install requests
"""


# ============================================================
# 56. THIRD-PARTY IMPORT
# ============================================================

"""
Example after installing requests:

    import requests


Third-party packages are different from
Python standard-library modules.
"""


# ============================================================
# 57. IMPORT ORDER
# ============================================================

"""
Recommended order:

1. Standard library

2. Third-party libraries

3. Local application modules


Example:

    import json
    import os

    import requests

    from app.services.user import UserService
"""


# ============================================================
# 58. DON'T IMPORT INSIDE EVERYTHING
# ============================================================

"""
Avoid unnecessarily doing:

    def function():
        import math

        ...


when:

    import math

at module level is perfectly appropriate.

Use local imports for a reason.
"""


# ============================================================
# 59. EXPLICIT IS BETTER
# ============================================================

"""
Prefer:

    import math

    math.sqrt(25)


over:

    from math import *

because the source of sqrt() is obvious.
"""


# ============================================================
# 60. IMPORT DESIGN
# ============================================================

"""
Good:

    from app.services.user import UserService


Less clear:

    from app.services.user import *


Explicit imports make dependencies visible.
"""


# ============================================================
# 61. REAL BACKEND STRUCTURE
# ============================================================

"""
A FastAPI project might eventually look like:

    app/
        __init__.py

        main.py

        api/
            __init__.py
            routes.py

        models/
            __init__.py
            user.py

        schemas/
            __init__.py
            user.py

        services/
            __init__.py
            user_service.py

        repositories/
            __init__.py
            user_repository.py
"""


# ============================================================
# 62. IMPORTS IN BACKEND
# ============================================================

"""
main.py:

    from app.api.routes import router


routes.py:

    from app.services.user_service import (
        UserService
    )


user_service.py:

    from app.repositories.user_repository import (
        UserRepository
    )


This creates a dependency flow.
"""


# ============================================================
# 63. DEPENDENCY DIRECTION
# ============================================================

"""
A clean architecture might follow:

    API
     ↓
    Service
     ↓
    Repository
     ↓
    Database


Avoid dependencies going randomly
in every direction.
"""


# ============================================================
# 64. IMPORT GRAPH
# ============================================================

"""
Think of imports as a graph:

    main
      ↓
    routes
      ↓
    service
      ↓
    repository
      ↓
    database


If you create:

    repository
       ↓
    service

while service already depends on repository,
you may create problematic dependency cycles.
"""


# ============================================================
# 65. DEBUGGING IMPORTS
# ============================================================

"""
When an import fails, inspect:

    1. Current working directory
    2. sys.path
    3. Package structure
    4. Virtual environment
    5. Module filename
    6. __init__.py
    7. Circular dependencies
"""


# ============================================================
# 66. DEBUG sys.path
# ============================================================

import sys

print(
    "Python import paths:"
)

for path in sys.path:

    print(
        "  ",
        path,
    )


# ============================================================
# 67. DEBUG MODULE
# ============================================================

import json

print(
    json.__name__
)

print(
    json.__file__
)

print(
    json.__package__
)


# ============================================================
# 68. MODULE INSPECTION
# ============================================================

print(
    dir(json)[:20]
)


"""
dir() lets you inspect names available
inside the module.
"""


# ============================================================
# 69. getattr()
# ============================================================

function_name = "dumps"

dumps_function = getattr(
    json,
    function_name,
)

print(
    dumps_function(
        {"name": "Shiva"}
    )
)


"""
Useful for dynamic programming.
"""


# ============================================================
# 70. IMPORT AS AN OBJECT
# ============================================================

module = importlib.import_module(
    "json"
)

print(
    module.dumps(
        {"language": "Python"}
    )
)


# ============================================================
# 71. RELOAD
# ============================================================

"""
You can reload a module:

    import importlib

    import calculator

    importlib.reload(calculator)


This is mostly useful in special development
or dynamic systems.

Don't use reload() as normal application logic.
"""


# ============================================================
# 72. IMPORT CYCLE VISUALIZATION
# ============================================================

"""
BAD:

    A
   ↙ ↘
  B   C
   ↘ ↙
    A


GOOD:

    A ───→ C
          ↑
          │
          B


The exact solution depends on the architecture.
"""


# ============================================================
# 73. IMPORT BEST PRACTICES
# ============================================================

"""
1. Prefer explicit imports.

2. Avoid import *.

3. Keep modules focused.

4. Avoid circular imports.

5. Avoid unnecessary import-time side effects.

6. Use absolute imports in large applications
   when they improve clarity.

7. Use relative imports inside packages when
   appropriate.

8. Keep dependency direction intentional.

9. Use virtual environments.

10. Keep third-party dependencies documented.
"""


# ============================================================
# 74. FINAL CHEAT SHEET
# ============================================================

"""
IMPORT MODULE
=============

import math

math.sqrt(25)


IMPORT FUNCTION
===============

from math import sqrt

sqrt(25)


IMPORT CLASS
============

from user import User

user = User()


ALIAS
=====

import numpy as np


FUNCTION ALIAS
==============

from math import sqrt as square_root


ABSOLUTE IMPORT
===============

from app.services.user import UserService


RELATIVE IMPORT
===============

from .user import UserService


PARENT PACKAGE
==============

from ..database import Database


MAIN GUARD
==========

if __name__ == "__main__":
    main()


MODULE NAME
===========

__name__


MODULE FILE
===========

__file__


PACKAGE
=======

__package__


MODULE CACHE
============

sys.modules


IMPORT PATH
===========

sys.path


DYNAMIC IMPORT
==============

importlib.import_module()


AVOID
=====

from module import *


AVOID
=====

circular imports


REMEMBER
========

import module

means:

    module
       ↓
    namespace
       ↓
    module.member
"""