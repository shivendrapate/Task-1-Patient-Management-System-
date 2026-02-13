from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.services.doctor_patient_service import assign_patient_to_doctor
from app.core.dependencies import require_role

router = APIRouter(prefix="/assignments", tags=["Doctor-Patient"])


@router.post("/")
def assign(
    doctor_id: int,
    patient_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "super_admin"]))
):
    return assign_patient_to_doctor(db, doctor_id, patient_id)
