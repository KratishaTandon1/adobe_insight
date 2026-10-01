# # backend/app/main.py

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.staticfiles import StaticFiles
# from app.routes import pdf, recommend

# app = FastAPI(title="Adobe Hackathon Backend")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Serve uploaded PDFs
# app.mount("/static", StaticFiles(directory="uploaded_pdfs"), name="static")

# # Route includes
# app.include_router(pdf.router, prefix="/api/pdf")
# app.include_router(recommend.router, prefix="/api/recommend")

# @app.get("/")
# def root():
#     return {"message": "Backend is running"}


# app.py (previously backend/app/main.py)

from fastapi import FastAPI
from dotenv import load_dotenv

# This MUST be at the very top, before any of your other app imports.
load_dotenv()

# Now, with the environment loaded, we can safely import everything else.
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# --- UPDATED IMPORTS ---
# The paths are now relative to the root directory
from backend.app import models
from backend.app.database import engine
from backend.app.routes import pdf, recommend, insights, chat, podcast, summarize,debate

# This creates the database table if it doesn't exist
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Adobe Hackathon Backend")

# NOTE: For deployment, you may want to update allow_origins
# to your frontend's actual URL instead of just localhost.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://reading-chi.vercel.app/"], # Add your deployed frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated audio files from a folder in the root directory
app.mount("/audio", StaticFiles(directory="generated_audio"), name="audio")

# --- Route includes (these do not need to be changed) ---
app.include_router(pdf.router, prefix="/api/pdf", tags=["PDFs"])
app.include_router(recommend.router, prefix="/api/recommend", tags=["Recommendations"])
app.include_router(insights.router, prefix="/api", tags=["Insights"])
app.include_router(chat.router, prefix="/api", tags=["Chat"])
app.include_router(podcast.router, prefix="/api", tags=["Podcast"])
app.include_router(summarize.router, prefix="/api", tags=["Summarize"]) # 2. Add the summarize router
app.include_router(debate.router, prefix="/api", tags=["Debate"]) # 2. Add the debate router

@app.get("/")
def root():
    return {"message": "Backend is running"}