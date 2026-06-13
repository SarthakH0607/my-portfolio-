import json
import os

lf = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
with open(lf, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('step_index') == 2017:
                print("Step 2017 content:")
                content = data.get('content') or data.get('output') or ''
                lines = content.split('\n')
                for i, l in enumerate(lines[:15]):
                    print(f"{i+1}: {l}")
        except Exception:
            pass
