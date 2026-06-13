import os

def main():
    desktop = r'C:\Users\User\Desktop'
    targets = ['SpacePortfolioBackground.jsx', 'DeepSpace.jsx', 'EarthZoom.jsx', 'index.css']
    
    print(f"Scanning {desktop} recursively...")
    for root, dirs, files in os.walk(desktop):
        # Skip node_modules etc to be fast
        if any(skip in root for skip in ['node_modules', '.git', 'dist', 'build', 'venv', '.next']):
            continue
        for file in files:
            if file in targets:
                path = os.path.join(root, file)
                try:
                    size = os.path.getsize(path)
                    print(f"Found {file}: {path} ({size} bytes)")
                except:
                    pass

if __name__ == '__main__':
    main()
