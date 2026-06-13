import os

def main():
    sidecars_dir = r'C:\Users\User\.gemini\config\agents'
    if not os.path.exists(sidecars_dir):
        print("Sidecars dir not found")
        return
        
    for root, dirs, files in os.walk(sidecars_dir):
        for f in files:
            path = os.path.join(root, f)
            print(os.path.relpath(path, sidecars_dir))

if __name__ == '__main__':
    main()
