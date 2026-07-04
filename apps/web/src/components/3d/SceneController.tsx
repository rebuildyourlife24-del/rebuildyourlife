'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { ScifiEnvironment } from './ScifiEnvironment';
import { CyberpunkEnvironment } from './CyberpunkEnvironment';
import { DarkThrillerEnvironment } from './DarkThrillerEnvironment';
import { BlendFunction } from 'postprocessing';

interface SceneControllerProps {
  theme?: 'scifi' | 'cyberpunk' | 'dark';
}

export function SceneController({ theme = 'scifi' }: SceneControllerProps) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        {/* Render Selected Theme */}
        {theme === 'scifi' && <ScifiEnvironment />}
        {theme === 'cyberpunk' && <CyberpunkEnvironment />}
        {theme === 'dark' && <DarkThrillerEnvironment />}
        
        {/* Universal Cinematic Post-Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
          <Noise opacity={0.04} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {theme === 'cyberpunk' ? (
            <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002] as any} />
          ) : <></>}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
