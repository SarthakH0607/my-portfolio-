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
                
                if 'SpacePortfolioBackground.jsx' in serialized:
                    print(f"Step {step_idx} ({data.get('type')}):")
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if 'SpacePortfolioBackground.jsx' in json.dumps(tc):
                                print(f"  Tool Call: {tc['name']}")
                                if 'Instruction' in tc['args']:
                                    print(f"    Instruction: {tc['args']['Instruction']}")
                                if tc['name'] == 'write_to_file':
                                    content = tc['args'].get('CodeContent', '')
                                    print(f"    CodeContent length: {len(content)}")
                    if data.get('type') == 'VIEW_FILE' and 'content' in data:
                        print(f"  VIEW_FILE content length: {len(data['content'])}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
