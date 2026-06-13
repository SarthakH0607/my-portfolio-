import os

def main():
    plugin_dir = r'C:\Users\User\.gemini\config\plugins'
    if not os.path.exists(plugin_dir):
        print("Plugin dir not found")
        return
        
    for root, dirs, files in os.walk(plugin_dir):
        for f in files:
            path = os.path.join(root, f)
            print(os.path.relpath(path, plugin_dir))

if __name__ == '__main__':
    main()
