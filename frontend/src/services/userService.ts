import { http } from "../lib/http";
import { normalizeApiError } from "../lib/error";
import type {
  UserCreate,
  UserListParams,
  UserResponse,
  UserUpdate,
} from "../types/api";

function buildUserQuery(params: UserListParams): URLSearchParams {
  const query = new URLSearchParams();

  if (params.limit !== undefined) {
    query.append("limit", String(params.limit));
  }

  if (params.offset !== undefined) {
    query.append("offset", String(params.offset));
  }

  if (params.is_active !== undefined) {
    query.append("is_active", String(params.is_active));
  }

  if (params.role !== undefined) {
    query.append("role", params.role);
  }

  return query;
}

export const userService = {
  async create(data: UserCreate): Promise<UserResponse> {
    try {
      const response = await http.post<UserResponse>("/users/", data);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async getById(userId: number): Promise<UserResponse> {
    try {
      const response = await http.get<UserResponse>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async list(params: UserListParams = {}): Promise<UserResponse[]> {
    try {
      const response = await http.get<UserResponse[]>("/users/", {
        params: buildUserQuery(params),
      });
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async put(userId: number, data: UserUpdate): Promise<UserResponse> {
    try {
      const response = await http.put<UserResponse>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async patch(userId: number, data: UserUpdate): Promise<UserResponse> {
    try {
      const response = await http.patch<UserResponse>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async delete(userId: number): Promise<{ Message: string }> {
    try {
      const response = await http.delete<{ Message: string }>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async softDelete(userId: number): Promise<{ Message: string }> {
    try {
      const response = await http.delete<{ Message: string }>(
        `/users/${userId}/soft_delete_user`,
      );
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async restore(userId: number): Promise<{ Message: string }> {
    try {
      const response = await http.post<{ Message: string }>(
        `/users/${userId}/restore`,
      );
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
