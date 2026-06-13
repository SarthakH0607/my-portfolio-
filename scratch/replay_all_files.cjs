const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl';
if (!fs.existsSync(logFile)) {
  console.log("Log file does not exist");
  process.exit(1);
}

const lines = fs.readFileSync(logFile, 'utf8').split('\n');

const files = {};

function cleanPath(val) {
  if (typeof val === 'string') {
    if (val.startsWith('"') && val.endsWith('"')) {
      try {
        val = JSON.parse(val);
      } catch (e) {
        val = val.slice(1, -1);
      }
    }
  }
  return val;
}

function cleanValue(val) {
  if (typeof val !== 'string') return val;
  
  let prev;
  let iterations = 0;
  // Limit iterations to prevent any infinite loops
  while (iterations < 5) {
    prev = val;
    
    // 1. Strip surrounding quotes if present
    if (val.startsWith('"') && val.endsWith('"')) {
      try {
        val = JSON.parse(val);
      } catch (e) {
        val = val.slice(1, -1);
      }
    }
    
    // 2. Perform manual unescaping if the string contains escaped sequences
    if (val.includes('\\n') || val.includes('\\t') || val.includes('\\r') || val.includes('\\"') || val.includes('\\\\')) {
      val = val
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }
    
    if (val === prev) {
      break;
    }
    iterations++;
  }
  
  return val;
}

function safeParseJSON(str) {
  let insideString = false;
  let escaped = false;
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && !escaped) {
      insideString = !insideString;
      result += char;
    } else if (insideString) {
      if (char === '\\') {
        escaped = !escaped;
        result += char;
      } else {
        escaped = false;
        if (char === '\n') {
          result += '\\n';
        } else if (char === '\r') {
          result += '\\r';
        } else if (char === '\t') {
          result += '\\t';
        } else {
          result += char;
        }
      }
    } else {
      escaped = false;
      result += char;
    }
  }
  return JSON.parse(result);
}

lines.forEach((line, index) => {
  if (!line) return;
  try {
    const data = JSON.parse(line);
    // Replay all steps before the ruin started (Step 1820)
    if (data.step_index >= 1820) return;
    if (!data.tool_calls) return;
    
    data.tool_calls.forEach(tc => {
      const args = tc.args || {};
      let targetFile = args.TargetFile || args.targetFile || '';
      if (!targetFile) return;
      
      targetFile = cleanPath(targetFile);
      const normalizedPath = path.resolve(targetFile);
      
      if (tc.name === 'write_to_file') {
        const content = cleanValue(args.CodeContent || args.codeContent || '');
        files[normalizedPath] = content;
      } else if (tc.name === 'replace_file_content') {
        const target = cleanValue(args.TargetContent || args.targetContent || '');
        const replacement = cleanValue(args.ReplacementContent || args.replacementContent || '');
        let current = files[normalizedPath] || '';
        
        if (current.includes(target)) {
          files[normalizedPath] = current.replace(target, replacement);
        } else {
          // Try with cleaned targets
          const cleanCur = cleanValue(current);
          const cleanTar = cleanValue(target);
          const cleanRep = cleanValue(replacement);
          if (cleanCur.includes(cleanTar)) {
            files[normalizedPath] = cleanCur.replace(cleanTar, cleanRep);
          }
        }
      } else if (tc.name === 'multi_replace_file_content') {
        let chunks = args.ReplacementChunks || args.replacementChunks || [];
        if (typeof chunks === 'string') {
          try {
            chunks = safeParseJSON(cleanValue(chunks));
          } catch(e) {
            try {
              chunks = safeParseJSON(chunks);
            } catch(err) {
              return;
            }
          }
        }
        
        let current = files[normalizedPath] || '';
        let success = true;
        
        chunks.forEach((chunk, i) => {
          const target = cleanValue(chunk.TargetContent || chunk.targetContent || '');
          const replacement = cleanValue(chunk.ReplacementContent || chunk.replacementContent || '');
          if (current.includes(target)) {
            const index = current.indexOf(target);
            current = current.slice(0, index) + replacement + current.slice(index + target.length);
          } else {
            const cleanCur = cleanValue(current);
            const cleanTar = cleanValue(target);
            const cleanRep = cleanValue(replacement);
            if (cleanCur.includes(cleanTar)) {
              const index = cleanCur.indexOf(cleanTar);
              current = cleanCur.slice(0, index) + cleanRep + cleanCur.slice(index + cleanTar.length);
            } else {
              success = false;
            }
          }
        });
        
        if (success) {
          files[normalizedPath] = current;
        }
      }
    });
  } catch (e) {
    // ignore
  }
});

// Write all reconstructed files back to workspace
Object.keys(files).forEach(filePath => {
  const relPath = path.relative('C:\\Users\\User\\Desktop\\Portfolio', filePath);
  if (!relPath.startsWith('..') && !path.isAbsolute(relPath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const finalContent = cleanValue(files[filePath]);
    fs.writeFileSync(filePath, finalContent, 'utf8');
    console.log(`Successfully restored reconstructed file to ${relPath}`);
  }
});
