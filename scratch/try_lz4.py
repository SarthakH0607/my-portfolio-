import os
import lz4.block
import lz4.frame

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\c8196562-832e-4d55-a97f-a872ae362027.pb'
    if not os.path.exists(pb_file):
        print("PB file not found")
        return
        
    with open(pb_file, 'rb') as f:
        data = f.read()
        
    print(f"Size: {len(data)}")
    
    # Try lz4 frame
    try:
        dec = lz4.frame.decompress(data)
        print(f"Success with LZ4 frame! Size: {len(dec)}")
        return
    except Exception as e:
        print(f"LZ4 frame failed: {e}")
        
    # Try lz4 block (requires uncompressed size or we can guess)
    try:
        # try default or large size
        dec = lz4.block.decompress(data, uncompressed_size=100*1024*1024)
        print(f"Success with LZ4 block! Size: {len(dec)}")
        return
    except Exception as e:
        print(f"LZ4 block failed: {e}")

if __name__ == '__main__':
    main()
