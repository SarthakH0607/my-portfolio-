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
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log not found.")
        return
        
    steps = [1749, 1985, 1989, 1991, 2352, 2356, 2364, 2387, 2392, 2549]
    for step in steps:
        with open(log_file, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    if data.get('step_index') == step:
                        content = data.get('content') or data.get('output') or ''
                        if 'SpacePortfolioBackground' in content and 'export default' in content:
                            cleaned = clean_code(content)
                            if cleaned and 'Walkthrough' not in cleaned and 'Implementation Plan' not in cleaned:
                                print(f"SUCCESS: Step {step} has actual SpacePortfolioBackground code, len={len(cleaned)}")
                                out_path = r'C:\Users\User\Desktop\Portfolio\src\components\SpacePortfolioBackground.jsx'
                                os.makedirs(os.path.dirname(out_path), exist_ok=True)
                                with open(out_path, 'w', encoding='utf-8', newline='') as out:
                                    out.write(cleaned)
                                return
                except Exception as e:
                    pass
    print("Failed to find any complete version matching the criteria.")

if __name__ == '__main__':
    main()
