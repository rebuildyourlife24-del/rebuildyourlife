import { specificationGeneratorJob, sandboxRunnerJob, gatekeeperV2Job } from "./evolution-sandbox";
import { hermesIntelligenceLoopJob } from "./hermes-loop";
import { quantumGuardMonitorJob } from "./quantum-monitor";
import { rieObservationAdapterJob } from "./revenue-intelligence";

// Register all AEIP Runtime Inngest functions
export const inngestFunctions = [
  specificationGeneratorJob,
  sandboxRunnerJob,
  gatekeeperV2Job,
  hermesIntelligenceLoopJob,
  quantumGuardMonitorJob,
  rieObservationAdapterJob
];
