import json
import os

def main():
    log_files = [
        r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
        r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    ]
    
    for path in log_files:
        if not os.path.exists(path):
            continue
        print("Checking", path)
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    step = data.get('step_index')
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file':
                                target = tc['args'].get('TargetFile') or ''
                                if 'EarthZoom.jsx' in target:
                                    code = tc['args'].get('CodeContent') or ''
                                    print(f"Step {step}: Write to EarthZoom.jsx, Length: {len(code)}, Truncated: {'truncated' in code.lower()}")
                except Exception as e:
                    pass

if __name__ == '__main__':
    main()
