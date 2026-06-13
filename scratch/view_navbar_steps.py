import json
import os

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found.")
        return

    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step_idx = data.get('step_index')
                serialized = json.dumps(data)
                
                if 'Navbar.jsx' in serialized:
                    # Let's inspect write_to_file or replace_file_content or view_file response
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if 'Navbar.jsx' in json.dumps(tc):
                                print(f"--- Step {step_idx} Tool Call: {tc['name']} ---")
                                if tc['name'] == 'write_to_file':
                                    content = tc['args'].get('CodeContent', '')
                                    print(f"Content length: {len(content)}")
                                    print(content[:500])
                                elif tc['name'] == 'replace_file_content':
                                    print(f"ReplacementContent length: {len(tc['args'].get('ReplacementContent', ''))}")
                                    print(tc['args'].get('ReplacementContent', '')[:500])
                                elif tc['name'] == 'view_file':
                                    print("Arguments:", tc['args'])
                    
                    if data.get('type') == 'VIEW_FILE' and 'content' in data:
                        content = data['content']
                        if 'Navbar.jsx' in content or 'navbar' in content.lower():
                            print(f"--- Step {step_idx} VIEW_FILE Content ---")
                            print(f"Content length: {len(content)}")
                            print(content[:500])
                            
                    # Also look for tool outputs
                    if data.get('type') == 'TOOL_RESPONSE' or 'output' in data:
                        output = data.get('content') or data.get('output') or ''
                        if 'Navbar.jsx' in output:
                            print(f"--- Step {step_idx} Tool Response containing Navbar.jsx ---")
                            print(f"Length: {len(output)}")
                            # print first 500 chars of lines that look like code
                            print(output[:500])
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
