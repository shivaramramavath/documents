"""
Python __init__.py and __all__
==============================

This file explains:

    1. What is __init__.py?
    2. Why do we use __init__.py?
    3. Package initialization
    4. Package-level imports
    5. Public API
    6. What is __all__?
    7. __init__.py vs __all__
    8. Practical examples
"""


# ============================================================
# 1. WHAT IS __init__.py?
# ============================================================

"""
__init__.py is a special Python file used inside a package.

Example:

    my_package/
        __init__.py
        calculator.py
        users.py


Here:

    my_package

is the package.

    calculator.py
    users.py

are modules.
"""


# ============================================================
# 2. WHY IS IT CALLED __init__.py?
# ============================================================

"""
The name comes from:

    initialize

When a package is imported, Python can execute
the code inside __init__.py.

Example:

    import my_package

Python loads:

    my_package/__init__.py
"""


# ============================================================
# 3. __init__.py CAN BE EMPTY
# ============================================================

"""
An __init__.py file does not have to contain code.

It can simply be:

    # empty file


This is completely valid.

You can use it when you only need an explicit
package structure.
"""


# ============================================================
# 4. PACKAGE STRUCTURE
# ============================================================

"""
Example:

    calculator/
        __init__.py
        basic.py
        advanced.py


The package contains:

    basic.py
    advanced.py

and __init__.py defines package-level behavior.
"""


# ============================================================
# 5. PACKAGE INITIALIZATION
# ============================================================

"""
Suppose __init__.py contains:

    print("Calculator package loaded")


Then:

    import calculator

will execute that statement.

Output:

    Calculator package loaded
"""


# ============================================================
# 6. DON'T PUT HEAVY CODE HERE
# ============================================================

"""
Avoid putting expensive or dangerous operations
inside __init__.py.

Bad example:

    connect_to_database()
    start_server()
    load_large_model()


Why?

Because simply writing:

    import my_package

could execute those operations.

Keep __init__.py lightweight.
"""


# ============================================================
# 7. PACKAGE-LEVEL IMPORTS
# ============================================================

"""
Suppose:

    calculator/
        __init__.py
        basic.py


basic.py:

    def add(a, b):
        return a + b


Without anything in __init__.py:

    from calculator.basic import add


can be used.
"""


# ============================================================
# 8. EXPORTING THROUGH __init__.py
# ============================================================

"""
We can put this inside __init__.py:

    from .basic import add


Now users can write:

    from calculator import add


instead of:

    from calculator.basic import add
"""


# ============================================================
# 9. WHAT DOES THE DOT MEAN?
# ============================================================

"""
This:

    from .basic import add

means:

    import add from basic.py
    inside the current package.


The dot means:

    current package
"""


# ============================================================
# 10. MULTIPLE EXPORTS
# ============================================================

"""
Suppose:

    basic.py:

        def add(a, b):
            return a + b

        def subtract(a, b):
            return a - b


Then __init__.py can contain:

    from .basic import add, subtract


Now:

    from calculator import add, subtract

works.
"""


# ============================================================
# 11. PACKAGE PUBLIC API
# ============================================================

"""
A package can expose a clean public API.

Example:

    calculator/
        __init__.py
        basic.py
        advanced.py


__init__.py:

    from .basic import add
    from .advanced import power


Users can simply write:

    from calculator import add, power


They don't need to know the internal file structure.
"""


# ============================================================
# 12. WHAT IS __all__?
# ============================================================

"""
__all__ is a special variable.

It contains names that a module or package
intends to expose for:

    from module import *


Example:

    __all__ = [
        "add",
        "subtract",
    ]
"""


# ============================================================
# 13. __all__ EXAMPLE
# ============================================================

"""
Example:

    __init__.py:

        from .basic import add
        from .basic import subtract

        __all__ = [
            "add",
            "subtract",
        ]


Then:

    from calculator import *

imports the names listed in __all__.
"""


# ============================================================
# 14. __all__ DOES NOT CREATE THE FUNCTIONS
# ============================================================

"""
Important:

    __all__ = [
        "add",
    ]

does NOT create add().

The name must already exist in the module.

For example:

    from .basic import add

    __all__ = [
        "add",
    ]
"""


# ============================================================
# 15. __init__.py VS __all__
# ============================================================

"""
__init__.py
-----------

A real Python file.

It can:

    - initialize a package
    - import objects
    - expose package-level APIs
    - define variables
    - define functions
    - define classes


__all__
-------

A variable.

It specifies names intended for wildcard imports:

    from package import *
"""


# ============================================================
# 16. IMPORTANT DIFFERENCE
# ============================================================

"""
These are different:

    from calculator import add


and:

    from calculator import *


The first explicitly asks for:

    add


The second uses:

    __all__


when __all__ is defined.
"""


# ============================================================
# 17. EXPLICIT IMPORT IS PREFERRED
# ============================================================

"""
Prefer:

    from calculator import add, subtract


over:

    from calculator import *


Why?

Because explicit imports are:

    - easier to understand
    - easier to maintain
    - easier for IDEs
    - less likely to cause name conflicts
"""


# ============================================================
# 18. USING __all__ FOR PUBLIC API
# ============================================================

"""
Example:

    __init__.py

    from .basic import add
    from .basic import subtract
    from .advanced import power

    __all__ = [
        "add",
        "subtract",
        "power",
    ]


This communicates:

    These are the public features of the package.
"""


# ============================================================
# 19. INTERNAL FUNCTIONS
# ============================================================

