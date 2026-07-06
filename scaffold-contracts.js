const fs = require('fs');
const path = require('path');

const coreDocsDir = path.join(__dirname, 'docs', 'core');
const templatePath = path.join(coreDocsDir, 'SERVICE_CONTRACT_TEMPLATE.md');

const template = fs.readFileSync(templatePath, 'utf8');

const services = [
  { file: 'wallet-service.md', name: 'Wallet Service', purpose: 'Beheer van de virtuele saldo credits per Workspace.' },
  { file: 'notification-service.md', name: 'Notification Service', purpose: 'Het centraal routeren en afleveren van notificaties (in-app, push).' },
  { file: 'workflow-service.md', name: 'Workflow Service', purpose: 'Beheren en uitvoeren van visuele automatiseringen en triggers.' },
  { file: 'audit-service.md', name: 'Audit Service', purpose: 'Onwijzigbaar vastleggen van kritieke platform acties voor compliance.' },
  { file: 'plugin-service.md', name: 'Plugin Service', purpose: 'Beheer van geïnstalleerde externe connecties en business plugins.' },
  { file: 'prompt-service.md', name: 'Prompt Service', purpose: 'Versiebeheer en opslag van agent system-prompts.' },
  { file: 'knowledge-service.md', name: 'Knowledge Service', purpose: 'RAG-infrastructuur: document-parsing en vector-embeddings opslag.' },
  { file: 'storage-service.md', name: 'Storage Service', purpose: 'Bestandsbeheer en S3 blob opslag (facturen, profiel fotos).' },
  { file: 'media-service.md', name: 'Media Service', purpose: 'Video en Audio rendering (FFmpeg) t.b.v. content creatie.' },
  { file: 'search-service.md', name: 'Search Service', purpose: 'Global search over alle workspace data (Elasticsearch).' },
  { file: 'email-service.md', name: 'Email Service', purpose: 'Versturen van transactionele emails via SendGrid/Postmark.' },
  { file: 'chat-service.md', name: 'Chat Service', purpose: 'Beheer van multi-channel conversaties (WhatsApp, Telegram, in-app).' },
  { file: 'agent-registry.md', name: 'Agent Registry', purpose: 'Centrale administratie van beschikbare en actieve AI-agents.' },
  { file: 'scheduler-service.md', name: 'Scheduler Service', purpose: 'Cron-jobs en uitgestelde taakuitvoering.' },
  { file: 'event-bus.md', name: 'Event Bus', purpose: 'Het zenuwstelsel: asynchrone message-routing tussen domeinen (Kafka).' }
];

services.forEach(svc => {
  const filePath = path.join(coreDocsDir, svc.file);
  if (!fs.existsSync(filePath)) {
    let content = template.replace('[Naam van de Service, bijv. Identity Service]', svc.name);
    content = content.replace('[1 of 2 zinnen over de core value van deze service]', svc.purpose);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Scaffolded: ${svc.file}`);
  } else {
    console.log(`Skipped (already exists): ${svc.file}`);
  }
});

console.log('All Service Contracts scaffolded successfully.');
