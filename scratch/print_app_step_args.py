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
                step_idx = data.get('step_index')
                if step_idx in (82, 178, 371, 490, 1189, 1191, 1289):
                    print(f"Step {step_idx}:")
                    print(json.dumps(data, indent=2)[:1000])
                    print("=" * 80)
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
