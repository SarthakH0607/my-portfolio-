import json
import os

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found.")
        return

    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                if data.get('step_index') == 1481:
                    content = data.get('content') or data.get('output') or ''
                    print(f"Step 1481 found. Content length: {len(content)}")
                    with open(r'c:\Users\User\Desktop\Portfolio\scratch\step_1481.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
                    print("Written to scratch/step_1481.txt")
                    return
            except Exception as e:
                pass
    print("Step 1771 not found or failed.")

if __name__ == '__main__':
    main()
