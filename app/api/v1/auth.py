from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.auth import LoginRequest
from app.services.user_service import login_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login_user_api(login_data: LoginRequest, db: Session = Depends(get_db)):
    
    return login_user(db,login_data.username, login_data.password)

