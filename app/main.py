from fastapi import FastAPI
from app.db.session import engine
 
 
app = FastAPI(title = "Patient Management System")

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
    