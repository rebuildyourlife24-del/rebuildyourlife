import * as fs from 'fs';
import * as path from 'path';

export interface HistoryEntry {
  timestamp: string;
  runId: string;
  overallConfidence: number;
  layers: Record<string, string>; // Layer Name -> Status
  errors: string[];
}

export class HistoryEngine {
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify({ runs: [], knowledge: {} }, null, 2));
    }
  }

  getKnowledgeContext(errorCode: string): any {
    const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    return data.knowledge[errorCode] || null;
  }

  saveRun(entry: HistoryEntry) {
    const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    data.runs.push(entry);
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }

  addKnowledge(errorCode: string, diagnosis: any) {
    const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
    data.knowledge[errorCode] = diagnosis;
    fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
  }
}
