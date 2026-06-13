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

function isCleanJSX(filename, content) {
  content = content.trim();
  if (!content) return false;
  if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
    if (content.startsWith('#') || content.startsWith('::') || content.startsWith('1: #') || content.includes('# Walkthrough') || content.includes('# Portfolio')) {
      return false;
    }
    if (content.includes('Walkthrough:') || content.includes('Changes Made:')) {
      return false;
    }
    if (content.includes('Traceback (most recent call last):')) {
      return false;
    }
    if (content.startsWith('.gitignore') || content.startsWith('dist\\')) {
      return false;
    }
  }
  return true;
}

function extractBestFromLogs(logFiles, filename, destMappings) {
  const versions = [];
  const targetRel = destMappings[filename].replace(/\\/g, '/');
  for (const lf of logFiles) {
    if (!fs.existsSync(lf)) continue;
    const fileContent = fs.readFileSync(lf, 'utf8');
    const lines = fileContent.split('\n');
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const data = JSON.parse(line);
        const step = data.step_index;
        
        // 1. Process write_to_file
        if (data.tool_calls && Array.isArray(data.tool_calls)) {
          for (const tc of data.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args.TargetFile) {
              const targetPath = tc.args.TargetFile.replace(/\\/g, '/').replace(/"/g, '').trim();
              if (targetPath.endsWith(targetRel)) {
                const code = tc.args.CodeContent || '';
                if (code && !code.includes('<truncated') && code.length > 100) {
                  const cleaned = cleanCode(code);
                  if (isCleanJSX(filename, cleaned)) {
                    versions.push({ content: cleaned, step, log: path.basename(lf) });
                  }
                }
              }
            }
          }
        }
        
        // 2. Process view_file response
        const content = data.content || data.output || '';
        if (content) {
          const contentLines = content.split('\n');
          let viewedFilepath = null;
          for (let i = 0; i < Math.min(contentLines.length, 5); i++) {
            const matchPath = contentLines[i].match(/File Path: `file:\/\/\/(.*)`/);
            if (matchPath) {
              viewedFilepath = matchPath[1].replace(/"/g, '').trim();
              break;
            }
          }
          if (viewedFilepath) {
            const cleanPath = viewedFilepath.replace(/\\/g, '/');
            if (cleanPath.endsWith(targetRel)) {
              const matchShowing = content.match(/Showing lines 1 to (\d+)/);
              const hasFooter = content.includes("shows the entire, complete file contents");
              if (matchShowing && hasFooter && !content.includes('<truncated')) {
                const cleaned = cleanCode(content);
                if (isCleanJSX(filename, cleaned)) {
                  versions.push({ content: cleaned, step, log: path.basename(lf) });
                }
              }
            }
          }
        }
      } catch (e) {}
    }
  }
  
  if (versions.length > 0) {
    // Sort by content length to get the most complete version
    versions.sort((a, b) => a.content.length - b.content.length);
    const best = versions[versions.length - 1];
    console.log(`[LOG MATCH] Best version for ${filename} found in ${best.log} step ${best.step} (len: ${best.content.length})`);
    return best.content;
  }
  return null;
}

function main() {
  const portfolioRoot = 'C:\\Users\\User\\Desktop\\Portfolio';
  const srcBackupDir = path.join(portfolioRoot, 'scratch', 'recovered_last');
  const log2 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl';
  const log1 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\3eb59413-e7b9-48da-ad9f-565e278c9584\\.system_generated\\logs\\transcript.jsonl';
  const log3 = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\594ce594-ccd5-4f84-9b83-30d44ac9383d\\.system_generated\\logs\\transcript.jsonl';

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

  const logFiles = [log1, log2];

  for (const [filename, relPath] of Object.entries(destMappings)) {
    const destPath = path.join(portfolioRoot, relPath);
    const backupPath = path.join(srcBackupDir, filename);
    
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    
    // Extract the best untruncated version of this file across all logs
    let content = extractBestFromLogs(logFiles, filename, destMappings);
    
    if (content) {
      if (content.startsWith('"') && content.endsWith('"')) {
        try {
          content = JSON.parse(content);
        } catch (e) {
          content = content.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"');
        }
      }
      if (filename === 'index.css') {
        content = content.replace(/line-height:\n/g, 'line-height: 1.2;\n');
        content = content.replace(/line-height:\r\n/g, 'line-height: 1.2;\r\n');
      }
      console.log(`Restored ${filename} from log -> ${destPath}`);
      fs.writeFileSync(destPath, content, 'utf8');
    } else if (fs.existsSync(backupPath)) {
      let bContent = fs.readFileSync(backupPath, 'utf8');
      if (bContent.startsWith('"') && bContent.endsWith('"')) {
        try {
          bContent = JSON.parse(bContent);
        } catch (e) {
          bContent = bContent.slice(1, -1).replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"');
        }
      }
      if (filename === 'index.css') {
        bContent = bContent.replace(/line-height:\n/g, 'line-height: 1.2;\n');
        bContent = bContent.replace(/line-height:\r\n/g, 'line-height: 1.2;\r\n');
      }
      console.log(`Copied from backup: ${filename} -> ${destPath}`);
      fs.writeFileSync(destPath, bContent, 'utf8');
    } else {
      console.log(`WARNING: Could not find version for ${filename}`);
    }
  }
}

main();
