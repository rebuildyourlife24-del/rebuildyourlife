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
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('apps/web/src/app/dashboard');
let modifiedCount = 0;

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const originalContent = content;
    
    // Replace red with cyan
    content = content.replace(/text-red-\d{3}/g, 'text-cyan-500');
    content = content.replace(/bg-red-\d{3}/g, 'bg-cyan-500');
    content = content.replace(/bg-red-\d{3}\/\d{2}/g, 'bg-cyan-500/10');
    content = content.replace(/border-red-\d{3}/g, 'border-cyan-500');
    content = content.replace(/border-red-\d{3}\/\d{2}/g, 'border-cyan-500/30');

    // Replace gold with emerald (or cyan depending on context, let's use emerald for success/gold contexts)
    content = content.replace(/text-gold/g, 'text-emerald-400');
    content = content.replace(/bg-gold/g, 'bg-emerald-500');
    content = content.replace(/bg-gold\/\d{2}/g, 'bg-emerald-500/20');
    content = content.replace(/border-gold/g, 'border-emerald-500');
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        modifiedCount++;
    }
}
console.log('Modified files for theme purge:', modifiedCount);
