import React from 'react';
import { AbsoluteFill, Audio, Img, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { z } from 'zod';

export const viralShortSchema = z.object({
  title: z.string(),
  audioUrl: z.string().optional(),
  themeColor: z.string().optional(),
});

type ViralShortProps = z.infer<typeof viralShortSchema>;

export const ViralShort: React.FC<ViralShortProps> = ({ 
  title, 
  audioUrl, 
  themeColor = '#00f0ff' 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animatie voor de titel (fade-in en lichte slide)
  const titleOpacity = interpolate(frame, [0, 15], [0, 1]);
  const titleY = interpolate(frame, [0, 15], [50, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#050505', justifyContent: 'center', alignItems: 'center' }}>
      
      {/* Achtergrond gloed */}
      <AbsoluteFill 
        style={{ 
          background: `radial-gradient(circle at center, ${themeColor}22 0%, #050505 70%)` 
        }} 
      />

      {/* Optionele Audio Track */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Tekst Animatie */}
      <div 
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          color: 'white',
          padding: '0 80px',
        }}
      >
        <h1 style={{ 
          fontSize: '100px', 
          fontWeight: 900, 
          lineHeight: 1.1,
          textTransform: 'uppercase',
          textShadow: `0 0 40px ${themeColor}88`
        }}>
          {title}
        </h1>
        
        <p style={{
          fontSize: '50px',
          color: themeColor,
          marginTop: '40px',
          fontWeight: 600,
          letterSpacing: '0.1em'
        }}>
          RYL OS AUTOPILOT
        </p>
      </div>

    </AbsoluteFill>
  );
};
