import json
import os

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        print("Log file not found")
        return
        
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                step_idx = data.get('step_index')
                if step_idx == 2512:
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'replace_file_content':
                                content = tc['args']['ReplacementContent']
                                
                                # Strip outer double quotes if present in the string value
                                content_stripped = content.strip()
                                print("Original content start:", repr(content_stripped[:100]))
                                if content_stripped.startswith('"') and content_stripped.endswith('"'):
                                    content_stripped = content_stripped[1:-1]
                                elif content_stripped.startswith('\\"') and content_stripped.endswith('\\"'):
                                    content_stripped = content_stripped[2:-2]
                                print("After strip start:", repr(content_stripped[:100]))
                                
                                # Let's unescape it
                                decoded = content_stripped.encode('utf-8').decode('unicode-escape')
                                print("After unicode-escape start:", repr(decoded[:100]))
                                
                                # Wait! If unicode-escape left any leading/trailing quotes, clean them
                                decoded = decoded.strip()
                                if decoded.startswith('"') and decoded.endswith('"'):
                                    decoded = decoded[1:-1]
                                print("Final decoded start:", repr(decoded[:100]))
                                
                                dest = r'C:\Users\User\Desktop\Portfolio\src\read-header.cjs'
                                with open(dest, 'w', encoding='utf-8', newline='') as out:
                                    out.write(decoded)
                                print(f"Properly wrote read-header.cjs. Length: {len(decoded)}")
                                return
            except Exception as e:
                print(f"Error: {e}")

if __name__ == '__main__':
    main()
