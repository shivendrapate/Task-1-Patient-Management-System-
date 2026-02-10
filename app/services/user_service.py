from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from fastapi import HTTPException, status
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def hash_password(password:str ) -> str:
    return pwd_context.hash(password)

def create_user(db: Session, user_data: UserCreate) -> User:
    
    existing_user = db.query(User).filter((User.username == user_data.username) | (User.email == user_data.email)).first()
    
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = "User or email already exist!")
    
    data = user_data.model_dump(exclude={"password"})
    
    user = User(**data)
    
    user.password_hashed = hash_password(user_data.password)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user

