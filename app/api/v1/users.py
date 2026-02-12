from fastapi import APIRouter, Depends, HTTPException , status 
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import create_user
from app.services.user_service import get_user_by_id
from app.services.user_service import list_users
from app.services.user_service import update_user
from app.services.user_service import delete_user
from app.services.user_service import patch_user
from app.services.user_service import soft_delete_user
from app.core.dependencies import get_current_user
from app.core.dependencies import require_role
from app.services.user_service import restore_user

from typing import List

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
def create_user_api(user_data: UserCreate ,db: Session = Depends(get_db)):
    
    return create_user(db, user_data)   


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.id != user_id and current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Not allowed"
        )

    return get_user_by_id(db, user_id)


@router.get("/", response_model=list[UserResponse])
def list_all_users(
    limit: int = 10,
    offset: int = 0,
    is_active: bool | None = None,
    role: str | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "super_admin"]))
):
    return list_users(db, limit, offset, is_active, role)



@router.put("/{user_id}",response_model=UserResponse)
def update_user_api(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    
    return update_user(db,user_id,user_data)

@router.delete("/{user_id}")
def delete_user_api(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(['admin','super_admin']))
):
    return delete_user(db, user_id)

@router.delete("/{user_id}/soft_delete_user")
def soft_delete_user_api(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(['admin','super_admin']))
):
    return soft_delete_user(db, user_id)

@router.patch("/{user_id}", response_model=UserResponse)
def patch_user_api(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    return patch_user(db, user_id, user_data)

@router.post("/{user_id}/restore")
def restore_user_api(
  user_id: int,
  db:Session = Depends(get_db),
  current_user = Depends(require_role(["admin","super_admin"]))  
):
    return restore_user(db, user_id)