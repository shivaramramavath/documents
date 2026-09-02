"""
Python Strings
==============

A string is a sequence of characters.

Examples:

    "Python"
    'Python'
    "Hello World"
    "12345"

Strings are:

    - ordered
    - indexed
    - iterable
    - immutable
    - support slicing
    - support many built-in methods
"""


# ============================================================
# 1. CREATING STRINGS
# ============================================================

name = "Shiva"

language = 'Python'

message = "Hello, Python!"

print(name)
print(language)
print(message)


# ============================================================
# 2. EMPTY STRING
# ============================================================

empty = ""

print(empty)
print(len(empty))


# ============================================================
# 3. STRING TYPE
# ============================================================

text = "Python"

print(type(text))


# ============================================================
# 4. STRING LENGTH
# ============================================================

text = "Python"

print(len(text))


# ============================================================
# 5. INDEXING
# ============================================================

text = "Python"

print(text[0])
print(text[1])
print(text[2])


"""
Python

 P y t h o n
 0 1 2 3 4 5
"""


# ============================================================
# 6. NEGATIVE INDEXING
# ============================================================

text = "Python"

print(text[-1])
print(text[-2])
print(text[-3])


"""
-1 = last character
-2 = second-last character
"""


# ============================================================
# 7. STRING SLICING
# ============================================================

text = "Python"

print(text[0:3])


# Start included
# Stop excluded


# ============================================================
# 8. SLICING FROM BEGINNING
# ============================================================

text = "Python"

print(text[:3])


# ============================================================
# 9. SLICING TO END
# ============================================================

text = "Python"

print(text[3:])


# ============================================================
# 10. FULL COPY
# ============================================================

text = "Python"

print(text[:])


# ============================================================
# 11. STEP
# ============================================================

text = "Python"

print(text[::2])


# ============================================================
# 12. REVERSE STRING
# ============================================================

text = "Python"

print(text[::-1])


# ============================================================
# 13. STRINGS ARE IMMUTABLE
# ============================================================

text = "Python"

# This is NOT allowed:

# text[0] = "J"


"""
Strings cannot be modified in-place.

Instead, create a new string.
"""


# ============================================================
# 14. CREATE A NEW STRING
# ============================================================

text = "Python"

text = "J" + text[1:]

print(text)


# ============================================================
# 15. STRING CONCATENATION
# ============================================================

first_name = "Shiva"
last_name = "Ram"

full_name = first_name + " " + last_name

print(full_name)


# ============================================================
# 16. STRING REPETITION
# ============================================================

text = "Hi "

print(text * 3)


# ============================================================
# 17. MEMBERSHIP
# ============================================================

text = "Python Programming"

print("Python" in text)
print("Java" in text)

print("Java" not in text)


# ============================================================
# 18. ITERATING OVER STRING
# ============================================================

text = "Python"

for character in text:
    print(character)


# ============================================================
# 19. enumerate()
# ============================================================

text = "Python"

for index, character in enumerate(text):
    print(index, character)


# ============================================================
# 20. STRING COMPARISON
# ============================================================

print("apple" == "apple")
print("apple" == "Apple")

print("apple" != "orange")


# ============================================================
# 21. LEXICOGRAPHICAL COMPARISON
# ============================================================

print("apple" < "banana")
print("zebra" > "apple")


# ============================================================
# 22. LOWERCASE
# ============================================================

text = "PYTHON"

print(text.lower())


# ============================================================
# 23. UPPERCASE
# ============================================================

text = "python"

print(text.upper())


# ============================================================
# 24. casefold()
# ============================================================

text = "PYTHON"

print(text.casefold())


"""
casefold() is designed for more aggressive,
Unicode-aware case-insensitive comparisons.
"""


# ============================================================
# 25. capitalize()
# ============================================================

text = "python programming"

print(text.capitalize())


# Result:
#
# Python programming


# ============================================================
# 26. title()
# ============================================================

text = "python programming language"

print(text.title())


# ============================================================
# 27. swapcase()
# ============================================================

text = "Python PROGRAMMING"

print(text.swapcase())


# ============================================================
# 28. strip()
# ============================================================

text = "   Python   "

print(text.strip())


# Removes whitespace from both sides.


# ============================================================
# 29. lstrip()
# ============================================================

text = "   Python"

print(text.lstrip())


# ============================================================
# 30. rstrip()
# ============================================================

