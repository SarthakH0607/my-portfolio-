import json
import os

def main():
    transcript_path = r"C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl"
    if not os.path.exists(transcript_path):
        print("Transcript not found")
        return
        
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'CAPTURE_BROWSER_CONSOLE_LOGS' or data.get('type') == 'CAPTURE_CONSOLE_LOGS' or 'capture_browser_console_logs' in json.dumps(data):
                    print(f"Step {data.get('step_index')}:")
                    print(json.dumps(data.get('output') or data.get('content'), indent=2))
                    print("="*60)
            except Exception as e:
                pass

if __name__ == '__main__':
    main()
