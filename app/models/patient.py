from sqlalchemy import Integer, String, Boolean, Float, ForeignKey, Column
from sqlalchemy.orm import relationship
from app.db.base import Base

class Patient(Base):
    
    __tablename__ =  "patients"
    id  = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    height = Column(Float)
    weight = Column(Float)
    bmi = Column(Float)
    disease = Column(String(255))
    
    user = relationship("User", backref = "patient")

