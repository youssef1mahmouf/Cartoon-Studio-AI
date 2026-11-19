// Cartoon Studio AI — Shared API client
// Integration diagram context (code comment):
//
// All API services below call the same backend domain graph exposed by
// FastAPI at /api/v1:
//   Project → Episodes → Script / Scenes / Characters / Backgrounds /
//   Voices → Render Jobs → Pipeline Jobs
//
// Each service module owns the endpoints for one domain entity and returns
// the shared types from @/types so the stores and UI speak one domain language.

import axios, { AxiosInstance } from "axios";

const API_BASE =
  (typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_API_URL
    ? String(process.env.NEXT_PUBLIC_API_URL).replace(/\/+$/, "")
    : "") + "/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export { API_BASE as API_BASE_URL };