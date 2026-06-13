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
                if step_idx == 1956:
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] == 'write_to_file' and 'App.jsx' in tc['args'].get('TargetFile', ''):
                                code = tc['args'].get('CodeContent', '')
                                print("Code length in step 1956:", len(code))
                                print("Start of code:", repr(code[:100]))
                                print("End of code:", repr(code[-100:]))
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
