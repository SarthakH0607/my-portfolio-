const fs = require('fs');
const path = require('path');

const log1 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\3eb59413-e7b9-48da-ad9f-565e278c9584\\.system_generated\\logs\\transcript.jsonl';
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

const stepsToInspect = [
  { log: log2, step: 630, file: 'Navbar.jsx', label: 'navbar_630' },
  { log: log2, step: 1771, file: 'Navbar.jsx', label: 'navbar_1771' },
  { log: log2, step: 784, file: 'SpacePortfolioBackground.jsx', label: 'background_784' },
  { log: log2, step: 622, file: 'SpacePortfolioBackground.jsx', label: 'background_622' },
  { log: log2, step: 23, file: 'VisionTower.jsx', label: 'vision_23' },
  { log: log2, step: 2336, file: 'VisionTower.jsx', label: 'vision_2336' }
];

for (const item of stepsToInspect) {
  if (!fs.existsSync(item.log)) continue;
  const content = fs.readFileSync(item.log, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      if (data.step_index === item.step) {
        // Find if this step contains the file
        const text = data.content || data.output || '';
        if (text && text.includes(item.file)) {
          const cleaned = cleanCode(text);
          const destFile = `c:\\Users\\User\\Desktop\\Portfolio\\scratch\\${item.label}.txt`;
          fs.writeFileSync(destFile, cleaned, 'utf8');
          console.log(`Wrote step ${item.step} (${item.file}) to ${destFile} (length: ${cleaned.length})`);
        }
      }
    } catch (e) {}
  }
}
