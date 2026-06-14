import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { topic, tone, platform } = await req.json();

    if (!topic || !platform) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`[CONTENT FORGE] Generating ${tone} content for ${platform} on topic: ${topic}`);

    // We generate high-end mocked scripts that perfectly fit the "Billionaire / Apex Predator" theme.
    
    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    const script = `HOOK (0-3s): Stop met het betalen van je schulden. Ja, je hoort het goed. 
    
PROBLEM (3-15s): 99% van de mensen zit vast in the Matrix. Ze werken 60 uur per week om de belastingdienst en incassobureaus rijk te maken, terwijl hun eigen familie niets overhoudt. Dat is geen leven, dat is moderne slavernij.

SOLUTION (15-30s): Er is een wettelijke loophole: Het Vrij Te Laten Bedrag (VTLB). Een ijzersterk juridisch schild dat schuldeisers blokkeert. Zodra the VTLB-Lock actief is, mogen ze wettelijk gezien geen cent meer pakken van je basisinkomen.

CALL TO ACTION (30-45s): RebuildYourLife heeft deze formule geautomatiseerd in the 'Apex Predator' motor. Klik op de link in de bio, activeer je VTLB-Lock, en neem de controle over je bloedlijn terug. Welcome to the 1%.`;

    const midjourneyPrompt = `/imagine prompt: Cinematic shot of a hyper-modern control room, a wealthy entrepreneur in a bespoke black suit sitting at a monolithic desk, glowing gold holographic data screens floating in the air displaying financial charts, dark moody lighting, luxury cyberpunk aesthetic, unreal engine 5, 8k resolution, photorealistic, black and gold color palette --ar 9:16 --v 6.0`;

    const voiceoverText = `Stop met het betalen van je schulden. Ja, je hoort het goed. 99 procent van de mensen zit vast in the Matrix. Ze werken 60 uur per week om incassobureaus rijk te maken. Dat is moderne slavernij. Er is een wettelijke loophole: Het Vrij Te Laten Bedrag. Activeer de VTLB-Lock met RebuildYourLife en neem de controle terug.`;

    const title = tone === 'Aggressive' 
        ? `🔥 STOP MET BETALEN: De VTLB Loophole Onthuld` 
        : `💰 Neem de Controle Terug: Jouw Vrij Te Laten Bedrag`;

    return NextResponse.json({
      success: true,
      data: {
        title,
        script,
        midjourneyPrompt,
        voiceoverText,
        hashtags: ['#financialfreedom', '#matrix', '#rebuildyourlife', '#vtlb', '#debtfree', '#wealth']
      }
    });
  } catch (error: any) {
    console.error('[CONTENT FORGE] Error generating content:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate content' }, { status: 500 });
  }
}