"""
Suppose:

    basic.py:

        def add(a, b):
            return a + b

        def _validate_number(value):
            ...


The underscore means:

    _validate_number()

is intended to be internal.

It is a convention, not true access control.
"""


# ============================================================
# 20. PUBLIC VS INTERNAL API
# ============================================================

"""
Example:

    from .basic import add
    from .basic import _validate_number

    __all__ = [
        "add",
    ]


Here:

    add

is intended to be public.

    _validate_number

is intended to be internal.
"""


# ============================================================
# 21. REAL PACKAGE EXAMPLE
# ============================================================

"""
Directory:

    calculator/
        __init__.py
        basic.py
        advanced.py


basic.py:

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b


advanced.py:

    def power(a, b):
        return a ** b
"""


# ============================================================
# 22. CALCULATOR __init__.py
# ============================================================

"""
The calculator/__init__.py file could contain:

    from .basic import add, subtract
    from .advanced import power

    __all__ = [
        "add",
        "subtract",
        "power",
    ]


Then users can write:

    from calculator import add
    from calculator import power
"""


# ============================================================
# 23. PACKAGE API HIDES INTERNAL STRUCTURE
# ============================================================

"""
Internal structure:

    calculator/
        basic.py
        advanced.py


Public interface:

    calculator.add()
    calculator.subtract()
    calculator.power()


Users don't necessarily need to know
which file contains each function.
"""


# ============================================================
# 24. WHY THIS MATTERS IN LARGE PROJECTS
# ============================================================

"""
Imagine:

    app/
        services/
            user_service.py
            timetable_service.py
            auth_service.py


services/__init__.py could expose:

    from .user_service import UserService
    from .timetable_service import TimetableService
    from .auth_service import AuthService


Then:

    from app.services import UserService


instead of:

    from app.services.user_service import UserService
"""


# ============================================================
# 25. __all__ IN A BACKEND PACKAGE
# ============================================================

"""
Example:

    services/__init__.py

    from .user_service import UserService
    from .timetable_service import TimetableService

    __all__ = [
        "UserService",
        "TimetableService",
    ]


This creates a clear package API.
"""


# ============================================================
# 26. __init__.py CAN CONTAIN VARIABLES
# ============================================================

"""
Example:

    # package/__init__.py

    VERSION = "1.0.0"


Then:

    import package

    print(package.VERSION)
"""


# ============================================================
# 27. __init__.py CAN CONTAIN FUNCTIONS
# ============================================================

"""
Example:

    def package_info():
        return "Python Mastery"


Then:

    from package import package_info

    print(package_info())
"""


# ============================================================
# 28. __init__.py CAN CONTAIN CLASSES
# ============================================================

"""
Example:

    class Configuration:
        pass


Then:

    from package import Configuration
"""


# ============================================================
# 29. __init__.py CAN RE-EXPORT OBJECTS
# ============================================================

"""
This is one of its most useful purposes.

Example:

    from .models import User
    from .services import UserService


Users can then write:

    from app import User, UserService
"""


# ============================================================
# 30. __all__ IS OPTIONAL
# ============================================================

"""
You do NOT have to define __all__.

This is valid:

    from .basic import add


The package still works.

__all__ is useful when you want to explicitly
define the intended wildcard/public exports.
"""


# ============================================================
# 31. __init__.py IS DIFFERENT FROM __all__
# ============================================================

"""
Remember:

    __init__.py
        ↓
    A Python module/file


    __all__
        ↓
    A variable inside a module


They are not the same thing.
"""


# ============================================================
# 32. DUNDER NAMES
# ============================================================

"""
Names surrounded by double underscores are often
called "dunder" names.

Examples:

    __init__
    __name__
    __main__
    __doc__
    __all__
    __file__


Dunder means:

    double underscore
"""


# ============================================================
# 33. PACKAGE INITIALIZATION FLOW
# ============================================================

"""
When:

    import calculator


conceptually:

    Python
      |
      v
    Find calculator package
      |
      v
    Load calculator/__init__.py
      |
      v
    Execute package initialization
      |
      v
    Package becomes available
"""


# ============================================================
# 34. PACKAGE IMPORT FLOW WITH EXPORTS
# ============================================================

"""
Suppose:

    calculator/__init__.py:

        from .basic import add


Then:

    from calculator import add


conceptually becomes:

    calculator
        |
        v
    __init__.py
        |
        v
    basic.py
        |
        v
    add()
"""


# ============================================================
# 35. BEST PRACTICES
# ============================================================

"""
Use __init__.py to:

    - define package-level APIs
    - re-export important objects
    - keep package initialization lightweight
    - document package purpose


Use __all__ to:

    - communicate intended public exports
    - control wildcard import behavior


Avoid:

    - heavy initialization
    - database connections
    - starting servers
    - expensive model loading
    - unnecessary side effects
"""


# ============================================================
# 36. FINAL CHEAT SHEET
# ============================================================

"""
__init__.py
===========

Special Python file inside a package.

Can be:

    empty

or contain:

    imports
    functions
    classes
    variables
    package initialization


__all__
========

A variable containing intended exported names.

Example:

    __all__ = [
        "User",
        "UserService",
    ]


PACKAGE API
===========

__init__.py can expose:

    from .models import User
    from .service import UserService


Then:

    from package import User, UserService


RELATIVE IMPORT
===============

from .models import User

"." means current package.


IMPORTANT
=========

__init__.py and __all__ are different.

__init__.py:
    package module


__all__:
    variable controlling wildcard exports


PREFERRED IMPORT STYLE
======================

Prefer:

    from package import User


over:

    from package import *
"""