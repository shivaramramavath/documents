"""
User Service
============
"""

from .models import User


def create_user(
    user_id: int,
    name: str,
    email: str,
) -> User:

    return User(
        id=user_id,
        name=name,
        email=email,
    )


def get_user_name(user: User) -> str:

    return user.name


def get_user_email(user: User) -> str:

    return user.email