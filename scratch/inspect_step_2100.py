import json
import os

log_files = [
    r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
    r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl',
    r'C:\Users\User\.gemini\antigravity-ide\brain\594ce594-ccd5-4f84-9b83-30d44ac9383d\.system_generated\logs\transcript.jsonl'
]

for lf in log_files:
    if not os.path.exists(lf):
        continue
    print(f"Scanning {lf}...")
    with open(lf, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                if data.get('step_index') == 2100:
                    print(f"Found step 2100 in {os.path.basename(lf)}:")
                    print(json.dumps(data, indent=2)[:2000])
                    print("...")
            except Exception as e:
                pass
