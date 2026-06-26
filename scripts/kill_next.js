const { execSync } = require('child_process');

try {
  const out = execSync('wmic process where "name=\'node.exe\'" get processid,commandline').toString();
  const lines = out.split('\n');
  
  lines.forEach(l => {
    if (l.includes('next')) {
      const parts = l.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (!isNaN(pid)) {
        console.log('Killing PID: ' + pid);
        try {
          execSync('taskkill /F /PID ' + pid);
        } catch (e) {
          console.error('Failed to kill PID: ' + pid);
        }
      }
    }
  });
} catch (e) {
  console.log(e.message);
}
