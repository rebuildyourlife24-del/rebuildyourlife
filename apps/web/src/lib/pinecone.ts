import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Pinecone Client
// The client will automatically pick up PINECONE_API_KEY from environment variables
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || ''
});

// Initialize Gemini for Embeddings
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

/**
 * Splits text into chunks of approximately 1000 characters.
 */
function chunkText(text: string, maxChunkSize: number = 1000): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if (currentChunk.length + word.length > maxChunkSize) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += `${word} `;
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

/**
 * Generates vector embeddings for a given text using Google's embedding model.
 */
export async function generateEmbeddings(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Stores a document in Pinecone by chunking it and creating vectors.
 */
export async function storeDocumentInVectorDB(docId: string, title: string, text: string) {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    console.warn('Pinecone is not configured. Skipping vector upload.');
    return;
  }

  try {
    const indexName = process.env.PINECONE_INDEX_NAME;
    const index = pinecone.index(indexName);
    
    // 1. Chunk the document
    const chunks = chunkText(text, 1000);
    
    // 2. Generate embeddings for each chunk and prepare for upsert
    const vectors = await Promise.all(
      chunks.map(async (chunk, i) => {
        const embedding = await generateEmbeddings(chunk);
        return {
          id: `${docId}-chunk-${i}`,
          values: embedding,
          metadata: {
            docId,
            title,
            text: chunk, // Store the raw text chunk in metadata so we can retrieve it
            chunkIndex: i
          }
        };
      })
    );

    // 3. Upsert to Pinecone
    // We do it in batches to avoid payload size limits if the document is huge
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch as any);
    }

    console.log(`Successfully stored ${chunks.length} chunks for document ${docId} in Pinecone.`);
  } catch (error) {
    console.error('Error storing document in Pinecone:', error);
    throw new Error('Failed to store document in AI memory.');
  }
}

/**
 * Queries Pinecone for context relevant to the user's prompt.
 */
export async function queryVectorDB(queryText: string, topK: number = 3): Promise<string> {
  if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_INDEX_NAME) {
    return '';
  }

  try {
    const indexName = process.env.PINECONE_INDEX_NAME;
    const index = pinecone.index(indexName);

    // 1. Convert the query text into an embedding
    const queryEmbedding = await generateEmbeddings(queryText);

    // 2. Search Pinecone for the closest matches (cosine similarity)
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });

    if (!queryResponse.matches || queryResponse.matches.length === 0) {
      return '';
    }

    // 3. Extract the text chunks from the matches
    let context = '';
    queryResponse.matches.forEach((match, i) => {
      if (match.metadata && match.metadata.text) {
        context += `\n--- BRON ${i + 1} (Uit document: ${match.metadata.title}) ---\n${match.metadata.text}\n`;
      }
    });

    return context;
  } catch (error) {
    console.error('Error querying Pinecone:', error);
    return '';
  }
}
