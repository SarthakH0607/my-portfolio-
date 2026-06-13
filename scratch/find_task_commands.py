import json
import os

def main():
    log_file = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\logs\transcript.jsonl'
    if not os.path.exists(log_file):
        return

    task_commands = {}
    with open(log_file, 'r', encoding='utf-8') as f:
        for line in f:
            if not line.strip():
                continue
            try:
                data = json.loads(line)
                content = data.get('content') or ''
                if 'background task with task id:' in content:
                    # Parse task ID and description
                    m_id = re.search(r'task id: ([^\s\n]+)', content)
                    m_desc = re.search(r'Task Description: ([^\n]+)', content)
                    if m_id and m_desc:
                        task_commands[m_id.group(1)] = m_desc.group(1)
            except Exception as e:
                pass

    tasks_dir = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\tasks'
    if os.path.exists(tasks_dir):
        for file in sorted(os.listdir(tasks_dir)):
            if file.endswith('.log'):
                task_id = f"c8196562-832e-4d55-a97f-a872ae362027/{file[:-4]}"
                cmd = task_commands.get(task_id, "Unknown")
                size = os.path.getsize(os.path.join(tasks_dir, file))
                print(f"Task Log: {file} (size {size} bytes) -> Command: {cmd}")

if __name__ == '__main__':
    import re
    main()
