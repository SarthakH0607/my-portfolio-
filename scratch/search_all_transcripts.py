import json
import os
import re

def main():
    brain_dir = r'C:\Users\User\.gemini\antigravity-ide\brain'
    if not os.path.exists(brain_dir):
        print("Brain dir not found")
        return
        
    targets = ['index.css', 'EarthZoom.jsx', 'DeepSpace.jsx']
    
    # List all subdirectories (conversation IDs)
    conv_ids = [d for d in os.listdir(brain_dir) if os.path.isdir(os.path.join(brain_dir, d))]
    
    for cid in conv_ids:
        log_path = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
        if not os.path.exists(log_path):
            continue
            
        views = {}
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
                                if match_showing:
                                    start, end = int(match_showing.group(1)), int(match_showing.group(2))
                                    if filename not in views:
                                        views[filename] = []
                                    views[filename].append((data.get('step_index'), start, end))
                except Exception as e:
                    pass
        if views:
            print(f"--- Conv {cid} ---")
            for t in targets:
                if t in views:
                    print(f"  {t}: {views[t]}")

if __name__ == '__main__':
    main()
