const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('apps/web/src');
let changed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  // Replace variable.trim() with variable?.trim()
  newContent = newContent.replace(/([a-zA-Z0-9_]+)\.trim\(\)/g, '$1?.trim()');
  
  // Replace array[index].trim() with array[index]?.trim()
  newContent = newContent.replace(/\]\.trim\(\)/g, ']?.trim()');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    changed++;
    console.log('Patched', file);
  }
});
console.log('Total files patched:', changed);
