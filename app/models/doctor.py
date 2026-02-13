from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    specialization = Column(String(100), nullable=False)

    patients = relationship(
    "DoctorPatient",
    back_populates="doctor",
    cascade="all, delete-orphan"
    )
    user = relationship("User", backref="doctor")
