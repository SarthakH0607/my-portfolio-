import json
import os
import re

def clean_code(content):
    if not content:
        return content
        
    header_end_marker = "The following code has been modified to include a line number before every line"
    footer_marker = "The above content shows the entire, complete file contents"
    
    # If the content contains the view_file header, extract the code part
    if header_end_marker in content:
        idx_header = content.find(header_end_marker)
        # Find the end of that line
        line_end = content.find('\n', idx_header)
        if line_end != -1:
            code_part = content[line_end:].lstrip('\r\n')
        else:
            code_part = content[idx_header + len(header_end_marker):].lstrip('\r\n')
            
        if footer_marker in code_part:
            idx_footer = code_part.rfind(footer_marker)
            # Find the start of the line containing the footer marker
            line_start = code_part.rfind('\n', 0, idx_footer)
            if line_start != -1:
                code_part = code_part[:line_start].rstrip('\r\n')
            else:
                code_part = code_part[:idx_footer].rstrip('\r\n')
                
        # Now clean line numbers like "1: code" or "12: code"
        lines = code_part.split('\n')
        cleaned_lines = []
        for line in lines:
            m = re.match(r'^(\d+):\s?(.*)$', line)
            if m:
                cleaned_lines.append(m.group(2))
            else:
                cleaned_lines.append(line)
        return '\n'.join(cleaned_lines)
        
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

    file_contents = {}

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
                    
                    # 1. Process write_to_file tool calls
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file':
                                target_path = tc['args'].get('TargetFile', '')
                                filename = os.path.basename(target_path)
                                if filename in targets:
                                    code = tc['args'].get('CodeContent', '')
                                    if code and '<truncated' not in code:
                                        cleaned = clean_code(code)
                                        file_contents[filename] = {
                                            'content': cleaned,
                                            'step': step_idx,
                                            'type': 'write_to_file',
                                            'path': target_path
                                        }

                    # 2. Process view_file responses
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1).replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in targets:
                                # We only use it if it's a complete view of the file
                                match_showing = re.search(r'Showing lines 1 to (\d+)', content)
                                has_footer = "The above content shows the entire, complete file contents" in content
                                if match_showing and has_footer:
                                    cleaned = clean_code(content)
                                    if cleaned and '<truncated' not in content:
                                        file_contents[filename] = {
                                            'content': cleaned,
                                            'step': step_idx,
                                            'type': 'view_file',
                                            'path': filepath
                                        }
                except Exception as e:
                    pass

    print("\nWriting restored files...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for t in targets:
        if t in file_contents:
            info = file_contents[t]
            rel_path = info['path'].replace('c:/Users/User/Desktop/Portfolio/', '').replace('C:/Users/User/Desktop/Portfolio/', '')
            dest_path = os.path.join(portfolio_root, rel_path)
            dest_path = os.path.abspath(dest_path)
            
            print(f"Restoring {t} (from Step {info['step']} in log, len {len(info['content'])}) to: {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(info['content'])
        else:
            print(f"WARNING: Could not reconstruct {t}")

if __name__ == '__main__':
    main()
