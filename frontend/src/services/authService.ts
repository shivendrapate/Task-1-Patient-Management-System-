import { http } from "../lib/http";
import { normalizeApiError } from "../lib/error";
import type { LoginFormValues, LoginResponse } from "../types/api";

export const authService = {
  async login(form: LoginFormValues): Promise<LoginResponse> {
    try {
      const body = new URLSearchParams();
      body.append("username", form.username);
      body.append("password", form.password);

      const response = await http.post<LoginResponse>("/auth/login", body, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },

  async refresh(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await http.post<LoginResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
