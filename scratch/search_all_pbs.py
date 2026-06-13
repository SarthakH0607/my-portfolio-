import os

def main():
    conv_dir = r'C:\Users\User\.gemini\antigravity-ide\conversations'
    if not os.path.exists(conv_dir):
        print("Conversations directory not found.")
        return

    keywords = [b'App.jsx', b'Navbar.jsx', b'DeepSpace.jsx', b'toZoom']

    for file in os.listdir(conv_dir):
        if not file.endswith('.pb'):
            continue
        filepath = os.path.join(conv_dir, file)
        try:
            size = os.path.getsize(filepath)
            with open(filepath, 'rb') as f:
                content = f.read()
            
            matches = {kw: content.count(kw) for kw in keywords}
            print(f"File {file} (size {size} bytes):")
            for kw, count in matches.items():
                print(f"  {kw}: {count} matches")
        except Exception as e:
            print(f"Error reading {file}: {e}")

if __name__ == '__main__':
    main()
