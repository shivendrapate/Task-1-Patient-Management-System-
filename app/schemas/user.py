from pydantic import BaseModel, EmailStr
from datetime import datetime


# Base Schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: str


class UserCreate(UserBase):
    password: str
    
class UserUpdate(BaseModel):
    username: str | None = None
    is_active: bool | None = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at : datetime
    updated_at : datetime
    
    class Config:
        orm_mode = True