text = "Python   "

print(text.rstrip())


# ============================================================
# 31. strip() WITH CHARACTERS
# ============================================================

text = "###Python###"

print(text.strip("#"))


"""
strip() removes characters from the edges.

It does NOT mean "remove this exact substring".
"""


# ============================================================
# 32. removeprefix()
# ============================================================

text = "Python Programming"

print(text.removeprefix("Python "))


# ============================================================
# 33. removesuffix()
# ============================================================

filename = "report.pdf"

print(filename.removesuffix(".pdf"))


# ============================================================
# 34. startswith()
# ============================================================

text = "Python Programming"

print(text.startswith("Python"))
print(text.startswith("Java"))


# ============================================================
# 35. endswith()
# ============================================================

filename = "report.pdf"

print(filename.endswith(".pdf"))
print(filename.endswith(".txt"))


# ============================================================
# 36. find()
# ============================================================

text = "Python Programming"

print(text.find("Python"))
print(text.find("Programming"))
print(text.find("Java"))


"""
find() returns:

    index if found
    -1 if not found
"""


# ============================================================
# 37. rfind()
# ============================================================

text = "one two one"

print(text.rfind("one"))


# Finds from the right.


# ============================================================
# 38. index()
# ============================================================

text = "Python"

print(text.index("t"))


"""
index() is similar to find(),
but raises ValueError when not found.
"""


# ============================================================
# 39. count()
# ============================================================

text = "banana"

print(text.count("a"))
print(text.count("na"))


# ============================================================
# 40. replace()
# ============================================================

text = "I like Java"

result = text.replace("Java", "Python")

print(result)


# Original string is unchanged.


# ============================================================
# 41. replace() MULTIPLE TIMES
# ============================================================

text = "Python Python Python"

result = text.replace("Python", "Java")

print(result)


# ============================================================
# 42. replace() WITH COUNT
# ============================================================

text = "Python Python Python"

result = text.replace("Python", "Java", 1)

print(result)


# Only first occurrence is replaced.


# ============================================================
# 43. split()
# ============================================================

text = "Python is easy"

words = text.split()

print(words)


# Result:
#
# ["Python", "is", "easy"]


# ============================================================
# 44. split() WITH DELIMITER
# ============================================================

text = "apple,banana,orange"

fruits = text.split(",")

print(fruits)


# ============================================================
# 45. splitlines()
# ============================================================

text = """Python
Java
JavaScript
Go"""

lines = text.splitlines()

print(lines)


# ============================================================
# 46. rsplit()
# ============================================================

text = "one-two-three"

print(text.rsplit("-", 1))


# Split from the right.


# ============================================================
# 47. partition()
# ============================================================

text = "name=Shiva"

result = text.partition("=")

print(result)


"""
Result:

("name", "=", "Shiva")
"""


# ============================================================
# 48. rpartition()
# ============================================================

text = "path/to/file.txt"

result = text.rpartition("/")

print(result)


# ============================================================
# 49. join()
# ============================================================

words = ["Python", "is", "awesome"]

sentence = " ".join(words)

print(sentence)


# ============================================================
# 50. join() WITH COMMA
# ============================================================

names = ["Shiva", "Ram", "Raj"]

result = ", ".join(names)

print(result)


# ============================================================
# 51. join() WITH NEWLINE
# ============================================================

items = [
    "Python",
    "Java",
    "Go",
]

result = "\n".join(items)

print(result)


# ============================================================
# 52. isalpha()
# ============================================================

print("Python".isalpha())
print("Python123".isalpha())


# True only if all characters are alphabetic.


# ============================================================
# 53. isdigit()
# ============================================================

print("12345".isdigit())
print("123abc".isdigit())


# ============================================================
# 54. isdecimal()
# ============================================================

print("123".isdecimal())


# ============================================================
# 55. isnumeric()
# ============================================================

print("123".isnumeric())


"""
There are subtle Unicode differences between:

    isdigit()
    isdecimal()
    isnumeric()

For normal ASCII numbers, they usually behave similarly.
"""


# ============================================================
# 56. isalnum()
# ============================================================

print("Python123".isalnum())
print("Python 123".isalnum())


# Letters + numbers only.


# ============================================================
# 57. isspace()
# ============================================================

print("   ".isspace())
print("Python".isspace())


# ============================================================
# 58. islower()
# ============================================================

