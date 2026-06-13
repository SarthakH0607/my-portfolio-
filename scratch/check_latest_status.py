import json
import os
import re

def clean_view_content(content):
    match_showing = re.search(r'Showing lines 1 to (\d+)', content)
    has_footer = ("The above content shows the entire, complete file contents of the requested file." in content or
                  "The above content does NOT show the entire file contents." in content)
    
    if match_showing and has_footer:
        lines = content.split('\n')
        code_lines = []
        for line in lines:
            m = re.match(r'^(\d+):\s?(.*)$', line)
            if m:
                code_lines.append(m.group(2))
        return '\n'.join(code_lines)
    return None

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
    
    latest_edit_step = {t: -1 for t in targets}
    latest_complete_step = {t: -1 for t in targets}
    
    # We will loop over both logs chronologically
    for log_path in log_files:
        if not os.path.exists(log_path):
            continue
        with open(log_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    step_idx = data.get('step_index')
                    
                    # We skip steps after the ruin started (Step 1945 of c8196562)
                    if 'c8196562' in log_path and step_idx >= 1945:
                        continue
                        
                    # Check tool calls
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                                target = tc['args'].get('TargetFile') or tc['args'].get('AbsolutePath') or ''
                                target = target.replace('"', '').strip()
                                filename = os.path.basename(target)
                                if filename in targets:
                                    latest_edit_step[filename] = step_idx
                                    
                                    # If it's a write_to_file and not truncated in log, it's also a complete view/write
                                    if tc['name'] == 'write_to_file':
                                        code = tc['args'].get('CodeContent', '')
                                        if code and 'truncated' not in code.lower():
                                            latest_complete_step[filename] = step_idx
                                            
                    # Check tool output
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1)
                            filepath = filepath.replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in targets:
                                code = clean_view_content(content)
                                if code is not None and 'truncated' not in content.lower():
                                    latest_complete_step[filename] = step_idx
                                    
                except Exception as e:
                    pass
                    
    print("File Status:")
    for t in targets:
        edit = latest_edit_step[t]
        comp = latest_complete_step[t]
        status = "OK" if comp >= edit else "Edits after last complete view!"
        print(f"{t}: Last Edit Step {edit}, Last Complete Step {comp} -> {status}")

if __name__ == '__main__':
    main()
