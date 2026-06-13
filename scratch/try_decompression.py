import os
import zlib
import bz2
import lzma

def main():
    pb_file = r'C:\Users\User\.gemini\antigravity-ide\conversations\c8196562-832e-4d55-a97f-a872ae362027.pb'
    if not os.path.exists(pb_file):
        print("PB file not found")
        return
        
    with open(pb_file, 'rb') as f:
        data = f.read()
        
    print(f"Size: {len(data)}")
    
    # Try zlib with different wbits
    for wbits in [zlib.MAX_WBITS, -zlib.MAX_WBITS, zlib.MAX_WBITS + 16, zlib.MAX_WBITS + 32]:
        try:
            dec = zlib.decompress(data, wbits)
            print(f"Success with wbits {wbits}! Size: {len(dec)}")
            return
        except Exception as e:
            pass
            
    # Try bz2
    try:
        dec = bz2.decompress(data)
        print(f"Success with bz2! Size: {len(dec)}")
        return
    except Exception as e:
        pass
        
    # Try lzma
    try:
        dec = lzma.decompress(data)
        print(f"Success with lzma! Size: {len(dec)}")
        return
    except Exception as e:
        pass

    print("All standard decompression failed.")

if __name__ == '__main__':
    main()
