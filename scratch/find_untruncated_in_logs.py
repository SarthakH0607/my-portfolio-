import json
import os
import re

def main():
    log_files = [
        r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
        r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    ]

    targets = ['DeepSpace.jsx', 'EarthZoom.jsx', 'SpacePortfolioBackground.jsx', 'index.css']

    for lf in log_files:
        if not os.path.exists(lf):
            continue
        print(f"\nScanning {lf}...")
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
                            if tc['name'] == 'write_to_file':
                                target_path = tc['args'].get('TargetFile', '')
                                filename = os.path.basename(target_path)
                                if filename in targets:
                                    code = tc['args'].get('CodeContent', '')
                                    if code and 'truncated' not in code.lower():
                                        print(f"  [Write] {filename} in Step {step}, len {len(code)}")

                    # Check view_file or output content
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1).replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in targets:
                                match_showing = re.search(r'Showing lines 1 to (\d+)', content)
                                has_footer = "shows the entire, complete file contents" in content
                                is_truncated = 'truncated' in content.lower()
                                print(f"  [View] {filename} in Step {step}, showing: {match_showing.group(0) if match_showing else 'N/A'}, has_footer: {has_footer}, is_truncated: {is_truncated}, len {len(content)}")
                except Exception as e:
                    pass

if __name__ == '__main__':
    main()
