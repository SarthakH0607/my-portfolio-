import json

transcript_path = r"C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            # Find subagent console log responses
            if data.get('source') == 'SYSTEM' and 'console' in json.dumps(data).lower():
                print(f"Step {data.get('step_index')}:")
                # Look for console messages in content
                content = data.get('content', '')
                if content:
                    print(content[:1000])
                print("="*60)
        except Exception as e:
            pass
