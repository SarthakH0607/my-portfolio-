const fs = require('fs');
const path = require('path');

const log1 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\3eb59413-e7b9-48da-ad9f-565e278c9584\\.system_generated\\logs\\transcript.jsonl';
const log2 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl';
const logFiles = [log1, log2];

const destMappings = {
  'App.jsx': 'src/App.jsx',
  'index.css': 'src/index.css',
  'main.jsx': 'src/main.jsx',
  'Navbar.jsx': 'src/components/Navbar.jsx',
  'SpacePortfolioBackground.jsx': 'src/components/SpacePortfolioBackground.jsx',
  'CustomCursor.jsx': 'src/components/CustomCursor.jsx',
  'CentralPlaza.jsx': 'src/components/city/CentralPlaza.jsx',
  'CertificateMuseum.jsx': 'src/components/city/CertificateMuseum.jsx',
  'CityOverview.jsx': 'src/components/city/CityOverview.jsx',
  'ContactDistrict.jsx': 'src/components/city/ContactDistrict.jsx',
  'ControlCenter.jsx': 'src/components/city/ControlCenter.jsx',
  'GitHubPowerPlant.jsx': 'src/components/city/GitHubPowerPlant.jsx',
  'LearningHub.jsx': 'src/components/city/LearningHub.jsx',
  'ProjectDistrict.jsx': 'src/components/city/ProjectDistrict.jsx',
  'SkillsTower.jsx': 'src/components/city/SkillsTower.jsx',
  'VisionTower.jsx': 'src/components/city/VisionTower.jsx',
  'CityArrival.jsx': 'src/components/scenes/CityArrival.jsx',
  'DeepSpace.jsx': 'src/components/scenes/DeepSpace.jsx',
  'EarthZoom.jsx': 'src/components/scenes/EarthZoom.jsx',
  'GlassCard.jsx': 'src/components/ui/GlassCard.jsx',
  'HolographicPanel.jsx': 'src/components/ui/HolographicPanel.jsx',
  'NeonText.jsx': 'src/components/ui/NeonText.jsx',
  'certificates.js': 'src/data/certificates.js',
  'projects.js': 'src/data/projects.js',
  'skills.js': 'src/data/skills.js',
  'useInView.js': 'src/hooks/useInView.js'
};

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

let report = '';
function log(msg) {
  report += msg + '\n';
  console.log(msg);
}

for (const filename of Object.keys(destMappings)) {
  log(`\n======================================================================`);
  log(`CANDIDATES FOR: ${filename}`);
  log(`======================================================================`);
  
  const candidates = [];
  
  for (const lf of logFiles) {
    if (!fs.existsSync(lf)) continue;
    const fileContent = fs.readFileSync(lf, 'utf8');
    const lines = fileContent.split('\n');
    const logName = path.basename(lf);
    
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        const step = data.step_index;
        
        // 1. Process write_to_file
        if (data.tool_calls && Array.isArray(data.tool_calls)) {
          for (const tc of data.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.endsWith(filename)) {
              const rawCode = tc.args.CodeContent || '';
              const cleaned = cleanCode(rawCode);
              candidates.push({
                source: 'write_to_file',
                step,
                logName,
                length: cleaned.length,
                content: cleaned
              });
            }
          }
        }
        
        // 2. Process view_file response
        const content = data.content || data.output || '';
        if (content && content.includes(filename)) {
          const hasHeader = content.includes("The following code has been modified to include a line number");
          const hasFooter = content.includes("shows the entire, complete file contents");
          
          if (hasHeader && hasFooter) {
            const cleaned = cleanCode(content);
            // Verify this is not a directory listing
            if (cleaned.includes('.gitignore') && cleaned.includes('package.json') && filename !== 'package.json') {
              // Obvious file list, skip
              continue;
            }
            candidates.push({
              source: 'view_file',
              step,
              logName,
              length: cleaned.length,
              content: cleaned
            });
          }
        }
      } catch (e) {}
    }
  }
  
  // Rank and print candidates
  if (candidates.length === 0) {
    log('  No candidates found!');
    continue;
  }
  
  // Sort candidates: first by length, descending
  candidates.sort((a, b) => b.length - a.length);
  
  log(`  Found ${candidates.length} candidate(s):`);
  candidates.forEach((c, idx) => {
    const isTruncated = c.content.includes('<truncated') || c.content.includes('// MISSING LINE');
    log(`  [${idx + 1}] Log: ${c.logName}, Step: ${c.step}, Src: ${c.source}, Len: ${c.length}, Truncated: ${isTruncated}`);
    const head = c.content.slice(0, 150).replace(/\r?\n/g, '\\n');
    const tail = c.content.slice(-150).replace(/\r?\n/g, '\\n');
    log(`      HEAD: ${head}`);
    log(`      TAIL: ${tail}`);
  });
}

fs.writeFileSync('c:\\Users\\User\\Desktop\\Portfolio\\scratch\\candidates.txt', report, 'utf8');
log(`\nReport written to scratch/candidates.txt`);
