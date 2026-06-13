import json
import os
import re

def clean_view_content(content, lines_map):
    lines = content.split('\n')
    count = 0
    for line in lines:
        m = re.match(r'^(\d+):\s?(.*)$', line)
        if m:
            line_num = int(m.group(1))
            line_text = m.group(2)
            # Avoid keeping truncated placeholders or thoughts
            if '<truncated' not in line_text and 'The above content' not in line_text:
                lines_map[line_num] = line_text
                count += 1
    return count

def main():
    log_files = [
        r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
        r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    ]
    
    targets = {
        'EarthZoom.jsx': r'C:\Users\User\Desktop\Portfolio\src\components\scenes\EarthZoom.jsx',
        'DeepSpace.jsx': r'C:\Users\User\Desktop\Portfolio\src\components\scenes\DeepSpace.jsx',
        'index.css': r'C:\Users\User\Desktop\Portfolio\src\index.css'
    }
    
    file_lines = {t: {} for t in targets}
    
    for log_path in log_files:
        if not os.path.exists(log_path):
            continue
        print("Scanning", log_path)
        with open(log_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    step_idx = data.get('step_index')
                    
                    # Ignore steps after ruin started
                    if 'c8196562' in log_path and step_idx >= 1945:
                        continue
                        
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1).replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in targets:
                                clean_view_content(content, file_lines[filename])
                                
                except Exception as e:
                    pass
                    
    print("\nWriting restored files...")
    for t, dest_path in targets.items():
        lines_dict = file_lines[t]
        if lines_dict:
            max_line = max(lines_dict.keys())
            code_lines = []
            gaps = 0
            for i in range(1, max_line + 1):
                if i not in lines_dict:
                    code_lines.append(f"// MISSING LINE {i}")
                    gaps += 1
                else:
                    code_lines.append(lines_dict[i])
                    
            code = '\n'.join(code_lines)
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(code)
            print(f"Wrote {t}: Max line {max_line}, gaps: {gaps} -> {dest_path}")
        else:
            print(f"WARNING: No lines found for {t}")

if __name__ == '__main__':
    main()
