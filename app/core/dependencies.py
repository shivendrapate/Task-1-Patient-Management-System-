from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from app.db.deps import get_db
from app.models.user import User
from app.core.security import SECRET_KEY, ALGORITHM
from fastapi.logger import logging
from fastapi.security import OAuth2PasswordBearer


oauth_2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')


# This fuction by extracts user id by accepting token
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth_2_scheme)):
    print(token)
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id  is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Token")
    except:
        
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credntials")
    
    user = db.query(User).filter(User.id == int(user_id)).first()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user

def require_role(allowed_roles: list[str]):

    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access forbidden"
            )
        return current_user

    return role_checker
    
    