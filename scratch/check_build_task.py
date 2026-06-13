import json
import os
import sys

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        return

    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                serialized = json.dumps(data)
                if 'task-2395' in serialized:
                    step_idx = data.get('step_index')
                    content = data.get('content') or ''
                    sys.stdout.buffer.write(f"--- Step {step_idx} ---\n".encode('utf-8'))
                    sys.stdout.buffer.write(content.encode('utf-8'))
                    sys.stdout.buffer.write(b"\n")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
