from fastapi import FastAPI
 
app = FastAPI(title = "Patient Management System")

@app.get("/")
def health_check():
    return {"Status:": "Healthy"}
