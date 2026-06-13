import os

def main():
    plugin_dir = r'C:\Users\User\.gemini\config\plugins'
    if not os.path.exists(plugin_dir):
        print("Plugin dir not found")
        return
        
    for item in os.listdir(plugin_dir):
        if 'sdk' in item.lower():
            path = os.path.join(plugin_dir, item)
            print(f"--- Files in {item} ---")
            for root, dirs, files in os.walk(path):
                for f in files:
                    file_path = os.path.join(root, f)
                    print(os.path.relpath(file_path, path))

if __name__ == '__main__':
    main()
