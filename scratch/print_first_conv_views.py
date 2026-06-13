import json
import os
import re

def main():
    brain_dir = r'C:\Users\User\.gemini\antigravity-ide\brain'
    cid = '3eb59413-e7b9-48da-ad9f-565e278c9584'
    log_path = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
    
    if not os.path.exists(log_path):
        print("Log not found")
        return
        
    targets = ['index.css', 'EarthZoom.jsx', 'DeepSpace.jsx']
    
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                content = data.get('content') or data.get('output') or ''
                if content:
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1).replace('"', '').strip()
                        filename = os.path.basename(filepath)
                        if filename in targets:
                            match_showing = re.search(r'Showing lines (\d+) to (\d+)', content)
                            showing = match_showing.group(0) if match_showing else "unknown lines"
                            is_truncated = 'truncated' in content.lower()
                            print(f"Step {data.get('step_index')}: {filename} viewed {showing} (truncated={is_truncated})")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
