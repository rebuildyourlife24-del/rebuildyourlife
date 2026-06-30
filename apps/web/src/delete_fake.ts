import { db as prisma } from './lib/db'; async function main() { await prisma.agentAction.deleteMany({ where: { status: 'PENDING' } }); console.log('Done'); } main(); 
