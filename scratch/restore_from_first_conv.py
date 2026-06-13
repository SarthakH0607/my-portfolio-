import json
import os
import re

def clean_lines(content):
    # Split by newline and extract code by removing "number: " prefixes
    lines = content.split('\n')
    cleaned = []
    has_num = False
    for line in lines:
        m = re.match(r'^(\d+):\s?(.*)$', line)
        if m:
            has_num = True
            cleaned.append(m.group(2))
        else:
            # If there's a line without line number, keep it if it's not a header/footer
            if "The following code" not in line and "The above content" not in line and "File Path:" not in line:
                cleaned.append(line)
    if has_num:
        return '\n'.join(cleaned)
    return content

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\3eb59413-e7b9-48da-ad9f-565e278c9584\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("First conversation log file not found.")
        return

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

    file_contents = {}

    print(f"Reading {log_file}...")
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step_idx = data.get('step_index')
                
                # Check tool calls for write_to_file
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file':
                            target_path = tc['args'].get('TargetFile', '')
                            filename = os.path.basename(target_path)
                            if filename in targets:
                                code = tc['args'].get('CodeContent')
                                if code and 'truncated' not in code.lower():
                                    file_contents[filename] = {
                                        'content': code,
                                        'step': step_idx,
                                        'type': 'write_to_file',
                                        'path': target_path
                                    }

                # Check tool output (view_file responses)
                content = data.get('content') or data.get('output') or ''
                if content:
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1).replace('"', '').strip()
                        filename = os.path.basename(filepath)
                        if filename in targets:
                            # Parse showing lines
                            match_showing = re.search(r'Showing lines 1 to (\d+)', content)
                            has_footer = "The above content shows the entire, complete file contents" in content
                            if match_showing and has_footer:
                                code = clean_lines(content)
                                if code and 'truncated' not in content.lower():
                                    file_contents[filename] = {
                                        'content': code,
                                        'step': step_idx,
                                        'type': 'view_file',
                                        'path': filepath
                                    }
            except Exception as e:
                pass

    print("Writing restored files...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for t in targets:
        if t in file_contents:
            info = file_contents[t]
            rel_path = info['path'].replace('c:/Users/User/Desktop/Portfolio/', '').replace('C:/Users/User/Desktop/Portfolio/', '')
            dest_path = os.path.join(portfolio_root, rel_path)
            dest_path = os.path.abspath(dest_path)
            
            print(f"Restoring {t} (from Step {info['step']} via {info['type']}) to: {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(info['content'])
        else:
            print(f"WARNING: Could not find working version for {t}")

if __name__ == '__main__':
    main()
