import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

# Get DB URL from environment variable
db_url = os.getenv("SUPABASE_DB_URL")

# Make sure db_url exists
if not db_url:
    raise ValueError("SUPABASE_DB_URL environment variable is not set")

# Create the SQLModel engine
engine = create_engine(db_url, echo=True)

def create_db_and_tables():
    # Import models here to avoid circular imports and ensure they are registered
    import models.db_models
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
