import axios from "axios";
import type { ApiError } from "../types/api";

function normalizeDetail(detail: unknown): string {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const lines = detail.map((item) => {
      if (item && typeof item === "object" && "msg" in item) {
        return String((item as { msg: unknown }).msg);
      }
      return JSON.stringify(item);
    });

    return lines.join("; ");
  }

  if (detail && typeof detail === "object") {
    return JSON.stringify(detail);
  }

  return "Unexpected error";
}

export function normalizeApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 500;
    const data = error.response?.data;

    if (data && typeof data === "object") {
      const content = data as {
        error?: { message?: unknown };
        detail?: unknown;
        message?: unknown;
      };

      if (content.error?.message) {
        return {
          status,
          message: String(content.error.message),
          raw: data,
        };
      }

      if (content.detail !== undefined) {
        return {
          status,
          message: normalizeDetail(content.detail),
          raw: data,
        };
      }

      if (content.message !== undefined) {
        return {
          status,
          message: String(content.message),
          raw: data,
        };
      }
    }

    return {
      status,
      message: error.message || "Request failed",
      raw: data,
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      message: error.message,
      raw: error,
    };
  }

  return {
    status: 500,
    message: "Unknown error",
    raw: error,
  };
}
