import json
import os
import re

def clean_lines(content):
    lines = content.split('\n')
    cleaned = []
    has_num = False
    for line in lines:
        m = re.match(r'^(\d+):\s?(.*)$', line)
        if m:
            has_num = True
            cleaned.append(m.group(2))
        else:
            if "The following code" not in line and "The above content" not in line and "File Path:" not in line:
                cleaned.append(line)
    if has_num:
        return '\n'.join(cleaned)
    return content

def main():
    log_files = [
        r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl',
        r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    ]

    targets = [
        'App.jsx', 'index.css', 'main.jsx', 'Navbar.jsx',
        'SpacePortfolioBackground.jsx', 'CustomCursor.jsx',
        'CentralPlaza.jsx', 'CertificateMuseum.jsx',
        'CityOverview.jsx', 'ContactDistrict.jsx',
        'ControlCenter.jsx', 'GitHubPowerPlant.jsx',
        'LearningHub.jsx', 'ProjectDistrict.jsx',
        'SkillsTower.jsx', 'VisionTower.jsx',
        'CityArrival.jsx', 'DeepSpace.jsx',
        'EarthZoom.jsx', 'GlassCard.jsx',
        'HolographicPanel.jsx', 'NeonText.jsx',
        'certificates.js', 'projects.js',
        'skills.js', 'useInView.js'
    ]

    file_lines = {t: {} for t in targets}
    file_paths = {}

    for lf in log_files:
        if not os.path.exists(lf):
            continue
        print(f"Reading {lf}...")
        with open(lf, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    step_idx = data.get('step_index')
                    
                    # Ignore corrupted edits at the end of the second log (step_idx >= 1820)
                    if 'c8196562' in lf and step_idx >= 1820:
                        continue
                    
                    # 1. Process write_to_file
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file':
                                target_path = tc['args'].get('TargetFile', '')
                                filename = os.path.basename(target_path)
                                if filename in targets:
                                    code = tc['args'].get('CodeContent', '')
                                    if code and '<truncated' not in code:
                                        lines = code.split('\n')
                                        file_lines[filename] = {i+1: l for i, l in enumerate(lines)}
                                        file_paths[filename] = target_path

                    # 2. Process view_file responses
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1).replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in targets:
                                file_paths[filename] = filepath
                                
                                # Check if it's a complete view
                                match_showing = re.search(r'Showing lines 1 to (\d+)', content)
                                has_footer = "The above content shows the entire, complete file contents" in content
                                
                                lines = content.split('\n')
                                parsed_lines = {}
                                for l in lines:
                                    m = re.match(r'^(\d+):\s?(.*)$', l)
                                    if m:
                                        line_num = int(m.group(1))
                                        line_text = m.group(2)
                                        if '<truncated' not in line_text and 'The above content' not in line_text:
                                            parsed_lines[line_num] = line_text
                                            
                                if parsed_lines:
                                    if match_showing and has_footer:
                                        # Clear map for complete view
                                        file_lines[filename] = parsed_lines
                                    else:
                                        # Merge/update map for partial view
                                        for k, v in parsed_lines.items():
                                            file_lines[filename][k] = v
                                            
                except Exception as e:
                    pass

    print("\nWriting restored files...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for t in targets:
        lines_dict = file_lines[t]
        if lines_dict:
            max_line = max(lines_dict.keys())
            code_lines = []
            for i in range(1, max_line + 1):
                code_lines.append(lines_dict.get(i, ''))
            
            code = '\n'.join(code_lines)
            
            # Resolve destination path
            filepath = file_paths.get(t, f"src/{t}")
            rel_path = filepath.replace('c:/Users/User/Desktop/Portfolio/', '').replace('C:/Users/User/Desktop/Portfolio/', '')
            dest_path = os.path.join(portfolio_root, rel_path)
            dest_path = os.path.abspath(dest_path)
            
            print(f"Writing {t} (Max line {max_line}, len {len(code)}) to: {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(code)
        else:
            print(f"WARNING: Could not reconstruct {t}")

if __name__ == '__main__':
    main()
