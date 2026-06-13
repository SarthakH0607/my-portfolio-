const fs = require('fs');
const path = require('path');

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

function main() {
  const logFiles = [
    'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\3eb59413-e7b9-48da-ad9f-565e278c9584\\.system_generated\\logs\\transcript.jsonl',
    'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl'
  ];

  const destMappings = {
    'src/App.jsx': 'src/App.jsx',
    'src/index.css': 'src/index.css',
    'src/main.jsx': 'src/main.jsx',
    'src/components/Navbar.jsx': 'src/components/Navbar.jsx',
    'src/components/SpacePortfolioBackground.jsx': 'src/components/SpacePortfolioBackground.jsx',
    'src/components/CustomCursor.jsx': 'src/components/CustomCursor.jsx',
    'src/components/city/CentralPlaza.jsx': 'src/components/city/CentralPlaza.jsx',
    'src/components/city/CertificateMuseum.jsx': 'src/components/city/CertificateMuseum.jsx',
    'src/components/city/CityOverview.jsx': 'src/components/city/CityOverview.jsx',
    'src/components/city/ContactDistrict.jsx': 'src/components/city/ContactDistrict.jsx',
    'src/components/city/ControlCenter.jsx': 'src/components/city/ControlCenter.jsx',
    'src/components/city/GitHubPowerPlant.jsx': 'src/components/city/GitHubPowerPlant.jsx',
    'src/components/city/LearningHub.jsx': 'src/components/city/LearningHub.jsx',
    'src/components/city/ProjectDistrict.jsx': 'src/components/city/ProjectDistrict.jsx',
    'src/components/city/SkillsTower.jsx': 'src/components/city/SkillsTower.jsx',
    'src/components/city/VisionTower.jsx': 'src/components/city/VisionTower.jsx',
    'src/components/scenes/CityArrival.jsx': 'src/components/scenes/CityArrival.jsx',
    'src/components/scenes/DeepSpace.jsx': 'src/components/scenes/DeepSpace.jsx',
    'src/components/scenes/EarthZoom.jsx': 'src/components/scenes/EarthZoom.jsx',
    'src/components/ui/GlassCard.jsx': 'src/components/ui/GlassCard.jsx',
    'src/components/ui/HolographicPanel.jsx': 'src/components/ui/HolographicPanel.jsx',
    'src/components/ui/NeonText.jsx': 'src/components/ui/NeonText.jsx',
    'src/data/certificates.js': 'src/data/certificates.js',
    'src/data/projects.js': 'src/data/projects.js',
    'src/data/skills.js': 'src/data/skills.js',
    'src/hooks/useInView.js': 'src/hooks/useInView.js'
  };

  const fileVersions = {};
  for (const t of Object.keys(destMappings)) {
    fileVersions[t] = [];
  }

  for (const lf of logFiles) {
    if (!fs.existsSync(lf)) continue;
    console.log(`Reading ${lf}...`);
    const fileContent = fs.readFileSync(lf, 'utf8');
    const lines = fileContent.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        const stepIdx = data.step_index;
        
        // Skip corrupted steps after step 2490 in the second log
        if (lf.includes('c8196562') && stepIdx >= 2490) continue;
        
        // 1. Process write_to_file
        if (data.tool_calls && Array.isArray(data.tool_calls)) {
          for (const tc of data.tool_calls) {
            if (tc.name === 'write_to_file') {
              const targetPath = tc.args.TargetFile || '';
              const normalizedPath = targetPath.toLowerCase().replace(/\\/g, '/');
              
              let matchedKey = null;
              for (const key of Object.keys(destMappings)) {
                if (normalizedPath.endsWith(key.toLowerCase())) {
                  matchedKey = key;
                  break;
                }
              }
              
              if (matchedKey) {
                const code = tc.args.CodeContent || '';
                if (code && !code.includes('<truncated')) {
                  const cleaned = cleanCode(code);
                  if (cleaned && !cleaned.includes('<truncated') && !cleaned.includes('// MISSING LINE')) {
                    fileVersions[matchedKey].push({
                      content: cleaned,
                      step: stepIdx,
                      log: path.basename(lf),
                      type: 'write_to_file'
                    });
                  }
                }
              }
            }
          }
        }
        
        // 2. Process view_file responses
        const content = data.content || data.output || '';
        if (content) {
          const matchPath = content.match(/File Path: `file:\/\/\/(.*)`/);
          if (matchPath) {
            const filepath = matchPath[1].replace(/"/g, '').trim();
            const normalizedPath = filepath.toLowerCase().replace(/\\/g, '/');
            
            let matchedKey = null;
            for (const key of Object.keys(destMappings)) {
              if (normalizedPath.endsWith(key.toLowerCase())) {
                matchedKey = key;
                break;
              }
            }
            
            if (matchedKey) {
              const matchShowing = content.match(/Showing lines 1 to (\d+)/);
              const hasFooter = content.includes("shows the entire, complete file contents");
              if (matchShowing && hasFooter) {
                const cleaned = cleanCode(content);
                if (cleaned && !cleaned.includes('<truncated') && !cleaned.includes('// MISSING LINE')) {
                  fileVersions[matchedKey].push({
                    content: cleaned,
                    step: stepIdx,
                    log: path.basename(lf),
                    type: 'view_file'
                  });
                }
              }
            }
          }
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }

  console.log("\nWriting restored files to src/...");
  const portfolioRoot = 'C:\\Users\\User\\Desktop\\Portfolio';
  
  for (const [key, destRelPath] of Object.entries(destMappings)) {
    const versions = fileVersions[key];
    if (versions && versions.length > 0) {
      // Sort versions: second log has priority over first, higher step has priority
      versions.sort((a, b) => {
        const logPriA = a.log.includes('c8196562') ? 1 : 0;
        const logPriB = b.log.includes('c8196562') ? 1 : 0;
        if (logPriA !== logPriB) return logPriA - logPriB;
        return a.step - b.step;
      });
      
      const bestVer = versions[versions.length - 1];
      const destPath = path.join(portfolioRoot, destRelPath);
      
      let content = bestVer.content;
      if (key === 'src/index.css') {
        content = content.replace(/line-height:\n/g, 'line-height: 1.2;\n');
        content = content.replace(/line-height:\r\n/g, 'line-height: 1.2;\r\n');
      }
      
      console.log(`Restoring ${key} (from ${bestVer.log} Step ${bestVer.step} via ${bestVer.type}, len ${content.length}) -> ${destPath}`);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, content, 'utf8');
    } else {
      console.log(`WARNING: Could not find any valid version for ${key}`);
    }
  }
}

main();
