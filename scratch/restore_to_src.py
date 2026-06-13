import json
import os
import re

def clean_code(content):
    if not content:
        return content
        
    header_end_marker = "The following code has been modified to include a line number before every line"
    footer_marker = "The above content shows the entire, complete file contents"
    
    if header_end_marker in content:
        idx_header = content.find(header_end_marker)
        line_end = content.find('\n', idx_header)
        if line_end != -1:
            code_part = content[line_end:].lstrip('\r\n')
        else:
            code_part = content[idx_header + len(header_end_marker):].lstrip('\r\n')
            
        if footer_marker in code_part:
            idx_footer = code_part.rfind(footer_marker)
            line_start = code_part.rfind('\n', 0, idx_footer)
            if line_start != -1:
                code_part = code_part[:line_start].rstrip('\r\n')
            else:
                code_part = code_part[:idx_footer].rstrip('\r\n')
                
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

    # Map each target filename to its correct path relative to Portfolio root
    dest_mappings = {
        'App.jsx': 'src/App.jsx',
        'index.css': 'src/index.css',
        'main.jsx': 'src/main.jsx',
        'Navbar.jsx': 'src/components/Navbar.jsx',
        'SpacePortfolioBackground.jsx': 'src/components/SpacePortfolioBackground.jsx',
        'CustomCursor.jsx': 'src/components/CustomCursor.jsx',
        'CentralPlaza.jsx': 'src/components/city/CentralPlaza.jsx',
        'CertificateMuseum.jsx': 'src/components/city/CertificateMuseum.jsx',
        'CityOverview.jsx': 'src/components/city/CityOverview.jsx',
        'ContactDistrict.jsx': 'src/components/city/ContactDistrict.jsx',
        'ControlCenter.jsx': 'src/components/city/ControlCenter.jsx',
        'GitHubPowerPlant.jsx': 'src/components/city/GitHubPowerPlant.jsx',
        'LearningHub.jsx': 'src/components/city/LearningHub.jsx',
        'ProjectDistrict.jsx': 'src/components/city/ProjectDistrict.jsx',
        'SkillsTower.jsx': 'src/components/city/SkillsTower.jsx',
        'VisionTower.jsx': 'src/components/city/VisionTower.jsx',
        'CityArrival.jsx': 'src/components/scenes/CityArrival.jsx',
        'DeepSpace.jsx': 'src/components/scenes/DeepSpace.jsx',
        'EarthZoom.jsx': 'src/components/scenes/EarthZoom.jsx',
        'GlassCard.jsx': 'src/components/ui/GlassCard.jsx',
        'HolographicPanel.jsx': 'src/components/ui/HolographicPanel.jsx',
        'NeonText.jsx': 'src/components/ui/NeonText.jsx',
        'certificates.js': 'src/data/certificates.js',
        'projects.js': 'src/data/projects.js',
        'skills.js': 'src/data/skills.js',
        'useInView.js': 'src/hooks/useInView.js'
    }

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
                    
                    # Ignore corrupted steps after 2500 in the second log
                    if 'c8196562' in lf and step_idx >= 2500:
                        continue
                    
                    # 1. Process write_to_file
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file':
                                target_path = tc['args'].get('TargetFile', '')
                                filename = os.path.basename(target_path)
                                if filename in dest_mappings:
                                    code = tc['args'].get('CodeContent', '')
                                    if code and '<truncated' not in code:
                                        cleaned = clean_code(code)
                                        file_contents[filename] = {
                                            'content': cleaned,
                                            'step': step_idx,
                                            'log': os.path.basename(lf)
                                        }

                    # 2. Process view_file responses
                    content = data.get('content') or data.get('output') or ''
                    if content:
                        match_path = re.search(r'File Path: `file:///(.*)`', content)
                        if match_path:
                            filepath = match_path.group(1).replace('"', '').strip()
                            filename = os.path.basename(filepath)
                            if filename in dest_mappings:
                                match_showing = re.search(r'Showing lines 1 to (\d+)', content)
                                has_footer = "shows the entire, complete file contents" in content
                                if match_showing and has_footer:
                                    cleaned = clean_code(content)
                                    if cleaned and '<truncated' not in content:
                                        file_contents[filename] = {
                                            'content': cleaned,
                                            'step': step_idx,
                                            'log': os.path.basename(lf)
                                        }
                except Exception as e:
                    pass

    print("\nWriting restored files to target src destinations...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for filename, dest_rel_path in dest_mappings.items():
        if filename in file_contents:
            info = file_contents[filename]
            dest_path = os.path.join(portfolio_root, dest_rel_path)
            dest_path = os.path.abspath(dest_path)
            
            # Additional logic to fix the line-height issue in index.css specifically
            content = info['content']
            if filename == 'index.css':
                # Replace 'line-height:' with 'line-height: 1.2;' if it doesn't have a value
                content = content.replace('line-height:\n', 'line-height: 1.2;\n')
                content = content.replace('line-height:\r\n', 'line-height: 1.2;\r\n')
            
            print(f"Restoring {filename} (from {info['log']} Step {info['step']}, len {len(content)}) -> {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(content)
        else:
            print(f"WARNING: Could not reconstruct {filename}")

if __name__ == '__main__':
    main()
