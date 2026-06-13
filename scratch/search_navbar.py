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
                serialized = json.dumps(data)
                if 'Navbar.jsx' in serialized:
                    print(f"Step {data.get('step_index')} (type: {data.get('type')}, status: {data.get('status')}):")
                    # If it's a tool call to write/replace
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if 'Navbar.jsx' in json.dumps(tc):
                                print(f"  Tool Call: {tc['name']}")
                                if 'Instruction' in tc['args']:
                                    print(f"    Instruction: {tc['args']['Instruction']}")
                                if 'TargetContent' in tc['args']:
                                    print(f"    TargetContent: {repr(tc['args']['TargetContent'][:100])}")
                                if 'ReplacementContent' in tc['args']:
                                    print(f"    ReplacementContent: {repr(tc['args']['ReplacementContent'][:100])}")
                    # If it's a tool response
                    if data.get('type') == 'TOOL_RESPONSE' or 'output' in data:
                        output = data.get('content') or data.get('output') or ''
                        if 'Created At' in output:
                            print(f"  Tool response contains 'Created At', length {len(output)}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
