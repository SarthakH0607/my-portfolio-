import os

file_path = r"c:\Users\User\Desktop\Portfolio\src\App.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

print("Length of file:", len(content))
print("Start of file (first 200 chars):")
print(repr(content[:200]))
print("End of file (last 200 chars):")
print(repr(content[-200:]))
