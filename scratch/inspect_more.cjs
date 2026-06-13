const fs = require('fs');
const path = require('path');

const log2 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl';

function cleanCode(content) {
  if (!content) return content;
  const headerEndMarker = "The following code has been modified to include a line number before every line";
  const footerMarker = "The above content shows the entire, complete file contents";
  
  if (content.includes(headerEndMarker)) {
    const idxHeader = content.indexOf(headerEndMarker);
    const lineEnd = content.indexOf('\n', idxHeader);
    let codePart = (lineEnd !== -1) ? content.slice(lineEnd).trimStart() : content.slice(idxHeader + headerEndMarker.length).trimStart();
    
    if (codePart.includes(footerMarker)) {
      const idxFooter = codePart.lastIndexOf(footerMarker);
      const lineStart = codePart.lastIndexOf('\n', idxFooter);
      codePart = (lineStart !== -1) ? codePart.slice(0, lineStart).trimEnd() : codePart.slice(0, idxFooter).trimEnd();
    }
    
    const lines = codePart.split('\n');
    const cleanedLines = lines.map(line => {
      const match = line.match(/^(\d+):\s?(.*)$/);
      return match ? match[2] : line;
    });
    return cleanedLines.join('\n');
  }
  return content;
}

const steps = [
  { log: log2, step: 1315, file: 'VisionTower.jsx', label: 'vision_1315' },
  { log: log2, step: 683, file: 'VisionTower.jsx', label: 'vision_683' }
];

for (const item of steps) {
  if (!fs.existsSync(item.log)) continue;
  const content = fs.readFileSync(item.log, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      if (data.step_index === item.step) {
        const text = data.content || data.output || '';
        if (text && text.includes(item.file)) {
          const cleaned = cleanCode(text);
          fs.writeFileSync(`c:\\Users\\User\\Desktop\\Portfolio\\scratch\\${item.label}.txt`, cleaned, 'utf8');
          console.log(`Wrote step ${item.step} (${item.file}) to scratch/${item.label}.txt`);
        }
      }
    } catch (e) {}
  }
}
