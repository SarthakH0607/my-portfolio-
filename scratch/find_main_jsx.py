import json
import os
import re

log_files = [
    r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
    r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
]

filename = 'main.jsx'

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
                step = data.get('step_index')
                
                # Check write_to_file
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file' and tc['args'].get('TargetFile', '').endswith(filename):
                            code = tc['args'].get('CodeContent', '')
                            print(f"Found write_to_file in {os.path.basename(lf)} step {step}, len: {len(code)}, has_truncated: {'<truncated' in code}")
                            
                # Check view_file
                content = data.get('content') or data.get('output') or ''
                if content:
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1).replace('"', '').strip()
                        if os.path.basename(filepath) == filename:
                            has_footer = "shows the entire, complete file contents" in content
                            print(f"Found view_file in {os.path.basename(lf)} step {step}, len: {len(content)}, has_footer: {has_footer}, has_truncated: {'<truncated' in content}")
            except Exception as e:
                pass
