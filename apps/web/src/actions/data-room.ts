'use server';

import { prisma } from '@rebuildyourlife/database';

export async function getEnterpriseFolders() {
  try {
    return await prisma.enterpriseFolder.findMany({
      include: {
        documents: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { name: 'asc' }
    });
  } catch (e) {
    console.error('Error fetching folders:', e);
    return [];
  }
}

import { storeDocumentInVectorDB } from '@/lib/pinecone';

export async function createDocument(folderId: string, title: string, content: string, owner: string) {
  try {
    const doc = await prisma.enterpriseDocument.create({
      data: {
        folderId,
        title,
        content,
        owner,
        category: 'SOP', // Default category
        status: 'PUBLISHED'
      }
    });

    // Store in Pinecone Vector DB for Orion's Long-Term Memory
    await storeDocumentInVectorDB(doc.id, doc.title, doc.content);

    return { success: true };
  } catch (error: any) {
    console.error('Error creating document:', error);
    return { success: false, message: error.message };
  }
}
