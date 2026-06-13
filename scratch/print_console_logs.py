import json

transcript_path = r"C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if "capture_browser_console_logs" in json.dumps(data) or "CAPTURE_CONSOLE_LOGS" in json.dumps(data):
                print(f"Step {data.get('step_index')}:")
                print(json.dumps(data, indent=2))
                print("="*60)
        except Exception as e:
            pass
