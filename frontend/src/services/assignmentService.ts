import { http } from "../lib/http";
import { normalizeApiError } from "../lib/error";
import type {
  DoctorAssignmentCreate,
  DoctorProfile,
  PatientProfile,
} from "../types/api";

export const assignmentService = {
  async assign(data: DoctorAssignmentCreate): Promise<{ message: string }> {
    try {
      const response = await http.post<{ message: string }>("/assignments/", null, {
        params: {
          doctor_id: data.doctor_id,
          patient_id: data.patient_id,
        },
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getDoctorPatients(doctorId: number): Promise<PatientProfile[]> {
    try {
      const response = await http.get<PatientProfile[]>(
        `/assignments/doctor/${doctorId}/patients`,
      );

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getPatientDoctors(patientId: number): Promise<DoctorProfile[]> {
    try {
      const response = await http.get<DoctorProfile[]>(
        `/assignments/patient/${patientId}/doctors`,
      );

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
