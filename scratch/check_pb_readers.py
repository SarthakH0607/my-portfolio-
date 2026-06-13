import os

def main():
    task_dir = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\tasks'
    if not os.path.exists(task_dir):
        print("Task directory not found")
        return
        
    for f in os.listdir(task_dir):
        if f.endswith('.log'):
            path = os.path.join(task_dir, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
                if 'Matches for' in content or 'Scan PB' in content or 'Decompressed size' in content:
                    print(f"Log {f} contains PB scan info:")
                    print(content[:500])
                    print("=" * 50)

if __name__ == '__main__':
    main()