print("python".islower())
print("Python".islower())


# ============================================================
# 59. isupper()
# ============================================================

print("PYTHON".isupper())
print("Python".isupper())


# ============================================================
# 60. istitle()
# ============================================================

print("Python Programming".istitle())
print("python programming".istitle())


# ============================================================
# 61. isidentifier()
# ============================================================

print("user_name".isidentifier())
print("123user".isidentifier())


"""
Useful when checking whether a string can be used
as a Python identifier.
"""


# ============================================================
# 62. isprintable()
# ============================================================

print("Hello".isprintable())
print("Hello\nWorld".isprintable())


# ============================================================
# 63. ASCII CHECK
# ============================================================

print("Python".isascii())
print("こんにちは".isascii())


# ============================================================
# 64. ENCODING
# ============================================================

text = "Python"

encoded = text.encode("utf-8")

print(encoded)
print(type(encoded))


# ============================================================
# 65. DECODING
# ============================================================

encoded = b"Python"

decoded = encoded.decode("utf-8")

print(decoded)


# ============================================================
# 66. F-STRINGS
# ============================================================

name = "Shiva"
age = 21

message = f"My name is {name} and I am {age} years old."

print(message)


# ============================================================
# 67. F-STRING EXPRESSIONS
# ============================================================

a = 10
b = 20

print(f"Sum = {a + b}")


# ============================================================
# 68. F-STRING METHOD CALL
# ============================================================

name = "shiva"

print(f"Name: {name.upper()}")


# ============================================================
# 69. F-STRING FORMAT SPECIFIERS
# ============================================================

price = 12345.6789

print(f"{price:.2f}")


# ============================================================
# 70. NUMBER WITH COMMAS
# ============================================================

number = 1000000

print(f"{number:,}")


# ============================================================
# 71. PERCENTAGE
# ============================================================

percentage = 0.8567

print(f"{percentage:.2%}")


# ============================================================
# 72. WIDTH / ALIGNMENT
# ============================================================

name = "Shiva"

print(f"{name:>10}")
print(f"{name:<10}")
print(f"{name:^10}")


# ============================================================
# 73. FORMAT()
# ============================================================

name = "Shiva"
age = 21

message = "My name is {} and I am {} years old.".format(
    name,
    age,
)

print(message)


# f-strings are generally preferred for modern Python.


# ============================================================
# 74. RAW STRINGS
# ============================================================

path = r"C:\Users\Shiva\Documents"

print(path)


"""
Raw strings are useful for:

    Windows paths
    regular expressions
"""


# ============================================================
# 75. ESCAPE CHARACTERS
# ============================================================

print("Hello\nWorld")

print("Hello\tWorld")

print("He said \"Python is easy\"")


"""
\n = newline
\t = tab
\\ = backslash
\" = double quote
\' = single quote
"""


# ============================================================
# 76. MULTILINE STRING
# ============================================================

message = """
This is
a multiline
string.
"""

print(message)


# ============================================================
# 77. STRING CONCATENATION — IMPLICIT
# ============================================================

message = (
    "Python "
    "is "
    "powerful."
)

print(message)


# ============================================================
# 78. STRING METHODS — SUMMARY
# ============================================================

"""
CASE
----

lower()
upper()
casefold()
capitalize()
title()
swapcase()


WHITESPACE
----------

strip()
lstrip()
rstrip()


PREFIX / SUFFIX
---------------

startswith()
endswith()
removeprefix()
removesuffix()


SEARCH
------

find()
rfind()
index()
rindex()
count()


REPLACE
-------

replace()


SPLIT
-----

split()
rsplit()
splitlines()
partition()
rpartition()


JOIN
----

join()


CHECKING
--------

isalpha()
isdigit()
isdecimal()
isnumeric()
isalnum()
isspace()
islower()
isupper()
istitle()
isidentifier()
isprintable()
isascii()


ENCODING
--------

encode()
decode()


FORMATTING
----------

f"..."
format()
"""


# ============================================================
# 79. PRACTICAL — CLEAN USER INPUT
# ============================================================

username = "   ShivaRam   "

username = username.strip().lower()

print(username)


# ============================================================
# 80. PRACTICAL — EMAIL NORMALIZATION
# ============================================================

email = "  Shiva@Example.COM  "

email = email.strip().casefold()

print(email)


# ============================================================
# 81. PRACTICAL — CHECK EMAIL
# ============================================================

