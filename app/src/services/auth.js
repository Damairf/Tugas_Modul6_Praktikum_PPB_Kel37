// src/services/auth.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Api } from "./api.js";

const TOKEN_KEY = "iotwatch_token";
const USER_KEY = "iotwatch_user";

export const Auth = {
  token: null,
  user: null,

  async init() {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (token) {
      this.setToken(token);
      this.user = userJson ? JSON.parse(userJson) : null;
    }
    return { token: this.token, user: this.user };
  },

  setToken(token) {
    this.token = token;
    Api.setToken(token);
    AsyncStorage.setItem(TOKEN_KEY, token).catch(() => {});
  },

  async login(username, password) {
    const resp = await fetch(`${Api.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(t || `Login failed ${resp.status}`);
    }
    const body = await resp.json();
    this.setToken(body.token);
    this.user = body.user;
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(body.user));
    return body;
  },

  async logout() {
    this.token = null;
    this.user = null;
    Api.setToken(null);
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  async me() {
    if (!this.token) return null;
    const resp = await fetch(`${Api.baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!resp.ok) return null;
    const body = await resp.json();
    this.user = body.user;
    return body.user;
  },
};
