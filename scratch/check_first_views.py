import json
import os
import re

def main():
    log_path = r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_path):
        print("Log path not found")
        return
        
    targets = ['EarthZoom.jsx', 'DeepSpace.jsx', 'index.css']
    
    with open(log_path, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step = data.get('step_index')
                
                content = data.get('content') or data.get('output') or ''
                if content:
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1).replace('"', '').strip()
                        filename = os.path.basename(filepath)
                        if filename in targets:
                            match_showing = re.search(r'Showing lines (\d+) to (\d+)', content)
                            showing_str = match_showing.group(0) if match_showing else "unknown lines"
                            print(f"Step {step}: View of {filename}, lines: {showing_str}, length: {len(content)}")
                            
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
