import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. We use os.environ.get() to read the variable from the environment.
#    This is loaded by the load_dotenv() call in your main.py.
# SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")
SQLALCHEMY_DATABASE_URL = "postgresql://neondb_owner:npg_LpBTs1dfhqU5@ep-bitter-dust-ae6cmacy-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# 2. We add a check to ensure the app doesn't start if the URL is missing.
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()