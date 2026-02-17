import { setupServer } from "msw/node";
import { HttpResponse, http } from "msw";

const api = "/api";

const validToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6ImFkbWluIiwiZXhwIjo0MTAyNDQ0ODAwfQ.signature";

const user = {
  id: 1,
  username: "alice",
  email: "alice@example.com",
  role: "admin",
  is_active: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

export const handlers = [
  http.get(`${api}/`, () => HttpResponse.json({ "Status:": "Healthy" })),

  http.post(`${api}/auth/login`, async () => {
    return HttpResponse.json({ access_token: validToken, token_type: "bearer" });
  }),

  http.post(`${api}/users/`, async () => HttpResponse.json(user)),

  http.get(`${api}/users/`, () => HttpResponse.json([user])),

  http.get(`${api}/users/:id`, ({ params }) =>
    HttpResponse.json({
      ...user,
      id: Number(params.id),
    }),
  ),

  http.put(`${api}/users/:id`, async ({ request, params }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...user, ...payload, id: Number(params.id) });
  }),

  http.patch(`${api}/users/:id`, async ({ request, params }) => {
    const payload = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({ ...user, ...payload, id: Number(params.id) });
  }),

  http.delete(`${api}/users/:id`, () =>
    HttpResponse.json({ Message: "User deleted Successfully!" }),
  ),

  http.delete(`${api}/users/:id/soft_delete_user`, () =>
    HttpResponse.json({ Message: "User deleted Successfully!" }),
  ),

  http.post(`${api}/users/:id/restore`, () =>
    HttpResponse.json({ Message: "User Restored" }),
  ),

  http.post(`${api}/assignments/`, () =>
    HttpResponse.json({ message: "Patient assigned to doctor" }),
  ),

  http.get(`${api}/assignments/doctor/:id/patients`, () =>
    HttpResponse.json([
      {
        id: 1,
        user_id: 21,
        height: null,
        weight: null,
        bmi: null,
        disease: "Not specified",
      },
    ]),
  ),

  http.get(`${api}/assignments/patient/:id/doctors`, () =>
    HttpResponse.json([
      {
        id: 2,
        user_id: 31,
        specialization: "General",
      },
    ]),
  ),
];

export const server = setupServer(...handlers);
export { api, validToken };
