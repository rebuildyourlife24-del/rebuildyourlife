import { NextResponse } from 'next/server';
import { OmegaProtocol } from '@/lib/orion/omega-core';

export async function POST(req: Request) {
  try {
    const { command } = await req.json();

    if (!command) {
      return NextResponse.json(
        { error: 'No command provided' },
        { status: 400 }
      );
    }

    const response = await OmegaProtocol.executeCommand(command);

    return NextResponse.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error('[ORION CHAT ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to process command via Omega Protocol' },
      { status: 500 }
    );
  }
}
