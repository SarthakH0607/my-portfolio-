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
                
                # Check tool calls
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        if tc['name'] in ('write_to_file', 'replace_file_content', 'multi_replace_file_content'):
                            target_path = tc['args'].get('TargetFile', '')
                            if 'Navbar.jsx' in target_path:
                                print(f"Step {step_idx}: Tool Call {tc['name']} targeting {target_path}")
                                if 'CodeContent' in tc['args']:
                                    print(f"  CodeContent length: {len(tc['args']['CodeContent'])}")
                                    # Print first 200 and last 200 chars
                                    print("  Start:", repr(tc['args']['CodeContent'][:150]))
                                    print("  End:", repr(tc['args']['CodeContent'][-150:]))
                                if 'ReplacementContent' in tc['args']:
                                    print(f"  ReplacementContent length: {len(tc['args']['ReplacementContent'])}")
                                if 'ReplacementChunks' in tc['args']:
                                    print(f"  ReplacementChunks count: {len(tc['args']['ReplacementChunks'])}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
