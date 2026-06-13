import os
import re

def clean_lines(code_block):
    # Split by newline and extract code by removing "number: " prefixes
    lines = code_block.split('\n')
    cleaned = []
    for line in lines:
        m = re.match(r'^(\d+):\s?(.*)$', line)
        if m:
            cleaned.append(m.group(2))
        else:
            # If a line doesn't match the prefix but we are inside the code, keep it or skip it?
            # Usually all code lines in view_file have the "number: " prefix.
            pass
    return '\n'.join(cleaned)

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\c8196562-832e-4d55-a97f-a872ae362027.pb'
    if not os.path.exists(pb_file):
        print("Protobuf file not found.")
        return

    print(f"Reading {pb_file}...")
    with open(pb_file, 'rb') as f:
        data_bytes = f.read()

    # Decode as utf-8, ignoring errors
    data_str = data_bytes.decode('utf-8', errors='ignore')
    print(f"Data length: {len(data_str)} characters")

    # Regular expression to find complete file views in the raw logs
    # We look for:
    # File Path: `file:///...`
    # Showing lines 1 to (\d+)
    # ...
    # 1: ...
    # ...
    # The above content shows the entire, complete file contents...
    pattern = r'File Path: `file:///([^`]+)`[\s\S]*?Showing lines 1 to (\d+)[\s\S]*?The following code has been modified to include a line number before every line[^\n]*\n([\s\S]*?)The above content shows the entire, complete file contents of the requested file\.'
    
    matches = re.finditer(pattern, data_str)
    
    file_versions = {}
    
    for idx, match in enumerate(matches):
        filepath = match.group(1).replace('\\\\', '/').replace('\\', '/')
        total_lines = int(match.group(2))
        code_block = match.group(3)
        
        filename = os.path.basename(filepath)
        
        # Clean the code block
        cleaned_code = clean_lines(code_block)
        
        # Verify the number of lines matches (roughly)
        actual_lines = len(cleaned_code.split('\n'))
        
        # Only accept if it seems complete and is in src/
        if 'src/' in filepath:
            # We want to keep the LATEST version.
            # Since finditer processes matches chronologically, later matches are newer versions!
            file_versions[filepath] = cleaned_code
            print(f"Match {idx}: Found version of {filepath} ({actual_lines}/{total_lines} lines)")

    print("\nWriting restored files...")
    portfolio_root = r'C:\Users\User\Desktop\Portfolio'
    
    for filepath, code in file_versions.items():
        # Resolve path relative to Portfolio
        # E.g. c:/Users/User/Desktop/Portfolio/src/App.jsx -> src/App.jsx
        rel_path = filepath
        for prefix in ['c:/Users/User/Desktop/Portfolio/', 'C:/Users/User/Desktop/Portfolio/', 'c:/users/user/desktop/portfolio/']:
            if rel_path.lower().startswith(prefix.lower()):
                rel_path = rel_path[len(prefix):]
                break
                
        dest_path = os.path.join(portfolio_root, rel_path)
        dest_path = os.path.abspath(dest_path)
        
        # Ensure it is inside the workspace
        if dest_path.lower().startswith(portfolio_root.lower()):
            os.makedirs(os.path.dirname(dest_path), exist_ok=True)
            with open(dest_path, 'w', encoding='utf-8', newline='') as out:
                out.write(code)
            print(f"Restored: {dest_path}")
        else:
            print(f"Skipped out-of-bounds path: {dest_path}")

if __name__ == '__main__':
    main()
