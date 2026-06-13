import os

def main():
    conv_dir = r'C:\Users\User\.gemini\antigravity-ide\conversations'
    if not os.path.exists(conv_dir):
        print("Conversations dir not found")
        return
        
    for f in os.listdir(conv_dir):
        if f.endswith('.pb'):
            path = os.path.join(conv_dir, f)
            with open(path, 'rb') as file:
                header = file.read(16)
            print(f"{f}: Size {os.path.getsize(path)}, Header Hex {header.hex()}")

if __name__ == '__main__':
    main()
