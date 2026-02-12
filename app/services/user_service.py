from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate
from fastapi import HTTPException, status
from passlib.context import CryptContext
from app.schemas.user import UserUpdate
from app.core.security import create_access_token
from datetime import datetime


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


def get_user_by_id(db: Session , user_id: int)-> User:
    user = db.query(User).filter(user_id == User.id).first()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This user does not exist!")
    
    return user
    
def list_users(
    db: Session,
    limit: int = 10,
    offset: int = 0,
    is_active: bool | None = None,
    role: str | None = None
):
    query = db.query(User).filter(User.delete_at.is_(None))
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    if role is not None:
        query = query.filter(User.role  == role)
    
    return query.offset(offset).limit(limit).all()
    
    


def update_user(
    db: Session,
    user_id: int,
    user_data: UserUpdate
) -> User:
    user = get_user_by_id(db, user_id)

    if user_data.username is not None:
        user.username = user_data.username

    if user_data.is_active is not None:
        user.is_active = user_data.is_active

    db.commit()
    db.refresh(user)

    return user

def delete_user(db: Session , user_id : int):
    user = get_user_by_id(db,user_id)
    
    db.delete(user)
    db.commit()
    
    return {"Message":"User deleted Successfully!"}
    

def patch_user(
    db: Session,
    user_id: int,
    user_data: UserUpdate
) -> User:
    user = get_user_by_id(db, user_id)

    update_data = user_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not registered")
    
    if pwd_context.verify(password, user.password_hashed) is False:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail = "Enter Correct password")

    return user


def login_user(db: Session , username: str, password: str):
    user  = authenticate_user(db, username, password)
    
    token = create_access_token({"sub": str(user.id), "role": user.role})
    
    return {"access_token": token, "token_type": "bearer"}

def soft_delete_user(db: Session, user_id: int):
    user = get_user_by_id(db,user_id)
    
    user.delete_at = datetime.utcnow()
    db.commit()
    
    return {"Message":"User deleted Successfully!"}


def restore_user(db:Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not exist!")
    
    if user.delete_at is None:
        raise HTTPException(status_code=status.HTTP_406_NOT_ACCEPTABLE, detail = "User not deleted!")
    
    user.delete_at = None
    db.commit()
    db.refresh(user)
    
    return {"Message":"User Restored"}