import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { ShopifySwarmService } from '@/lib/services/shopify.service';

export async function POST(req: Request) {
  try {
    const { id, type, action } = await req.json();

    if (!id || !type || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const userId = "dev-local-admin-id"; // In the real system, get this from session

    if (type === 'HYPOTHESIS') {
      const newType = action === 'APPROVE' ? 'VERIFIED' : 'FAILURE';
      await db.agentKnowledgeBase.update({
        where: { id },
        data: { type: newType, confidence: action === 'APPROVE' ? 0.99 : 0.0 }
      });

      await db.knowledgeVerificationLog.create({
        data: {
          knowledgeId: id,
          verifierId: userId,
          verifierType: "USER",
          previousType: "HYPOTHESIS",
          newType: newType,
          reasoning: `Manual Sentinel Override: ${action}`
        }
      });
      return NextResponse.json({ success: true, message: `Hypothese veranderd naar ${newType}` });
    }

    if (type === 'SHOPIFY_PRODUCT') {
      if (action === 'APPROVE') {
        // Here we could add Shopify API push logic to change from DRAFT to ACTIVE
        // Using the service
        await ShopifySwarmService.approveProduct(id, userId);
        return NextResponse.json({ success: true, message: "Product live gezet op Shopify!" });
      } else {
        await db.shopifyProduct.update({
          where: { id },
          data: { status: "REJECTED" }
        });
        return NextResponse.json({ success: true, message: "Product afgewezen." });
      }
    }

    if (type === 'EMAIL_CAMPAIGN') {
      const newStatus = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
      await db.emailCampaign.update({
        where: { id },
        data: { status: newStatus }
      });
      return NextResponse.json({ success: true, message: `E-mailcampagne veranderd naar ${newStatus}` });
    }

    if (type === 'MARKETING_VIDEO') {
      const newStatus = action === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
      await db.marketingVideo.update({
        where: { id },
        data: { status: newStatus }
      });
      // In a real app, this is where we'd trigger the HeyGen/D-ID API render pipeline!
      return NextResponse.json({ success: true, message: `Video script veranderd naar ${newStatus}. (Klaar voor render!)` });
    }

    return NextResponse.json({ error: "Unknown type" }, { status: 400 });
  } catch (error: any) {
    console.error('[SENTINEL API] Fout bij verwerken goedkeuring:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
