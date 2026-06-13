const fs = require('fs');
const lf = 'C:\\Users\\User\\.gemini\\antigravity-ide\\brain\\c8196562-832e-4d55-a97f-a872ae362027\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(lf, 'utf8');
const lines = fileContent.split('\n');
for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    if (data.step_index === 2463) {
      console.log("Step 2463 content start:");
      const content = data.content || data.output || '';
      console.log(content.slice(0, 1000));
    }
  } catch (e) {}
}
