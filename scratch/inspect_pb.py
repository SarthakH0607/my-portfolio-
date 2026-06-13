import os

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\c8196562-832e-4d55-a97f-a872ae362027.pb'
    if not os.path.exists(pb_file):
        print("PB file not found")
        return
        
    with open(pb_file, 'rb') as f:
        data = f.read()
        
    print(f"File size: {len(data)}")
    
    # Let's search for some ASCII strings that we expect to see
    keywords = [
        b"Showing lines 1 to",
        b"App.jsx",
        b"index.css",
        b"The above content shows the entire"
    ]
    
    for kw in keywords:
        pos = data.find(kw)
        print(f"Keyword '{kw.decode()}' found at pos: {pos}")
        if pos != -1:
            print(f"Context: {data[max(0, pos-100):pos+200]}")
            print("-" * 50)

if __name__ == '__main__':
    main()
