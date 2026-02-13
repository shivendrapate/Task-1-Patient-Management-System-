from sqlalchemy import Integer, String, Boolean, Float, ForeignKey, Column
from sqlalchemy.orm import relationship
from app.db.base import Base

class Patient(Base):
    
    __tablename__ =  "patients"
    id  = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    height = Column(Float, nullable=True, default=None)
    weight = Column(Float, nullable=True, default=None)
    bmi = Column(Float, nullable=True, default=None)
    disease = Column(String(255), nullable=True, default=None)

    
    doctors = relationship(
    "DoctorPatient",
    back_populates="patient",
    cascade="all, delete-orphan"
    )
    user = relationship("User", backref = "patient")

