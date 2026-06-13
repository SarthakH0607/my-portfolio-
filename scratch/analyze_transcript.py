import json
import os
import re

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found.")
        return

    viewed_files = set()
    written_files = set()
    
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                
                # Check for tool calls (writing files)
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] in ('write_to_file', 'replace_file_content', 'multi_replace_file_content'):
                            target = tc['args'].get('TargetFile')
                            if target:
                                written_files.add(target)
                                
                # Check for VIEW_FILE step or output
                if data.get('type') == 'VIEW_FILE' or 'view_file' in str(data):
                    # Try to extract file paths
                    matches = re.findall(r'file:///([^\s`\']+)', str(data))
                    for m in matches:
                        viewed_files.add(m)
            except Exception as e:
                pass
                
    print("Files written to in logs:")
    for f in sorted(written_files):
        print(f"  {f}")
        
    print("\nFiles viewed in logs:")
    for f in sorted(viewed_files):
        print(f"  {f}")

if __name__ == '__main__':
    main()