email = "shiva@example.com"

if "@" in email:
    print("Email contains @")
else:
    print("Invalid email")


# This is NOT complete email validation.


# ============================================================
# 82. PRACTICAL — EXTRACT DOMAIN
# ============================================================

email = "shiva@gmail.com"

username, domain = email.split("@")

print("Username:", username)
print("Domain:", domain)


# ============================================================
# 83. PRACTICAL — FILE EXTENSION
# ============================================================

filename = "report.pdf"

if filename.endswith(".pdf"):
    print("PDF file")


# ============================================================
# 84. PRACTICAL — REMOVE FILE EXTENSION
# ============================================================

filename = "report.pdf"

name = filename.removesuffix(".pdf")

print(name)


# ============================================================
# 85. PRACTICAL — COUNT WORDS
# ============================================================

text = "Python is easy and Python is powerful"

words = text.split()

print("Word count:", len(words))


# ============================================================
# 86. PRACTICAL — COUNT CHARACTERS
# ============================================================

text = "Python"

print("Characters:", len(text))


# ============================================================
# 87. PRACTICAL — COUNT A CHARACTER
# ============================================================

text = "banana"

print("a:", text.count("a"))


# ============================================================
# 88. PRACTICAL — REVERSE
# ============================================================

text = "Python"

reversed_text = text[::-1]

print(reversed_text)


# ============================================================
# 89. PRACTICAL — PALINDROME
# ============================================================

text = "madam"

if text == text[::-1]:
    print("Palindrome")
else:
    print("Not palindrome")


# ============================================================
# 90. PALINDROME IGNORING CASE
# ============================================================

text = "Madam"

normalized = text.casefold()

if normalized == normalized[::-1]:
    print("Palindrome")
else:
    print("Not palindrome")


# ============================================================
# 91. PALINDROME IGNORING SPACES
# ============================================================

text = "nurses run"

normalized = text.replace(" ", "").casefold()

if normalized == normalized[::-1]:
    print("Palindrome")
else:
    print("Not palindrome")


# ============================================================
# 92. REMOVE ALL SPACES
# ============================================================

text = "Python is very powerful"

result = text.replace(" ", "")

print(result)


# ============================================================
# 93. NORMALIZE MULTIPLE SPACES
# ============================================================

text = "Python    is     very    powerful"

words = text.split()

normalized = " ".join(words)

print(normalized)


"""
This is a very useful technique:

split()
    removes arbitrary whitespace

join()
    puts it back as a single space
"""


# ============================================================
# 94. CAPITALIZE EACH WORD
# ============================================================

text = "python programming language"

result = text.title()

print(result)


# ============================================================
# 95. EXTRACT WORDS
# ============================================================

text = "Python is powerful"

words = text.split()

for word in words:
    print(word)


# ============================================================
# 96. WORD LENGTHS
# ============================================================

text = "Python is powerful"

words = text.split()

lengths = [
    len(word)
    for word in words
]

print(lengths)


# ============================================================
# 97. LONG WORDS
# ============================================================

text = "Python programming is powerful"

words = text.split()

long_words = [
    word
    for word in words
    if len(word) > 5
]

print(long_words)


# ============================================================
# 98. REMOVE PUNCTUATION
# ============================================================

import string

text = "Hello, Python!"

cleaned = text.translate(
    str.maketrans("", "", string.punctuation)
)

print(cleaned)


# ============================================================
# 99. translate()
# ============================================================

text = "hello world"

table = str.maketrans(
    {
        "h": "H",
        "w": "W",
    }
)

result = text.translate(table)

print(result)


# ============================================================
# 100. TRANSLATE — REMOVE CHARACTERS
# ============================================================

text = "hello123world456"

table = str.maketrans(
    "",
    "",
    "0123456789",
)

result = text.translate(table)

print(result)


# ============================================================
# 101. STRING FORMATTING — TABLE
# ============================================================

name = "Shiva"
age = 21
branch = "CSE"

print(
    f"{'Name':<10} {'Age':<5} {'Branch':<10}"
)

print(
    f"{name:<10} {age:<5} {branch:<10}"
)


# ============================================================
# 102. SEARCH MULTIPLE WORDS
# ============================================================

text = "Python is powerful"

keywords = [
    "Python",
    "Java",
    "C++",
]

for keyword in keywords:

    if keyword in text:
        print("Found:", keyword)


