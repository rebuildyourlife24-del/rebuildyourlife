const fs = require('fs');
const path = require('path');
const dir = './apps/web/src/app/actions';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if(!f.endsWith('.ts')) return;
  const p = path.join(dir, f);
  let text = fs.readFileSync(p, 'utf-8');
  if(text.includes('requireAuth')) {
    text = text.replace(/import\s*\{\s*requireAuth\s*\}\s*from\s*['"]@\/lib\/auth['"];?/g, "import { getSessionAction } from '@/app/actions/auth';");
    text = text.replace(/const\s+(\w+)\s*=\s*await\s+requireAuth\(\);?/g, "const session = await getSessionAction();\n    const $1 = session.success ? session.user : null;");
    fs.writeFileSync(p, text);
    console.log('Fixed', f);
  }
});
