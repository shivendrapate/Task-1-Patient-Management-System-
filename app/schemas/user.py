from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    patient = "patient"
    doctor = "doctor"
    admin = "admin"
    super_admin = "super_admin"

# Base Schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str
    
class UserUpdate(BaseModel):
    username: str | None = None
    is_active: bool | None = None

class UserResponse(UserBase):
    id: int
    doctor_id: int | None = None
    patient_id: int | None = None
    is_active: bool
    created_at : datetime
    updated_at : datetime
    
    class Config:
        from_attributes = True

