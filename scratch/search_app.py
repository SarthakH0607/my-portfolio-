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
                if step_idx >= 1820:
                    continue
                if 'tool_calls' in data and data['tool_calls']:
                    for tc in data['tool_calls']:
                        target = tc['args'].get('TargetFile', '')
                        if 'App.jsx' in target:
                            print(f"Step {step_idx} ({tc['name']}):")
                            print(f"  args keys: {list(tc['args'].keys())}")
                            if 'CodeContent' in tc['args']:
                                print(f"  CodeContent start: {repr(tc['args']['CodeContent'][:100])}")
                            if 'TargetContent' in tc['args']:
                                print(f"  TargetContent: {repr(tc['args']['TargetContent'])}")
                            if 'ReplacementContent' in tc['args']:
                                print(f"  ReplacementContent: {repr(tc['args']['ReplacementContent'])}")
                            if 'ReplacementChunks' in tc['args']:
                                print(f"  ReplacementChunks: {repr(tc['args']['ReplacementChunks'][:100])}")
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
