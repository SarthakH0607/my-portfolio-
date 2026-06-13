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
                if step_idx in [2497, 2498, 2499, 2512, 2513, 2514]:
                    print(f"Step {step_idx}:")
                    # Check tool calls
                    if 'tool_calls' in data and data['tool_calls']:
                        for tc in data['tool_calls']:
                            if 'read-header.cjs' in json.dumps(tc):
                                print(f"  Tool Call Name: {tc['name']}")
                                print(f"  Args: {json.dumps(tc['args'], indent=2)}")
                    if 'content' in data:
                        print(f"  Content: {data['content'][:500]}")
                    print("-" * 50)
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
