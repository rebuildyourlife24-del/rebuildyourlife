import { useState, useEffect } from 'react';

export interface AlertData {
  title: string;
  message: string;
  agent: string;
}

export function useProactiveEngine() {
  const [activeAlert, setActiveAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const checkSystemHealth = async () => {
      try {
        const res = await fetch('/api/system/health');
        const data = await res.json();

        if (data.status === 'error') {
          setActiveAlert({
            agent: "SYSTEM DIAGNOSTICS",
            title: "CRITICAL: API CONFIGURATIE ONTBREEKT",
            message: data.message
          });
          return; // Stop the engine until this is fixed
        }

        // If system is healthy, proceed with normal proactive alerts
        const initialDelay = Math.random() * 20000 + 15000;
        timeout = setTimeout(() => {
          setActiveAlert({
            agent: "WEALTH & OPPORTUNITY ENGINE",
            title: "CRITICAL: NIEUWE VERDIENKANS",
            message: "Nieuwe dropshipping trend gedetecteerd op Meta Ads (0€ instapkosten). Winstmarge projectie: 62%. Wil je de data direct inzien?"
          });
        }, initialDelay);

      } catch (error) {
        console.error("Health check failed:", error);
      }
    };

    checkSystemHealth();

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const dismissAlert = () => setActiveAlert(null);

  return { activeAlert, dismissAlert };
}
