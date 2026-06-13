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
                step_idx = data.get('step_index')
                if step_idx in [2156, 2443]:
                    content = data.get('content') or data.get('output') or ''
                    if 'read-header.cjs' in content:
                        print(f"Step {step_idx}:")
                        print(content[:2000])
                        print("-" * 50)
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
