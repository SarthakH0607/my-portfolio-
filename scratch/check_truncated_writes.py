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
                if step_idx < 1945:
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if tc['name'] in ['write_to_file', 'replace_file_content', 'multi_replace_file_content']:
                                serialized = json.dumps(tc)
                                if 'truncated' in serialized.lower():
                                    target = tc['args'].get('AbsolutePath') or tc['args'].get('TargetFile') or ''
                                    print(f"Step {step_idx}: Truncated tool call {tc['name']} on {os.path.basename(target)}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
