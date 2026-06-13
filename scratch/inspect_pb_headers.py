import os

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\c8196562-832e-4d55-a97f-a872ae362027.pb'
    if not os.path.exists(pb_file):
        print("PB file not found")
        return
        
    with open(pb_file, 'rb') as f:
        data = f.read(500)
        
    print(f"Hex: {data.hex()}")
    # print ASCII printable characters
    ascii_chars = "".join([chr(b) if 32 <= b < 127 else "." for b in data])
    print(f"ASCII: {ascii_chars}")

if __name__ == '__main__':
    main()
