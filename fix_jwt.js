const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

walk('apps/web/src', (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace fallbacks
    content = content.replace(/const JWT_SECRET = process\.env\.JWT_SECRET \|\| ['"][^'"]+['"];/g, "const JWT_SECRET = process.env.JWT_SECRET as string;\nif (!JWT_SECRET) throw new Error('JWT_SECRET is missing');");
    
    if (original !== content) {
      console.log('Fixed:', filePath);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
});
