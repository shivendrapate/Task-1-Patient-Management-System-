from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://patient_user:1111@localhost:5432/patient_db"


engine = create_engine(DATABASE_URL,echo = True)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)