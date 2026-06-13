import json
import os

def main():
    brain_dir = r'C:\Users\User\.gemini\antigravity-ide\brain'
    if not os.path.exists(brain_dir):
        print("Brain dir not found")
        return
        
    conv_ids = [d for d in os.listdir(brain_dir) if os.path.isdir(os.path.join(brain_dir, d))]
    
    for cid in conv_ids:
        log_path = os.path.join(brain_dir, cid, '.system_generated', 'logs', 'transcript.jsonl')
        if not os.path.exists(log_path):
            continue
            
        with open(log_path, 'r', encoding='utf-8') as f:
            for line in f:
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                    content = data.get('content') or ''
                    # If it's a user message, check for solar system mentions
                    if data.get('source') == 'USER_EXPLICIT' and ('solar' in content.lower() or 'remove' in content.lower()):
                        print(f"[{cid}] Step {data.get('step_index')} USER: {content}")
                    # If it's a planner response or system message, look for solar system changes
                    elif data.get('source') == 'MODEL' and 'solar' in content.lower() and ('remove' in content.lower() or 'delete' in content.lower() or 'vanilla' in content.lower()):
                        print(f"[{cid}] Step {data.get('step_index')} MODEL: {content[:150]}...")
                except Exception as e:
                    pass

if __name__ == '__main__':
    main()
