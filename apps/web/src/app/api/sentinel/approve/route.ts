import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { id, action } = await req.json();

    if (!id || !action || !['APPROVE', 'REJECT'].includes(action)) {
      return NextResponse.json({ error: "Missing or invalid required fields (id, action)" }, { status: 400 });
    }

    const userId = "dev-local-admin-id"; // In the real system, get this from session

    const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';

    const updatedProposal = await db.actionProposal.update({
      where: { id },
      data: { 
        status: newStatus,
        respondedAt: new Date(),
        respondedByUserId: userId,
        approvalSignature: `Signed by Sentinel at ${new Date().toISOString()}`
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Actie succesvol ${newStatus === 'APPROVED' ? 'goedgekeurd' : 'afgewezen'}!`,
      data: updatedProposal
    });

  } catch (error: any) {
    console.error('[SENTINEL API] Fout bij verwerken goedkeuring:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
