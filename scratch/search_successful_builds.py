import json
import os

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
                if 'built in' in serialized or 'build success' in serialized.lower():
                    print(f"Step {data.get('step_index')}: Build output matches!")
                    if 'content' in data:
                        print(data['content'][:500])
                    print("=" * 80)
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
