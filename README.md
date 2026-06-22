<div align="center">

<img src="https://img.shields.io/badge/TrafficEye%20AI-Gridlock%20Hackathon%202.0-FFB627?style=for-the-badge&labelColor=14171B" alt="TrafficEye AI Banner"/>

# 👁️ TrafficEye AI

**Every violation. Automatically caught. Predicting where they strike next.**

[![Built with React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![Powered by FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=flat-square&logo=fastapi&logoColor=white)](#)
[![YOLOv8 Detection](https://img.shields.io/badge/Ultralytics-YOLOv8-FF1493?style=flat-square)](#)
[![Database Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](#)
[![Gemini AI](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google&logoColor=white)](#)

*An AI-powered command center built for the Gridlock Hackathon 2.0 (Flipkart × Bengaluru Traffic Police).*

</div>

---

## 🚦 Overview

**TrafficEye AI** is a state-of-the-art, full-stack traffic enforcement command center designed to scale manual enforcement operations and proactively mitigate congestion. It uses advanced computer vision to automatically detect multi-class violations and optical character recognition (OCR) to extract license plates in real-time. 

Beyond simple detection, TrafficEye AI turns unstructured traffic photos into actionable intelligence—generating automated E-Challans, tracking repeat offenders, and using a **Predictive Deployment AI** to determine exactly where and when future violations will occur.

---

## ✨ Core Features

### 🔍 Real-Time Computer Vision Pipeline
- **TFC-01 (Helmet Violation)**: Detects unhelmeted riders overlapping with active motorcycles.
- **TFC-02 (Triple Riding)**: Flags motorcycles carrying three or more passengers.
- **Illegal Parking Identification**: Triggers on unauthorized stationary vehicles obstructing traffic flow.
- **Dynamic OCR Engine**: Localizes and extracts registration text securely using EasyOCR.
- **Evidence Watermarking**: Hard-burns verification bounding boxes, classification layers, and confidence scores directly onto proof imagery.

### 📍 Location Tracking & Hotspot Analysis
- Every scanned violation is automatically tagged with its specific intersection/location (e.g., *Silk Board Junction*, *Koramangala 100ft Road*).
- Interactive Recharts visualizers track and map Hotspot Analytics to instantly identify the city's worst problem areas.

### 🎫 Automated E-Challan Generation
- Built-in digital ticket generator matching the official aesthetic of the Bengaluru Traffic Police.
- Automatically calculates fine amounts based on the violation class (e.g., ₹1000 for Helmet/Seatbelt, ₹1500 for Triple Riding).
- Auto-assigns notice numbers and securely attaches the AI-watermarked evidence.

### 🧠 Predictive Deployment AI (Powered by Gemini)
- Our **Strategic AI Assistant** consumes the live temporal (hourly) and spatial (location-based) telemetry in real-time.
- It automatically generates a "Predictive Deployment Strategy"—instructing traffic police *exactly* which intersection to deploy patrol units to, and at what hour, to maximize interception and reduce gridlock.

---

## 🛠️ Tech Stack

- **Computer Vision & OCR**: Ultralytics YOLOv8, EasyOCR, OpenCV
- **Backend Infrastructure**: FastAPI, Python 3.10+, SQLModel (ORM)
- **Database & Storage**: Supabase (PostgreSQL & Blob Storage Cloud Buckets)
- **Frontend Dashboard**: React, Vite, Tailwind CSS, Recharts
- **Insights Engine**: Google Gemini 2.5 API

---

## 🚀 Quick Start Guide

### 1. Backend Setup

The backend handles the AI inference pipeline, image processing, cloud storage, and database interactions.

```bash
# Navigate to the backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy .env.example to .env and provide your Supabase and Gemini credentials
cp .env.example .env

# Start the FastAPI server
uvicorn main:app --reload
```
*API runs at `http://localhost:8000`*

### 2. Frontend Setup

The frontend provides the Command Center UI, live dashboard, and E-Challan generators.

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
| `/api/analyze/` | `POST` | Upload an image with `location` form data to run the full detection pipeline. |
| `/api/violations/` | `GET` | Retrieve a paginated log of all processed violations. |
| `/api/violations/{plate}`| `GET` | Retrieve the specific violation history for a single vehicle. |
| `/api/analytics/` | `GET` | Fetch aggregated temporal, spatial, and statistical violation data. |
| `/api/analytics/insights`| `GET` | Generate actionable Predictive Deployment Strategies using Gemini AI. |

---

<div align="center">
  <p><i>Manual enforcement doesn't scale. TrafficEye AI does.</i></p>
</div>
