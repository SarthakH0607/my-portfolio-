import os
import re

def clean_lines(code_block):
    lines = code_block.split('\n')
    cleaned = []
    for line in lines:
        m = re.match(r'^(\d+):\s?(.*)$', line)
        if m:
            cleaned.append(m.group(2))
    return '\n'.join(cleaned)

def main():
    pb_file = 'decompressed.pb'
    if not os.path.exists(pb_file):
        print("decompressed.pb not found in current directory.")
        return

    print(f"Reading {pb_file}...")
    with open(pb_file, 'rb') as f:
        data_bytes = f.read()

    # Decode as utf-8, ignoring errors
    data_str = data_bytes.decode('utf-8', errors='ignore')
    print(f"Data length: {len(data_str)} characters")

    # Pattern to match complete file view blocks
    pattern = r'File Path: `file:///([^`]+)`[\s\S]*?Showing lines 1 to (\d+)[\s\S]*?The following code has been modified to include a line number before every line[^\n]*\n([\s\S]*?)The above content shows the entire, complete file contents of the requested file\.'
    
    matches = list(re.finditer(pattern, data_str))
    print(f"Found {len(matches)} matches.")
    
    file_versions = {}
    
    for idx, match in enumerate(matches):
        filepath = match.group(1).replace('\\\\', '/').replace('\\', '/')
        total_lines = int(match.group(2))
        code_block = match.group(3)
        
        filename = os.path.basename(filepath)
        cleaned_code = clean_lines(code_block)
        actual_lines = len(cleaned_code.split('\n'))
        
        if 'src/' in filepath:
            # Chronologically, later matches are newer versions
            file_versions[filepath] = cleaned_code
            print(f"Match {idx}: Found version of {filepath} ({actual_lines}/{total_lines} lines)")

    print("\nWriting restored files...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    
    for filepath, code in file_versions.items():
        rel_path = filepath
        for prefix in ['c:/Users/User/Desktop/Portfolio/', 'C:/Users/User/Desktop/Portfolio/', 'c:/users/user/desktop/portfolio/']:
            if rel_path.lower().startswith(prefix.lower()):
                rel_path = rel_path[len(prefix):]
                break
                
        dest_path = os.path.join(portfolio_root, rel_path)
        dest_path = os.path.abspath(dest_path)
        
        if dest_path.lower().startswith(portfolio_root.lower()):
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(code)
            print(f"Restored: {dest_path}")
        else:
            print(f"Skipped out-of-bounds path: {dest_path}")

if __name__ == '__main__':
    main()
