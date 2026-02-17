export type UserRole = "patient" | "doctor" | "admin" | "super_admin";

export interface UserCreate {
  username: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface UserUpdate {
  username?: string;
  is_active?: boolean;
}

export interface UserResponse {
  id: number;
  doctor_id?: number | null;
  patient_id?: number | null;
  username: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: "bearer" | string;
}

export interface AuthTokenPayload {
  sub: string;
  role: UserRole;
  exp: number;
}

export interface ApiError {
  status: number;
  message: string;
  raw?: unknown;
}

export interface DoctorAssignmentCreate {
  doctor_id: number;
  patient_id: number;
}

export interface DoctorProfile {
  id: number;
  user_id: number;
  specialization: string;
}

export interface PatientProfile {
  id: number;
  user_id: number;
  height: number | null;
  weight: number | null;
  bmi: number | null;
  disease: string | null;
}

export interface UserListParams {
  limit?: number;
  offset?: number;
  is_active?: boolean;
  role?: UserRole;
}