# ============================================================
# 103. CASE-INSENSITIVE SEARCH
# ============================================================

text = "Python Programming"

keyword = "python"

if keyword.casefold() in text.casefold():
    print("Found")


# ============================================================
# 104. START / END VALIDATION
# ============================================================

url = "https://example.com"

if url.startswith("https://"):
    print("Secure URL")

if url.endswith(".com"):
    print("COM domain")


# ============================================================
# 105. SIMPLE PASSWORD CHECK
# ============================================================

password = "Python123"

has_upper = any(
    character.isupper()
    for character in password
)

has_lower = any(
    character.islower()
    for character in password
)

has_digit = any(
    character.isdigit()
    for character in password
)

print("Upper:", has_upper)
print("Lower:", has_lower)
print("Digit:", has_digit)


# ============================================================
# 106. PASSWORD VALIDATION
# ============================================================

password = "Python123"

valid = (
    len(password) >= 8
    and any(c.isupper() for c in password)
    and any(c.islower() for c in password)
    and any(c.isdigit() for c in password)
)

print("Valid:", valid)


# ============================================================
# 107. CHARACTER FREQUENCY
# ============================================================

text = "banana"

frequency = {}

for character in text:

    frequency[character] = (
        frequency.get(character, 0) + 1
    )

print(frequency)


# ============================================================
# 108. WORD FREQUENCY
# ============================================================

text = "python is easy python is powerful"

words = text.split()

frequency = {}

for word in words:

    frequency[word] = (
        frequency.get(word, 0) + 1
    )

print(frequency)


# ============================================================
# 109. STRING → LIST
# ============================================================

text = "Python"

characters = list(text)

print(characters)


# ============================================================
# 110. LIST → STRING
# ============================================================

characters = [
    "P",
    "y",
    "t",
    "h",
    "o",
    "n",
]

text = "".join(characters)

print(text)


# ============================================================
# 111. STRING → BYTES
# ============================================================

text = "Python"

data = text.encode("utf-8")

print(data)


# ============================================================
# 112. BYTES → STRING
# ============================================================

data = b"Python"

text = data.decode("utf-8")

print(text)


# ============================================================
# 113. UNICODE
# ============================================================

text = "Hello 世界"

print(text)
print(len(text))


# ============================================================
# 114. ORD()
# ============================================================

print(ord("A"))
print(ord("a"))


# ord() converts a character to its Unicode code point.


# ============================================================
# 115. CHR()
# ============================================================

print(chr(65))
print(chr(97))


# chr() converts a Unicode code point to a character.


# ============================================================
# 116. ORD + CHR
# ============================================================

character = "A"

code = ord(character)

print(code)

print(chr(code))


# ============================================================
# 117. STRING COMPRESSION — CONCEPT
# ============================================================

"""
Strings are immutable.

Therefore operations like:

    upper()
    lower()
    replace()
    strip()

return NEW strings.

Example:
"""

text = "python"

new_text = text.upper()

print("Original:", text)
print("New:", new_text)


# ============================================================
# 118. IMPORTANT — STRING METHOD CHAINING
# ============================================================

text = "   PYTHON PROGRAMMING   "

result = (
    text
    .strip()
    .lower()
    .replace("programming", "language")
)

print(result)


# ============================================================
# 119. PRACTICAL — CLEAN API INPUT
# ============================================================

name = "   SHIVA RAM   "

clean_name = (
    name
    .strip()
    .title()
)

print(clean_name)


# ============================================================
# 120. PRACTICAL — SLUG GENERATOR
# ============================================================

title = "Python Programming Tutorial"

slug = (
    title
    .strip()
    .casefold()
    .replace(" ", "-")
)

print(slug)


# ============================================================
# 121. BETTER SLUG WITH MULTIPLE SPACES
# ============================================================

title = "Python    Programming   Tutorial"

words = title.casefold().split()

slug = "-".join(words)

print(slug)


# ============================================================
# 122. PRACTICAL — MASK EMAIL
# ============================================================

email = "shiva@example.com"

username, domain = email.split("@")

masked = username[0] + "***@" + domain

print(masked)


# ============================================================
# 123. PRACTICAL — EXTRACT FILE EXTENSION
# ============================================================

filename = "photo.profile.jpg"

name, separator, extension = filename.rpartition(".")

print("Name:", name)
print("Extension:", extension)


