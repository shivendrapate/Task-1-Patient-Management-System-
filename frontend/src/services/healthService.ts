import { http } from "../lib/http";
import { normalizeApiError } from "../lib/error";

export const healthService = {
  async check(): Promise<Record<string, string>> {
    try {
      const response = await http.get<Record<string, string>>("/");
      return response.data;
    } catch (error) {
      throw normalizeApiError(error);
    }
  },
};
