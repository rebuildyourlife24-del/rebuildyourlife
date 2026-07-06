import { processSemanticETL } from './src/lib/semantic-etl/engine';
import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env.local') });
config({ path: path.resolve(__dirname, '.env') });

async function run() {
  console.log("Starting Semantic ETL Test...");
  const result = await processSemanticETL({
    datasetName: "IT Systeemstatus",
    datasetDescription: "Realtime logs van servers en netwerkapparatuur. Tabellen: cpu_load, memory_used, errors.",
    userRoles: ["SysAdmin", "DevOps"],
    taskGoal: "Creëer een futuristisch monitoringdashboard voor IT Operation, met alarm-alerts bij fouten.",
    branding: {
      companyName: "CyberCorp",
      primaryColor: "#001f3f",
      accentColor: "#ff4136"
    }
  });

  if (result.success) {
    console.log("Success! Generated UI Spec:");
    console.log(JSON.stringify(result.spec, null, 2));
    console.log("Metrics:", result.metrics);
  } else {
    console.error("Failed to generate UI Spec:", result.error);
    console.log("Fallback spec:", JSON.stringify(result.spec, null, 2));
    console.log("Metrics:", result.metrics);
  }
}

run().catch(console.error);
