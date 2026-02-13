from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.db.session import engine
from app.api.v1.users import router as user_router
from app.api.v1.auth import router as auth_router

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi import Request
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.api.v1.doctor_patient import router as dp_router

import time
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title = "Patient Management System")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = round((time.time() - start_time) * 1000, 2)

    logger.info(
        f"{request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Time: {process_time}ms"
    )

    return response


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            }
        }
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail
            }
        }
    )

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()

    response = await call_next(request)

    process_time = round((time.time() - start_time) * 1000, 2)

    logger.info(
        f"{request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Time: {process_time}ms"
    )

    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    print("Middleware triggered")
    start_time = time.time()
    response = await call_next(request)
    print("Middleware completed")
    return response

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(dp_router)


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
    