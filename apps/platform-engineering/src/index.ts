import { DIVPOrchestrator } from './engine/orchestrator';
import { ExecutionContext } from './core/interfaces';
import { LayerMinus1Loader } from './layers/layer-minus-1-loader';
import { LayerMinus05Hygiene } from './layers/layer-minus-05-hygiene';
import { Layer0Constitution } from './layers/layer0-constitution';
import { Layer1Repository } from './layers/layer1-repository';
import { Layer2Build } from './layers/layer2-build';

async function bootstrap() {
  const orchestrator = new DIVPOrchestrator();

  const context: ExecutionContext = {
    cwd: process.cwd(),
    env: process.env,
    historicalDataPath: '.divp-history.json',
    manifest: {
      id: `scan-${Date.now()}`,
      timestamp: new Date().toISOString(),
      git_commit: 'unknown', // can be fetched dynamically later
      git_branch: 'unknown',
      node_version: process.version,
      workspace: process.cwd()
    },
    config: {
      historyEnabled: true,
      minConfidence: 90,
      weights: {
        'architecture.constitution': 25,
        'repository.audit': 25,
        'build.simulation': 50
      }
    }
  };

  // Dynamically load capabilities based on configuration or environment
  orchestrator.registerCapability(new LayerMinus1Loader());
  orchestrator.registerCapability(new LayerMinus05Hygiene());
  orchestrator.registerCapability(new Layer0Constitution());
  orchestrator.registerCapability(new Layer1Repository());
  orchestrator.registerCapability(new Layer2Build());

  await orchestrator.run(context);
}

bootstrap().catch(console.error);
