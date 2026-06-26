const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run() {
  const fileOutput = execSync('dir /s /b apps\\web\\src\\*.tsx').toString();
  const files = fileOutput.split('\r\n').filter(Boolean);
  
  let updated = 0;
  
  files.forEach(f => {
    try {
      let c = fs.readFileSync(f, 'utf8');
      let nc = c
        .replace(/red-400/g, 'cyan-400')
        .replace(/red-500/g, 'cyan-500')
        .replace(/red-600/g, 'cyan-600')
        .replace(/#ef4444/gi, '#06b6d4')
        .replace(/#dc2626/gi, '#0891b2')
        .replace(/#b91c1c/gi, '#164e63')
        .replace(/#f87171/gi, '#22d3ee')
        .replace(/text-red-/g, 'text-cyan-')
        .replace(/bg-red-/g, 'bg-cyan-')
        .replace(/border-red-/g, 'border-cyan-');
        
      if (c !== nc) {
        fs.writeFileSync(f, nc);
        updated++;
        console.log('Updated ' + path.basename(f));
      }
    } catch (e) {
      console.error("Error reading file", f, e.message);
    }
  });
  
  console.log('Total updated: ' + updated);
}

run();
