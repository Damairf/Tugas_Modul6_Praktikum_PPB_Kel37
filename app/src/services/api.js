// src/services/api.js
import { BACKEND_URL } from "./config.js";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export const Api = {
  baseUrl: BACKEND_URL,
  token: null,

  setToken(token) {
    this.token = token;
  },

  async request(path, options = {}) {
    if (!this.baseUrl) throw new Error("BACKEND_URL is not set in app.json");
    const headers = {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    const response = await fetch(`${this.baseUrl}${path}`, {
      headers,
      ...options,
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Request failed with status ${response.status}`);
    }
    return response.status === 204 ? null : response.json();
  },

  // readings with pagination: returns { data, page, limit }
  getSensorReadings(page = 1, limit = 10) {
    return this.request(`/api/readings?page=${page}&limit=${limit}`);
  },

  getThresholds() {
    return this.request("/api/thresholds");
  },
  createThreshold(payload) {
    return this.request("/api/thresholds", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
