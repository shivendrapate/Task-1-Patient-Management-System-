from pydantic import BaseModel

class PatientBase(BaseModel):
    height: float | None = None
    weight: float | None = None
    bmi: float | None = None
    disease: str | None = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True
