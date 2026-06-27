"use server";

import { prisma as db } from '@rebuildyourlife/database';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET! || 'secret';

export async function getDocuments() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ryl_session")?.value;
  if (!token) return [];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return db.document.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' }
    });
  } catch {
    return [];
  }
}
