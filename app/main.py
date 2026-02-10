from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.db.session import engine
from app.api.v1.users import router as user_router
 
 
app = FastAPI(title = "Patient Management System")

app.include_router(user_router)

@app.get("/")
def health_check():
    return {"Status:": "Healthy"}

@app.get("/db-test")
def db_test():
    try:
        with engine.connect():
            pass
        return {"database":"connected"}
    except Exception as e:
        return {"Database ":"error", "detail":str(e)}
    
@app.get("/db-session-test")
def db_session_test(db: Session = Depends(get_db)):
    return {"message": "DB session injected successfully"}
    