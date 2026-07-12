export const AEIP_RUNTIME_POLICY = {
  hermes: {
    canObserve: true,
    canAnalyze: true,
    canRecommend: true,
    canExecute: false,
    canMutateProduction: false
  },
  quantum: {
    canMonitor: true,
    canAlert: true,
    canBlock: true
  },
  rie: {
    canCalculateRevenue: true,
    canSpendMoney: false
  }
};
