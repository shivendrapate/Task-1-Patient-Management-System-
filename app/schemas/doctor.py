from pydantic import BaseModel

class DoctorBase(BaseModel):
    specialization: str

class DoctorCreate(DoctorBase):
    pass

class DoctorResponse(DoctorBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
