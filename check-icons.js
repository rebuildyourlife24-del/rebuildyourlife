const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lucideImports = content.match(/import\s+{([^}]+)}\s+from\s+['"]lucide-react['"]/g);
  if (!lucideImports) return;

  lucideImports.forEach(importStmt => {
    const match = importStmt.match(/{([^}]+)}/);
    if (match) {
      const icons = match[1].split(',').map(i => i.trim());
      icons.forEach(icon => {
        if (!icon) return;
        // Handle 'Icon as Alias'
        let iconName = icon;
        if (icon.includes(' as ')) {
            iconName = icon.split(' as ')[0].trim();
        }
        if (!lucide[iconName]) {
          console.error(`ERROR: Icon ${iconName} not found in lucide-react (File: ${filePath})`);
        }
      });
    }
  });
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      checkFile(fullPath);
    }
  });
}

walkDir(path.join(__dirname, 'apps/web/src'));
console.log('Lucide icon check complete.');
