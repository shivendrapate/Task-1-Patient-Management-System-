from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import create_user
from app.services.user_service import get_user_by_id
from app.services.user_service import list_users
from app.services.user_service import update_user
from app.services.user_service import delete_user


from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user_api(user_data: UserCreate ,db: Session = Depends(get_db)):
    
    return create_user(db, user_data)   


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id:int ,db: Session = Depends(get_db)):
    
    return get_user_by_id(db, user_id)

@router.get("/", response_model=List[UserResponse])
def list_all_users(db: Session = Depends(get_db)):
    return list_users(db)


@router.put("/{user_id}",response_model=UserResponse)
def update_user_api(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    
    return update_user(db,user_id,user_data)

@router.delete("/{user_id}")
def delete_user_api(
    user_id: int,
    db: Session = Depends(get_db)
):
    return delete_user(db, user_id)

