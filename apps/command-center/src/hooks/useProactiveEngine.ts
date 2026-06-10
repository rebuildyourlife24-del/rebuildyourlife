import { useState, useEffect } from 'react';

export interface AlertData {
  title: string;
  message: string;
  agent: string;
}

export function useProactiveEngine() {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    // Wait between 15 and 35 seconds before triggering the first proactive alert
    const initialDelay = Math.random() * 20000 + 15000;
    
    const timeout = setTimeout(() => {
      setActiveAlert({
        agent: "WEALTH & OPPORTUNITY ENGINE",
        title: "CRITICAL: NIEUWE VERDIENKANS",
        message: "Nieuwe dropshipping trend gedetecteerd op Meta Ads (0€ instapkosten). Winstmarge projectie: 62%. Wil je de data direct inzien?"
      });
    }, initialDelay);

    return () => clearTimeout(timeout);
  }, []);

  const dismissAlert = () => setActiveAlert(null);

  return { activeAlert, dismissAlert };
}
