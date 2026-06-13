import json
import os
import re

def clean_view_content(content):
    # Check if this is a complete file view
    # It must show lines 1 to X and contain the "entire, complete file contents" footer.
    match_showing = re.search(r'Showing lines 1 to (\d+)', content)
    has_footer = "The above content shows the entire, complete file contents of the requested file." in content
    
    if match_showing and has_footer:
        lines = content.split('\n')
        code_lines = []
        for line in lines:
            # Match line numbers like "1: code" or "12: code"
            m = re.match(r'^(\d+):\s?(.*)$', line)
            if m:
                code_lines.append(m.group(2))
        return '\n'.join(code_lines)
    return None

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

    file_contents = {}

    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step_idx = data.get('step_index')
                
                # We skip steps where the files were written with chat thoughts / notes
                # (which happened in steps >= 1290)
                if step_idx >= 1290:
                    continue

                # Check tool calls
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] == 'write_to_file':
                            target_path = tc['args'].get('TargetFile', '')
                            filename = os.path.basename(target_path)
                            if filename in targets:
                                code = tc['args'].get('CodeContent')
                                if code:
                                    file_contents[filename] = {
                                        'content': code,
                                        'step': step_idx,
                                        'type': 'write_to_file',
                                        'path': target_path
                                    }

                # Check view file response outputs
                content = data.get('content') or data.get('output') or ''
                if content:
                    # Look for file path in content
                    match_path = re.search(r'File Path: `file:///(.*)`', content)
                    if match_path:
                        filepath = match_path.group(1)
                        filename = os.path.basename(filepath)
                        if filename in targets:
                            code = clean_view_content(content)
                            if code is not None:
                                file_contents[filename] = {
                                    'content': code,
                                    'step': step_idx,
                                    'type': 'view_file',
                                    'path': filepath
                                }
            except Exception as e:
                pass

    print("Reconstruction summary:")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for t in targets:
        if t in file_contents:
            info = file_contents[t]
            # Resolve destination path
            # We want to match the directory structure inside src/
            rel_path = info['path'].replace('c:/Users/User/Desktop/Portfolio/', '').replace('C:/Users/User/Desktop/Portfolio/', '')
            dest_path = os.path.join(portfolio_root, rel_path)
            
            print(f"Restoring {t} (from Step {info['step']} via {info['type']}) to: {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(info['content'])
        else:
            print(f"WARNING: Could not find untruncated version for {t}")

if __name__ == '__main__':
    main()
