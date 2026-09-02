"""
Package Import Demonstration
============================
"""

# ============================================================
# 1. IMPORT FROM SUBMODULE
# ============================================================

from packages.calculator.basic import add

print(
    add(10, 20)
)


# ============================================================
# 2. IMPORT MULTIPLE FUNCTIONS
# ============================================================

from packages.calculator.basic import (
    add,
    subtract,
    multiply,
    divide,
)

print(
    add(10, 5)
)

print(
    subtract(10, 5)
)

print(
    multiply(10, 5)
)

print(
    divide(10, 5)
)


# ============================================================
# 3. IMPORT ADVANCED MODULE
# ============================================================

from packages.calculator.advanced import (
    power,
    square_root,
    factorial,
)

print(
    power(2, 10)
)

print(
    square_root(64)
)

print(
    factorial(5)
)


# ============================================================
# 4. IMPORT FROM PACKAGE
# ============================================================

from packages.calculator import (
    add,
    power,
    square_root,
)

print(
    add(100, 200)
)

print(
    power(2, 5)
)

print(
    square_root(81)
)


# ============================================================
# 5. IMPORT USER PACKAGE
# ============================================================

from packages.users import (
    User,
    create_user,
)


user = create_user(
    user_id=1,
    name="Shiva",
    email="shiva@example.com",
)

print(user)


# ============================================================
# 6. ACCESS USER DATA
# ============================================================

print(
    user.name
)

print(
    user.email
)

print(
    user.id
)


# ============================================================
# 7. IMPORT SERVICE FUNCTION
# ============================================================

from packages.users import (
    get_user_name,
    get_user_email,
)

print(
    get_user_name(user)
)

print(
    get_user_email(user)
)