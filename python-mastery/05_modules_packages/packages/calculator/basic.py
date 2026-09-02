"""
Basic Calculator Module
=======================
"""


def add(a, b):
    """Add two numbers."""
    return a + b


def subtract(a, b):
    """Subtract b from a."""
    return a - b


def multiply(a, b):
    """Multiply two numbers."""
    return a * b


def divide(a, b):
    """Divide a by b."""

    if b == 0:
        raise ZeroDivisionError(
            "Cannot divide by zero."
        )

    return a / b


def _internal_helper():
    """
    Internal function.

    Leading underscore indicates that this
    is intended for internal use.
    """

    return "Internal helper"