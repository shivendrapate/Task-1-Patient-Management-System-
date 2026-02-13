from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.doctor_patient import DoctorPatient
from app.models.doctor import Doctor
from app.models.patient import Patient


def assign_patient_to_doctor(db: Session, doctor_id: int, patient_id: int):
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    patient = db.query(Patient).filter(Patient.id == patient_id).first()

    if not doctor or not patient:
        raise HTTPException(status_code=404, detail="Doctor or Patient not found")

    existing = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.patient_id == patient_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already assigned")

    relation = DoctorPatient(
        doctor_id=doctor_id,
        patient_id=patient_id
    )

    db.add(relation)
    db.commit()
    db.refresh(relation)

    return {"message": "Patient assigned to doctor"}

def get_doctor_patients(db: Session, doctor_id: int):
    relations = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id
    ).all()

    return [relation.patient for relation in relations]

def get_patient_doctors(db: Session, patient_id: int):
    relations = db.query(DoctorPatient).filter(
        DoctorPatient.patient_id == patient_id
    ).all()

    return [relation.doctor for relation in relations]
