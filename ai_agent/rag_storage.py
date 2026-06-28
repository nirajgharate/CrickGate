import os
import shutil
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from database import get_all_turfs
from dotenv import load_dotenv

load_dotenv()

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "chroma_db")

def get_embeddings():
    """Initialize Gemini embeddings model"""
    api_key = os.getenv("GEMINI_API_KEY")
    return GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=api_key
    )

def format_turf_document(turf):
    """Convert turf MongoDB object to a searchable text document representation"""
    facilities_str = ", ".join(turf.get("facilities", []))
    content = f"""
    Turf ID: {str(turf['_id'])}
    Turf Name: {turf.get('name', 'N/A')}
    Location: {turf.get('location', 'N/A')}, Area: {turf.get('Area', 'N/A')}
    Price: {turf.get('price', 'N/A')}
    Facilities/Amenities: {facilities_str if facilities_str else 'Basic'}
    Rating: {turf.get('rating', 4.5)} out of 5
    """
    
    metadata = {
        "id": str(turf["_id"]),
        "name": turf.get("name", "N/A"),
        "location": turf.get("location", "N/A"),
        "price": turf.get("price", "N/A"),
        "rating": float(turf.get("rating", 4.5))
    }
    
    return Document(page_content=content, metadata=metadata)

def sync_vector_store():
    """Pull real turf data from MongoDB, embed, and write to ChromaDB"""
    print("Syncing turf database to vector store...")
    
    # Clean up old database files
    if os.path.exists(PERSIST_DIR):
        try:
            shutil.rmtree(PERSIST_DIR)
            print("Cleaned up existing vector database.")
        except Exception as e:
            print(f"Warning: Could not clean up old database directory: {e}")
            
    turfs = get_all_turfs()
    if not turfs:
        print("No turfs found in MongoDB to index.")
        return False
        
    documents = [format_turf_document(t) for t in turfs]
    embeddings = get_embeddings()
    
    # Build store
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=PERSIST_DIR
    )
    print(f"Successfully indexed {len(documents)} turfs to ChromaDB!")
    return True

def search_turfs_rag(query, k=3):
    """Query vector database for most similar turfs"""
    if not os.path.exists(PERSIST_DIR):
        # Auto-sync if DB doesn't exist
        success = sync_vector_store()
        if not success:
            return []
            
    embeddings = get_embeddings()
    vectorstore = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embeddings
    )
    
    results = vectorstore.similarity_search(query, k=k)
    return results

if __name__ == "__main__":
    # Test sync when run directly
    sync_vector_store()
