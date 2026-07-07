import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@rebuildyourlife/database";
import { inngest } from "../../../../inngest/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, domain, userId, agentId } = body;

    if (!title || !content || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Stap 1: Sla het ruwe document op in de Document tabel
    const document = await prisma.document.create({
      data: {
        title,
        content,
        userId,
        type: "RAW_SOP"
      }
    });

    // Stap 2: Vuur het Inngest event af om het asynchroon te verwerken naar Knowledge Base regels
    await inngest.send({
      name: "knowledge/document.uploaded",
      data: {
        documentId: document.id,
        content: document.content,
        domain: domain || "GENERAL",
        agentId: agentId || "COUNCIL_GLOBAL",
        userId: userId
      }
    });

    return NextResponse.json({ 
      success: true, 
      documentId: document.id,
      message: "SOP succesvol geüpload. De Knowledge Ingestion Engine verwerkt dit momenteel op de achtergrond." 
    }, { status: 200 });

  } catch (error: any) {
    console.error("[KNOWLEDGE INGEST API] Error:", error);
    return NextResponse.json({ error: "Interne serverfout" }, { status: 500 });
  }
}
