from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Triggering reload to clear queue

from database import create_db_and_tables
from routes import analyze, violations, analytics

# Ensure static directories exist before mounting
os.makedirs("uploads", exist_ok=True)
os.makedirs("evidence", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database and create tables on startup
    create_db_and_tables()
    yield

app = FastAPI(title="TrafficEye AI Backend", lifespan=lifespan)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files to serve evidence and uploaded images directly to the frontend
app.mount("/static/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/static/evidence", StaticFiles(directory="evidence"), name="evidence")

# Include the routers
app.include_router(analyze.router, prefix="/api/analyze", tags=["Analyze"])
app.include_router(violations.router, prefix="/api/violations", tags=["Violations"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def read_root():
    return {"message": "TrafficEye AI API is running"}
