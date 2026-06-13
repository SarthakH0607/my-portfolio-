import os
import sys

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\tasks\task-2395.log'
    if not os.path.exists(log_file):
        print("Log not found.")
        return
    with open(log_file, 'r', encoding='utf-8') as f:
        content = f.read()
    sys.stdout.buffer.write(content.encode('utf-8'))

if __name__ == '__main__':
    main()
