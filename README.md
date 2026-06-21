# TrafficEye AI

TrafficEye AI is a full-stack, AI-powered traffic enforcement command center. It uses computer vision (YOLOv8) and optical character recognition (EasyOCR) to automatically detect violations like driving without a helmet or triple riding, and extracts the license plate of the offending vehicle.

## Tech Stack
- **Backend**: FastAPI, SQLModel, PostgreSQL (via Supabase), Ultralytics YOLOv8, EasyOCR, OpenCV
- **Frontend**: React, Vite, Tailwind CSS, Recharts
- **Storage**: Supabase Storage
- **AI Insights**: Google Gemini API

## Project Structure
- `/backend`: The FastAPI application, AI models, and PostgreSQL database integration.
- `/frontend`: The React command-center dashboard UI.

## How to Run the Backend
1. Open a terminal and navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up your environment variables. Copy `.env.example` to `.env` and fill in your Supabase database and storage credentials, and Gemini API key:
   - `SUPABASE_DB_URL`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will run at `http://localhost:8000`.

## How to Run the Frontend
1. Open a terminal and navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will run at `http://localhost:5173`.

## Core API Endpoints
- `POST /api/analyze/`: Upload an image to run the full detection pipeline.
- `GET /api/analytics/`: Retrieve aggregated violation statistics.
- `GET /api/analytics/insights`: Retrieve an AI-generated actionable insight based on the current stats.
- `GET /api/violations/`: Retrieve a paginated list of all violations.
- `GET /api/violations/{vehicle_number}`: Retrieve all violations for a specific plate.
