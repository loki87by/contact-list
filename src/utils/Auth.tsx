import { LoginResData } from "../utils/types";

const BASE_URL = "http://localhost:3000";

export function register<T>(
  email: string,
  password: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/registration/?email=${email}&password=${password}`;
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())
  .catch((err) => err.json())
}

export function login<T>(
  email: string,
  password: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/login/?email=${email}&password=${password}`;
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
          return res.json();
    })
    .catch((err) => {
      return err.json();
    })
    .then((data) => {
      const { token } = data as LoginResData;
      try {
        if (token as string) {
          localStorage.setItem("jwt", token);
        }
        return data;
      } catch (err) {
        return Promise.reject(err);
      }
    })
    .catch((err) => err.json());
}
export function getData<T>(
  token: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/me`;
  return fetch(uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  }).then((res) => {
    try {
      if (res.ok) {
        return res.json();
      }
    } catch (e) {
      return e;
    }
  });
}
