import React from 'react';
import { Composition } from 'remotion';
import { ViralShort, viralShortSchema } from './ViralShort';

// Dit is de root waar Remotion alle video templates registreert.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ViralShort"
        component={ViralShort}
        durationInFrames={300} // Wordt dynamisch overschreven obv audio lengte
        fps={30}
        width={1080}
        height={1920} // TikTok / Reels formaat
        schema={viralShortSchema}
        defaultProps={{
          title: "RYL OS - Autonome God-Mode",
          audioUrl: "", // Als er geen audio is, stilte.
          themeColor: "#00f0ff", // Orion Cyan
        }}
      />
    </>
  );
};
