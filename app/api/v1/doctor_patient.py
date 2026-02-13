from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.services.doctor_patient_service import assign_patient_to_doctor, get_doctor_patients, get_patient_doctors
from app.core.dependencies import require_role
from app.core.dependencies import get_current_user


router = APIRouter(prefix="/assignments", tags=["Doctor-Patient"])


@router.post("/")
def assign(
    doctor_id: int,
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "super_admin"]))
):
    return assign_patient_to_doctor(db, doctor_id, patient_id)

@router.get("/doctor/{doctor_id}/patients")
def view_doctor_patients(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # Admin can see anyone
    if current_user.role in ["admin", "super_admin"]:
        return get_doctor_patients(db, doctor_id)

    # Doctor can only see own patients
    if current_user.role == "doctor":
        if current_user.doctor_profile.id != doctor_id:
            raise HTTPException(status_code=403, detail="Access denied")
        return get_doctor_patients(db, doctor_id)

    raise HTTPException(status_code=403, detail="Access denied")


@router.get("/patient/{patient_id}/doctors")
def view_patient_doctors(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role in ["admin", "super_admin"]:
        return get_patient_doctors(db, patient_id)

    if current_user.role == "patient":
        if current_user.patient_profile.id != patient_id:
            raise HTTPException(status_code=403, detail="Access denied")
        return get_patient_doctors(db, patient_id)

    raise HTTPException(status_code=403, detail="Access denied")
