import os

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\3eb59413-e7b9-48da-ad9f-565e278c9584.pb'
    if not os.path.exists(pb_file):
        print("PB file not found")
        return
        
    with open(pb_file, 'rb') as f:
        data = f.read()
        
    print(f"Size: {len(data)}")
    
    # Try searching for a substring of one of the files
    targets = [b"CustomCursor", b"DeepSpace", b"toPortfolio", b"AnimatePresence"]
    for t in targets:
        pos = data.find(t)
        print(f"Target '{t.decode()}' found at pos: {pos}")
        if pos != -1:
            print("Context:", data[pos:pos+200])

if __name__ == '__main__':
    main()
