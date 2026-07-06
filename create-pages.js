const fs = require('fs');
const path = require('path');

const dirs = [
  'digital-products', 
  'saas', 
  'trading', 
  'agency', 
  'coaching', 
  'memberships', 
  'content', 
  'lead-gen'
];

dirs.forEach(dir => {
  const dirPath = path.join('apps', 'web', 'src', 'app', 'dashboard', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const title = dir.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  const content = `import { Construction } from 'lucide-react';

export default function Page() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Construction className="w-16 h-16 text-emerald-500 mb-6" />
      <h1 className="text-3xl font-bold text-white mb-4">${title} Module</h1>
      <p className="text-emerald-300 max-w-md">Deze verdienmodel module wordt momenteel gekoppeld aan uw AI-agenten. Kom binnenkort terug voor de volledige functionaliteit.</p>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
  console.log('Created page for', dir);
});
