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

    file_versions = {t: [] for t in dest_mappings}

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
                    
                    # Process write_to_file
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file':
                                target_path = tc['args'].get('TargetFile', '')
                                filename = os.path.basename(target_path)
                                if filename in dest_mappings:
                                    code = tc['args'].get('CodeContent', '')
                                    if code and '<truncated' not in code and 'truncated' not in code.lower() and len(code) > 100:
                                        cleaned = clean_code(code)
                                        file_versions[filename].append({
                                            'content': cleaned,
                                            'step': step_idx,
                                            'log': os.path.basename(lf),
                                            'type': 'write_to_file'
                                        })

                    # Process view_file responses
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
                                    if cleaned and '<truncated' not in content and 'truncated' not in content.lower():
                                        file_versions[filename].append({
                                            'content': cleaned,
                                            'step': step_idx,
                                            'log': os.path.basename(lf),
                                            'type': 'view_file'
                                        })
                except Exception as e:
                    pass

    print("\nWriting restored files using latest complete untruncated versions...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    for filename, dest_rel_path in dest_mappings.items():
        versions = file_versions[filename]
        if versions:
            # We want the LATEST version (highest step_idx from log 2, or if none, from log 1)
            # Sorting versions by log (transcript.jsonl 2 after transcript.jsonl 1) and step_idx
            def sort_key(v):
                log_pri = 1 if 'c8196562' in v['log'] else 0
                # Let's make sure we ignore late versions (step_idx >= 2500) if it's the second log
                # because later ones are corrupted/fragmented
                if log_pri == 1 and v['step'] >= 2490:
                    return (-1, v['step'])
                return (log_pri, v['step'])
                
            sorted_versions = sorted(versions, key=sort_key)
            best_ver = sorted_versions[-1]
            
            dest_path = os.path.join(portfolio_root, dest_rel_path)
            dest_path = os.path.abspath(dest_path)
            
            content = best_ver['content']
            if filename == 'index.css':
                # Fix the line-height issue
                content = content.replace('line-height:\n', 'line-height: 1.2;\n')
                content = content.replace('line-height:\r\n', 'line-height: 1.2;\r\n')
                
            print(f"Restoring {filename} (from {best_ver['log']} Step {best_ver['step']} via {best_ver['type']}, len {len(content)}) -> {dest_path}")
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(content)
        else:
            print(f"WARNING: Could not find any valid version for {filename}")

if __name__ == '__main__':
    main()