# ============================================================
# 124. PRACTICAL — CSV-LIKE DATA
# ============================================================

data = "Shiva,21,CSE"

name, age, branch = data.split(",")

print(name)
print(age)
print(branch)


# ============================================================
# 125. PRACTICAL — KEY VALUE DATA
# ============================================================

data = "name=Shiva"

key, separator, value = data.partition("=")

print("Key:", key)
print("Value:", value)


# ============================================================
# 126. PRACTICAL — URL PATH
# ============================================================

path = "/users/123/profile"

parts = path.strip("/").split("/")

print(parts)


# ============================================================
# 127. PRACTICAL — PARSE LOG LINE
# ============================================================

log = "INFO:User logged in"

level, separator, message = log.partition(":")

print("Level:", level)
print("Message:", message)


# ============================================================
# 128. PRACTICAL — WORD SEARCH
# ============================================================

text = "Python is a programming language"

words = text.casefold().split()

if "python" in words:
    print("Python exists as a complete word")


# ============================================================
# 129. PRACTICAL — REMOVE DUPLICATE WORDS
# ============================================================

text = "python is python and python is easy"

words = text.split()

unique_words = list(dict.fromkeys(words))

print(unique_words)


# ============================================================
# 130. PRACTICAL — REVERSE WORD ORDER
# ============================================================

text = "Python is powerful"

words = text.split()

reversed_words = words[::-1]

result = " ".join(reversed_words)

print(result)


# ============================================================
# 131. PRACTICAL — REVERSE EACH WORD
# ============================================================

text = "Python is powerful"

words = text.split()

result = " ".join(
    word[::-1]
    for word in words
)

print(result)


# ============================================================
# 132. PRACTICAL — INITIALS
# ============================================================

name = "Shiva Ram"

initials = "".join(
    word[0].upper()
    for word in name.split()
)

print(initials)


# ============================================================
# 133. PRACTICAL — TEXT NORMALIZATION
# ============================================================

text = "   Python    IS   Powerful   "

normalized = " ".join(
    text.casefold().split()
)

print(normalized)


# ============================================================
# 134. PRACTICAL — CHECK ONLY NUMBERS
# ============================================================

value = "123456"

if value.isdigit():
    print("Only digits")


# ============================================================
# 135. PRACTICAL — CHECK ALPHANUMERIC
# ============================================================

username = "shiva123"

if username.isalnum():
    print("Valid basic username")


# ============================================================
# 136. PRACTICAL — CHECK PYTHON IDENTIFIER
# ============================================================

variable_name = "student_name"

if variable_name.isidentifier():
    print("Valid Python identifier")


# ============================================================
# 137. PRACTICAL — TEXT REPORT
# ============================================================

name = "Shiva"
marks = 85
percentage = 85.5

report = f"""
Student Report
--------------
Name       : {name}
Marks      : {marks}
Percentage : {percentage:.2f}%
"""

print(report)


# ============================================================
# 138. IMPORTANT STRING METHODS TO MEMORIZE
# ============================================================

"""
CORE METHODS
============

lower()
upper()
casefold()

capitalize()
title()
swapcase()

strip()
lstrip()
rstrip()

startswith()
endswith()

find()
rfind()
index()
rindex()

count()
replace()

split()
rsplit()
splitlines()

partition()
rpartition()

join()

removeprefix()
removesuffix()


VALIDATION
==========

isalpha()
isdigit()
isdecimal()
isnumeric()
isalnum()
isspace()

islower()
isupper()
istitle()

isidentifier()
isprintable()
isascii()


CONVERSION
==========

encode()
"""


# ============================================================
# 139. STRING CHEAT SHEET
# ============================================================

"""
INDEX
-----

text[0]
text[-1]


SLICE
-----

text[1:5]
text[:5]
text[5:]
text[::2]
text[::-1]


SEARCH
------

"Python" in text
text.find("Python")
text.count("Python")


MODIFY
------

text.replace("old", "new")

Remember:
strings are immutable,
so these return new strings.


SPLIT
-----

words = text.split()


JOIN
----

text = " ".join(words)


CLEAN
-----

text.strip()


CASE
----

text.lower()
text.upper()
text.casefold()


FORMAT
------

f"Hello {name}"


ENCODE
------

text.encode("utf-8")


DECODE
------

data.decode("utf-8")
"""


# ============================================================
# END
# ============================================================