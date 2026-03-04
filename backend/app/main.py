# main.py
# FastAPI application entry point

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.analyze import router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="PharmaGuard API",
    description="Pharmacogenomic Risk Prediction System",
    version="1.0.0"
)

# CORS — allows React frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "PharmaGuard API is running",
        "docs": "/docs",
        "version": "1.0.0"
    }