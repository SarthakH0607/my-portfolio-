import os

def clean_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Skipping {filepath} due to read error: {e}")
        return

    header_end_marker = "The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space."
    footer_marker = "The above content shows the entire, complete file contents of the requested file."

    if header_end_marker in content:
        idx_header = content.find(header_end_marker) + len(header_end_marker)
        code_part = content[idx_header:].lstrip('\r\n')
        
        if footer_marker in code_part:
            idx_footer = code_part.rfind(footer_marker)
            code_part = code_part[:idx_footer].rstrip('\r\n')
        
        # Write clean code back
        try:
            with open(filepath, 'w', encoding='utf-8', newline='') as f:
                f.write(code_part)
            print(f"CLEANED: {filepath}")
        except Exception as e:
            print(f"Failed to write to {filepath}: {e}")

def main():
    src_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src'))
    print(f"Scanning directory: {src_dir}")
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            filepath = os.path.join(root, file)
            clean_file(filepath)

if __name__ == '__main__':
    main()
