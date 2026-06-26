const fs = require('fs');
const path = require('path');

const dictionary = {
  // Navigation & General
  'Settings': 'Instellingen',
  'Dashboard': 'Overzicht',
  'Save Changes': 'Wijzigingen Opslaan',
  'Cancel': 'Annuleren',
  'Loading...': 'Bezig met laden...',
  'System Status': 'Systeemstatus',
  'Active': 'Actief',
  'Inactive': 'Inactief',
  'Connected': 'Verbonden',
  'Disconnected': 'Niet Verbonden',
  'View Details': 'Details Bekijken',
  'Deploy': 'Inzetten',
  'Revenue': 'Omzet',
  'Total Revenue': 'Totale Omzet',
  'Growth Rate': 'Groeipercentage',
  'Active Assets': 'Actieve Middelen',
  'Opportunities': 'Kansen',
  'AI Team': 'AI Team',
  'Wealth': 'Vermogen',
  'Tasks': 'Taken',
  
  // Specific phrases seen in the codebase
  'SYNCHRONIZING SECURE DATALINK...': 'BEVEILIGDE DATAVERBINDING SYNCHRONISEREN...',
  'ESTABLISHING NEURAL LINK...': 'NEURALE VERBINDING MAKEN...',
  'ACCESSING QUANTUM CORE...': 'TOEGANG TOT QUANTUM KERN...',
  'DECRYPTING ASSET VAULT...': 'KLUIS DECODEREN...',
  'INITIALIZING HERMES PROTOCOL...': 'HERMES PROTOCOL INITIALISEREN...',
  'CALCULATING ALPHA TRAJECTORY...': 'ALPHA TRAJECTORIUM BEREKENEN...',
  'SYNCING GLOBAL MARKETS...': 'WERELDWIJDE MARKTEN SYNCHRONISEREN...',
  'UPLOADING CONSCIOUSNESS...': 'BEWUSTZIJN UPLOADEN...',
  'Search opportunities...': 'Zoek kansen...',
  'Filter by status': 'Filter op status',
  'All Statuses': 'Alle Statussen',
  'High Priority': 'Hoge Prioriteit',
  'Medium Priority': 'Gemiddelde Prioriteit',
  'Low Priority': 'Lage Prioriteit',
  'In Progress': 'Bezig',
  'Completed': 'Voltooid',
  'Pending': 'In Wachtrij',
  
  // Opportunities / Radar page
  'Sovereign Wealth Radar': 'Sovereign Wealth Radar', // Brand name
  'Access Restricted': 'Toegang Geweigerd',
  'Deploy Hermes Scout': 'Hermes Scout Inzetten',
  'Product Sourcing': 'Product Sourcing',
  
  // Enterprise / Factory
  'Factory': 'Fabriek',
  'Enterprise': 'Onderneming',
  'Operations': 'Operaties'
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function translateFiles() {
  const dir = path.join(__dirname, '../apps/web/src');
  let translatedCount = 0;
  
  walkDir(dir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;
      
      for (const [eng, nl] of Object.entries(dictionary)) {
        // We use regex to replace exact string matches safely (mainly inside JSX text or quotes)
        // This is a simple but effective approach for hardcoded strings
        const regex1 = new RegExp(`>\\s*${eng}\\s*<`, 'g');
        content = content.replace(regex1, `>${nl}<`);
        
        const regex2 = new RegExp(`"${eng}"`, 'g');
        content = content.replace(regex2, `"${nl}"`);
        
        const regex3 = new RegExp(`'${eng}'`, 'g');
        content = content.replace(regex3, `'${nl}'`);
        
        const regex4 = new RegExp(`\\{\\s*'${eng}'\\s*\\}`, 'g');
        content = content.replace(regex4, `{'${nl}'}`);
        
        const regex5 = new RegExp(`\\{\\s*"${eng}"\\s*\\}`, 'g');
        content = content.replace(regex5, `{"${nl}"}`);
      }
      
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        translatedCount++;
      }
    }
  });
  
  console.log(`Successfully translated ${translatedCount} files in the dashboard.`);
}

translateFiles();
