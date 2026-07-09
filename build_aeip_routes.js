const fs = require('fs');
const path = require('path');

const routes = ['syndicaat', 'kluis', 'architectuur', 'instellingen'];
const dashboardDir = path.join(__dirname, 'apps', 'web', 'src', 'app', 'dashboard');

const template = `import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function {ComponentName}Page() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="glass-panel p-12 max-w-lg w-full flex flex-col items-center gap-6 rounded-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-blue-500/20 rounded-tl-2xl"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-blue-500/20 rounded-br-2xl"></div>
        
        <div className="w-20 h-20 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
           <ShieldAlert size={32} className="text-blue-400" />
           <div className="absolute inset-0 border border-blue-400/50 rounded-full animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent"></div>
        </div>
        
        <h1 className="text-2xl font-bold uppercase tracking-widest text-white relative z-10">{Title} Module</h1>
        <p className="text-zinc-400 text-sm font-mono max-w-sm relative z-10">
          De Epistemic Engine is bezig met het kalibreren van de {Title}. Toegang vereist geverifieerde Executive-klaring.
        </p>
        
        <button className="mt-4 px-8 py-3 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-widest rounded-lg transition-all relative z-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          Keer Terug
        </button>
      </div>
    </div>
  );
}
`;

routes.forEach(route => {
  const title = route.charAt(0).toUpperCase() + route.slice(1);
  const content = template.replace(/\{Title\}/g, title).replace(/\{ComponentName\}/g, title);
  
  const dirPath = path.join(dashboardDir, route);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content, 'utf8');
});

console.log('AEIP Core Routes successfully generated.');
