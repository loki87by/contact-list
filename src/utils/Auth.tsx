import { LoginResData } from "../utils/types";

const BASE_URL = "http://localhost:3000";

export function register<T>(
  email: string,
  password: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/registry/?email=${email}&password=${password}`;
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
      try {
        if (res.status === 200) {
          return res.json();
        }

        if (res.status === 400) {
          return Promise.reject(new Error(`Ошибка: ${res.status}`));
        }

        if (res.status === 401) {
          return Promise.reject(new Error(`Ошибка: ${res.status}`));
        }
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
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
    .catch((err) => console.log(err));
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
