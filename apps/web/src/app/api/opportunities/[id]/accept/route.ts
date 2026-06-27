import { NextResponse } from 'next/server';
import { prisma } from '@rebuildyourlife/database';
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET! ;

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return await prisma.user.findUnique({ where: { id: decoded.userId } });
  } catch {
    return null;
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user.id;
    const { id: opportunityId } = await params;

    // Check if the opportunity exists and is AVAILABLE
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    });

    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 });
    }

    if (opportunity.status !== 'AVAILABLE') {
      return NextResponse.json({ error: 'This opportunity is no longer available' }, { status: 400 });
    }

    // Assign the opportunity to the user and mark as IN_PROGRESS
    const updatedOpportunity = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        status: 'IN_PROGRESS',
        assignedToId: userId,
      },
    });

    // We can also create a Notification for the user
    await prisma.notification.create({
      data: {
        userId,
        title: 'Opdracht Geaccepteerd',
        message: `Je hebt de werkopdracht "${opportunity.title}" geaccepteerd. Succes, operator!`,
        actionUrl: `/dashboard/tasks`,
      }
    });

    return NextResponse.json(updatedOpportunity);
  } catch (error) {
    console.error('Error accepting opportunity:', error);
    return NextResponse.json({ error: 'Failed to accept opportunity' }, { status: 500 });
  }
}
