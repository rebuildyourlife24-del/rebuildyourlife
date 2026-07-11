import * as fs from 'fs';
import * as path from 'path';
import { EventRegistry } from '../src/events/registry/EventRegistry';
import { GoalCreatedDescriptor } from '../src/events/goal/GoalCreated';

async function generateCatalog() {
  const registry = new EventRegistry();

  // Register all canonical events here
  registry.register(GoalCreatedDescriptor);
  // Add others as they are built...

  const catalog = registry.generateCatalog();

  const outputPath = path.resolve(__dirname, '../../event-catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(catalog, null, 2));

  console.log(`Event catalog generated at ${outputPath}`);
}

generateCatalog().catch(console.error);
