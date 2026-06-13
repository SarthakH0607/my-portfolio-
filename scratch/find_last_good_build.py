import os
import re

def main():
    task_dir = r'C:\Users\User\.gemini\antigravity-ide\brain\c8196562-832e-4d55-a97f-a872ae362027\.system_generated\tasks'
    if not os.path.exists(task_dir):
        print("Task directory not found")
        return
        
    logs = [f for f in os.listdir(task_dir) if f.endswith('.log')]
    print(f"Total task logs: {len(logs)}")
    
    good_builds = []
    
    for log in logs:
        path = os.path.join(task_dir, log)
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            # Check if this log is for npm run build or vite build
            if ('vite build' in content or 'npm run build' in content) and 'completed successfully' in content:
                # Extract step index or task ID
                task_id_match = re.search(r'task-(\d+)', log)
                task_id = task_id_match.group(1) if task_id_match else log
                print(f"Found successful build log: {log} (Task {task_id})")
                good_builds.append((task_id, len(content)))
                
if __name__ == '__main__':
    main()
