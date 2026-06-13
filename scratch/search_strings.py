import os

def main():
    pb_file = 'decompressed.pb'
    if not os.path.exists(pb_file):
        print("PB file not found.")
        return

    with open(pb_file, 'rb') as f:
        data = f.read()

    keywords = [
        b'File Path:',
        b'file:///',
        b'Navbar.jsx',
        b'App.jsx',
        b'Showing lines'
    ]

    for kw in keywords:
        idx = 0
        count = 0
        while True:
            idx = data.find(kw, idx)
            if idx == -1:
                break
            count += 1
            if count <= 3:
                print(f"Keyword {kw} match {count} at byte {idx}")
                # Print 100 bytes around it
                start = max(0, idx - 50)
                end = min(len(data), idx + 200)
                print(f"Context: {data[start:end]}")
                print("-" * 50)
            idx += len(kw)
        print(f"Total matches for {kw}: {count}")

if __name__ == '__main__':
    main()
