'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("GLOBAL CRASH DETECTED:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'red', backgroundColor: 'black', minHeight: '100vh' }}>
          <h2>FATAL SYSTEM CRASH</h2>
          <p>Please send this error to the AI Developer:</p>
          <pre style={{ color: 'white', background: '#222', padding: '1rem', marginTop: '1rem' }}>
            {error.message || JSON.stringify(error)}
          </pre>
          <button 
            onClick={() => reset()} 
            style={{ marginTop: '2rem', padding: '1rem', background: 'gold', color: 'black', fontWeight: 'bold' }}
          >
            RELOAD SYSTEM
          </button>
        </div>
      </body>
    </html>
  );
}
