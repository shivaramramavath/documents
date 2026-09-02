"""
Advanced Calculator Module
==========================
"""

import math


def power(base, exponent):
    """Return base raised to exponent."""

    return base ** exponent


def square_root(number):
    """Return square root of a number."""

    if number < 0:
        raise ValueError(
            "Cannot calculate square root of negative number."
        )

    return math.sqrt(number)


def factorial(number):
    """Return factorial of a number."""

    if number < 0:
        raise ValueError(
            "Factorial requires a non-negative integer."
        )

    return math.factorial(number)