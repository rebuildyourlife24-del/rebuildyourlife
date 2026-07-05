import { NextResponse } from "next/server";
import { prisma } from "@rebuildyourlife/database";

export async function GET(req: Request, { params }: { params: Promise<{ domain: string }> }) {
  const resolvedParams = await params;
  const domain = resolvedParams.domain;

  try {
    const website = await prisma.website.findUnique({
      where: { domain },
    });

    if (!website) {
      return new NextResponse("<h1>404 - Website niet gevonden</h1>", {
        status: 404,
        headers: { "Content-Type": "text/html" },
      });
    }

    return new NextResponse(website.htmlContent, {
      headers: { "Content-Type": "text/html" },
    });
  } catch (error: any) {
    return new NextResponse("<h1>500 - Server Error</h1>", {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
