"""
User Models
===========
"""

from dataclasses import dataclass


@dataclass
class User:
    """Represent a user."""

    id: int
    name: str
    email: str