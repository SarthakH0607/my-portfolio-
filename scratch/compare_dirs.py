import os

def main():
    dir1 = r'C:\Users\User\Desktop\Portfolio\src'
    dir2 = r'C:\Users\User\Desktop\City of 2035\src'
    
    if not os.path.exists(dir1) or not os.path.exists(dir2):
        print("One of the directories does not exist")
        return
        
    # Walk dir2 and list files
    for root, dirs, files in os.walk(dir2):
        for f in files:
            path2 = os.path.join(root, f)
            rel = os.path.relpath(path2, dir2)
            path1 = os.path.join(dir1, rel)
            if os.path.exists(path1):
                size1 = os.path.getsize(path1)
                size2 = os.path.getsize(path2)
                print(f"{rel}: Portfolio Size {size1}, City of 2035 Size {size2}")
            else:
                print(f"{rel}: Only in City of 2035 (Size {os.path.getsize(path2)})")

if __name__ == '__main__':
    main()
