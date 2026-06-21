<div align="center">

# 👁️ TrafficEye AI

**Every violation. Automatically caught.**

[![Built with React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](#)
[![Powered by FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi&logoColor=white)](#)
[![YOLOv8 Detection](https://img.shields.io/badge/Ultralytics-YOLOv8-FF1493)](#)
[![Database Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](#)

*An AI-powered command center built for the Gridlock Hackathon 2.0 (Flipkart × Bengaluru Traffic Police).*

</div>

---

## 🚦 Overview

**TrafficEye AI** is a full-stack, AI-driven traffic enforcement command center designed to scale manual enforcement operations. It uses computer vision to automatically detect multi-class violations and optical character recognition (OCR) to extract license plates in real-time. 

With structured logging and temporal analytics, TrafficEye AI turns unstructured traffic photos into actionable intelligence, catching repeat offenders who would otherwise slip under the radar.

### ✨ What It Detects
- **TFC-01 (Helmet Violation)**: Detects unhelmeted riders overlapping with active motorcycles.
- **TFC-02 (Triple Riding)**: Flags motorcycles carrying three or more passengers.
- **License Plate OCR**: Localizes and extracts registration text using EasyOCR.
- **Evidence Generation**: Hard-burns verification bounding boxes and confidence scores directly onto proof imagery.

---

## 🛠️ Tech Stack

- **Computer Vision Pipeline**: Ultralytics YOLOv8, EasyOCR, OpenCV
- **Backend Infrastructure**: FastAPI, SQLModel (ORM), Supabase (PostgreSQL & Blob Storage)
- **Frontend Dashboard**: React, Vite, Tailwind CSS, Recharts
- **Insights Engine**: Google Gemini API

---

## 🚀 Quick Start Guide

### 1. Backend Setup

The backend handles the AI inference pipeline, image processing, and database interactions.

```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and provide your Supabase/Gemini credentials
cp .env.example .env

# Start the FastAPI server
uvicorn main:app --reload
```
*API runs at `http://localhost:8000`*

### 2. Frontend Setup

The frontend provides the Command Center UI and live dashboard.

```bash
# Navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```
*App runs at `http://localhost:5173`*

---

## 📡 Core API Reference

The backend provides a robust REST API for integrating the vision pipeline with external tools:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze/` | `POST` | Upload an image to run the full detection & OCR pipeline. |
| `/api/violations/` | `GET` | Retrieve a paginated log of all processed violations. |
| `/api/violations/{plate}`| `GET` | Retrieve the specific violation history for a single vehicle. |
| `/api/analytics/` | `GET` | Fetch aggregated temporal and statistical violation data. |
| `/api/analytics/insights`| `GET` | Generate an actionable AI-driven summary based on live metrics. |

---

<div align="center">
  <p><i>Manual enforcement doesn't scale. TrafficEye AI does.</i></p>
</div>
