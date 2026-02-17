import { HttpResponse, http } from "msw";
import { normalizeApiError } from "../lib/error";
import { TOKEN_KEY } from "../lib/token";
import { userService } from "../services/userService";
import { api, server, validToken } from "./mocks/server";

describe("http interceptor and error normalization", () => {
  test("clears auth token on 401 response", async () => {
    localStorage.setItem(TOKEN_KEY, validToken);

    server.use(
      http.get(`${api}/users/:id`, () =>
        HttpResponse.json(
          {
            detail: "Could not validate credentials",
          },
          { status: 401 },
        ),
      ),
    );

    await expect(userService.getById(1)).rejects.toMatchObject({ status: 401 });
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
  });

  test("normalizes backend detail array errors", () => {
    const fakeError = {
      isAxiosError: true,
      response: {
        status: 422,
        data: {
          detail: [
            {
              loc: ["body", "username"],
              msg: "Field required",
            },
          ],
        },
      },
      message: "Unprocessable",
    };

    const result = normalizeApiError(fakeError);
    expect(result.status).toBe(422);
    expect(result.message).toContain("Field required");
  });
});
