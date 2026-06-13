import json
import os

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found")
        return
        
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                line_str = json.dumps(data)
                if 'read-header.cjs' in line_str:
                    print(f"Step {data.get('step_index')}, Type: {data.get('type')}, Keys: {list(data.keys())}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
