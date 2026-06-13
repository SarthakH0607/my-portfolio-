import os

def main():
    ext_file = r'c:\Users\User\AppData\Local\Programs\Antigravity IDE\resources\app\extensions\antigravity\dist\extension.js'
    if not os.path.exists(ext_file):
        print("Extension file not found")
        return
        
    with open(ext_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        
    print("Searching for crypto keywords...")
    keywords = ['createDecipher', 'aes-', 'encrypt', 'decrypt', 'cipher', 'key', 'iv']
    for kw in keywords:
        pos = 0
        matches = []
        while True:
            pos = content.find(kw, pos)
            if pos == -1:
                break
            matches.append(pos)
            pos += len(kw)
        print(f"Keyword '{kw}': {len(matches)} matches")
        if len(matches) > 0:
            print("Sample context:")
            for m in matches[:3]:
                start = max(0, m - 50)
                end = min(len(content), m + 150)
                print(repr(content[start:end]))
            print("-" * 50)

if __name__ == '__main__':
    main()
