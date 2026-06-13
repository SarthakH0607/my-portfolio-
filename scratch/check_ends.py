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
                                content_stripped = content.strip()
                                print("Length:", len(content_stripped))
                                print("Start 20:", repr(content_stripped[:20]))
                                print("End 20:", repr(content_stripped[-20:]))
                                print("Starts with quote:", content_stripped.startswith('"'))
                                print("Ends with quote:", content_stripped.endswith('"'))
                                print("Ends with escaped quote:", content_stripped.endswith('\\"'))
                                return
            except Exception as e:
                print(e)

if __name__ == '__main__':
    main()
