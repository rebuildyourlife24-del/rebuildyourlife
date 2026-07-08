import os
import json
import logging
from uuid import uuid4

# Setup basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ETL_Memory")

def extract_knowledge(folder_path: str):
    """
    Simulates extracting text data from the Desktop Knowledge Bases.
    In production, this would read .md, .pdf, .txt files recursively.
    """
    logger.info(f"Extracting knowledge from {folder_path}...")
    if not os.path.exists(folder_path):
        logger.warning(f"Path {folder_path} not found. Skipping extraction.")
        return []
        
    extracted_data = []
    for root, _, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            # Simulated read
            logger.info(f"Read: {file_path}")
            extracted_data.append({"source": file, "content": f"Content of {file}"})
    return extracted_data

def transform_to_embeddings(data_chunks: list):
    """
    Simulates calling an embedding model (e.g., text-embedding-ada-002) via LiteLLM
    to convert the text into vector embeddings for Pinecone/pgvector.
    """
    logger.info(f"Transforming {len(data_chunks)} chunks to vector embeddings...")
    embeddings = []
    for chunk in data_chunks:
        # Simulated embedding vector of size 1536
        simulated_vector = [0.0] * 1536 
        embeddings.append({
            "id": str(uuid4()),
            "source": chunk["source"],
            "content": chunk["content"],
            "embedding": simulated_vector
        })
    return embeddings

def load_to_vector_db(embeddings: list):
    """
    Simulates loading the vectors into the OrionMemory / AIMemory pgvector tables in Supabase.
    """
    logger.info(f"Loading {len(embeddings)} vectors into Vector Database...")
    for emb in embeddings:
        logger.info(f"Inserted Vector ID: {emb['id']} (Source: {emb['source']})")
    logger.info("ETL Pipeline completed successfully. Memory Ingestion done.")

def run_etl_pipeline():
    logger.info("=== STARTING VECTOR ETL PIPELINE ===")
    
    desktop_path = os.path.expanduser("~/Desktop")
    orion_path = os.path.join(desktop_path, "Orion_Knowledge_Base")
    supreme_path = os.path.join(desktop_path, "Supreme_Onderzoeken_Databank")
    
    # 1. EXTRACT
    orion_data = extract_knowledge(orion_path)
    supreme_data = extract_knowledge(supreme_path)
    all_data = orion_data + supreme_data
    
    # 2. TRANSFORM
    vector_embeddings = transform_to_embeddings(all_data)
    
    # 3. LOAD
    if vector_embeddings:
        load_to_vector_db(vector_embeddings)
    else:
        logger.warning("No data found to ingest. Pipeline finished empty.")

if __name__ == "__main__":
    run_etl_pipeline()
