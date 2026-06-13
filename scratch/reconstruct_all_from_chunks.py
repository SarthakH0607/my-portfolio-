import json
import os
import re

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found.")
        return

    targets = [
        'App.jsx',
        'index.css',
        'main.jsx',
        'Navbar.jsx',
        'SpacePortfolioBackground.jsx',
        'CustomCursor.jsx',
        'CentralPlaza.jsx',
        'CertificateMuseum.jsx',
        'CityOverview.jsx',
        'ContactDistrict.jsx',
        'ControlCenter.jsx',
        'GitHubPowerPlant.jsx',
        'LearningHub.jsx',
        'ProjectDistrict.jsx',
        'SkillsTower.jsx',
        'VisionTower.jsx',
        'CityArrival.jsx',
        'DeepSpace.jsx',
        'EarthZoom.jsx',
        'GlassCard.jsx',
        'HolographicPanel.jsx',
        'NeonText.jsx',
        'certificates.js',
        'projects.js',
        'skills.js',
        'useInView.js'
    ]

    # Map from filename to {line_num: text}
    file_lines = {t: {} for t in targets}
    # Track the resolved path for each file
    file_paths = {}

    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step_idx = data.get('step_index')
                
                # Skip steps after the ruin started
                if step_idx >= 1820:
                    continue

                # Check write_to_file tool calls
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file':
                            target_path = tc['args'].get('TargetFile', '')
                            filename = os.path.basename(target_path)
                            if filename in targets:
                                code = tc['args'].get('CodeContent', '')
                                if code and '<truncated' not in code:
                                    # Since this is a full write (not truncated), it's the absolute truth at this step
                                    lines = code.split('\n')
                                    file_lines[filename] = {i+1: l for i, l in enumerate(lines)}
                                    file_paths[filename] = target_path

                # Check VIEW_FILE step responses or tool outputs
                content = data.get('content') or data.get('output') or ''
                if content:
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1)
                        filename = os.path.basename(filepath)
                        if filename in targets:
                            file_paths[filename] = filepath
                            # Parse lines of the view_file block
                            lines = content.split('\n')
                            for l in lines:
                                m = re.match(r'^(\d+):\s?(.*)$', l)
                                if m:
                                    line_num = int(m.group(1))
                                    line_text = m.group(2)
                                    # Avoid keeping truncated placeholder line or thoughts
                                    if '<truncated' not in line_text and 'The above content' not in line_text:
                                        file_lines[filename][line_num] = line_text

            except Exception as e:
                pass

    print("Reconstruction summary:")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    
    for t in targets:
        lines_dict = file_lines[t]
        if lines_dict:
            max_line = max(lines_dict.keys())
            code_lines = []
            for i in range(1, max_line + 1):
                # If a line is missing from chunks, default to empty string
                code_lines.append(lines_dict.get(i, ''))
                
            code = '\n'.join(code_lines)
            
            # Resolve destination path
            filepath = file_paths.get(t, f"src/{t}")
            rel_path = filepath.replace('c:/Users/User/Desktop/Portfolio/', '').replace('C:/Users/User/Desktop/Portfolio/', '')
            dest_path = os.path.join(portfolio_root, rel_path)
            
            print(f"Reconstructed {t}: {len(lines_dict)} unique lines, max line {max_line} -> {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(code)
        else:
            print(f"WARNING: Could not reconstruct {t} (no chunks found)")

if __name__ == '__main__':
    main()
