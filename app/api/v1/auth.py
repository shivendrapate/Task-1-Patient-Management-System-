from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.schemas.auth import LoginRequest
from app.services.user_service import login_user
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login_user_api(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    
    return login_user(db,form_data.username, form_data.password)

