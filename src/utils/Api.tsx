const BASE_URL = "http://localhost:3000";

export function getUsers<T>(): Promise<T | unknown> {
  const uri = `${BASE_URL}/users/`;
  return fetch(uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function updatePersonalData<T>(
  token: string,
  name?: string,
  email?: string,
  avatar?: string,
  phones?: [string],
  password?: string
): Promise<T | unknown> {
  const user = { name, email, avatar, phones, password };
  let uri = `${BASE_URL}/users/`;
  Object.keys(user).forEach((item, index) => {
    if (index === 0) {
      uri += "?";
    } else {
      uri += "&";
    }
    if (item === "phones") {
      let stringifyArray = "[" as string;
      (Object.values(user)[index] as [string]).forEach(
        (phone: string, num: number) => {
          stringifyArray += `${encodeURI(phone)},`;
          if (num === (Object.values(user)[index] as [string]).length - 1) {
            stringifyArray += "]";
          }
        }
      );
      uri += `phones=${stringifyArray}`;
    } else {
      uri += `${item}=${encodeURI(Object.values(user)[index] as string)}`;
    }
  });
  return fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteUser<T>(token: string): Promise<T | unknown> {
  const uri = `${BASE_URL}/users/`;
  return fetch(uri, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export function getContacts<T>(token: string): Promise<T | unknown> {
  const uri = `${BASE_URL}/contacts/`;
  return fetch(uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function addContact<T>(
  token: string,
  name?: string,
  email?: string,
  avatar?: string,
  phones?: [string],
  quote?: string
): Promise<T | unknown> {
  const contact = { name, email, avatar, phones, quote };
  let uri = `${BASE_URL}/contacts/`;
  Object.keys(contact).forEach((item, index) => {
    if (index === 0) {
      uri += "?";
    } else {
      uri += "&";
    }
    if (item === "phones") {
      let stringifyArray = "[" as string;
      (Object.values(contact)[index] as [string]).forEach(
        (phone: string, num: number) => {
          stringifyArray += `${encodeURI(phone)},`;
          if (num === (Object.values(contact)[index] as [string]).length - 1) {
            stringifyArray += "]";
          }
        }
      );
      uri += `phones=${stringifyArray}`;
    } else {
      uri += `${item}=${encodeURI(Object.values(contact)[index] as string)}`;
    }
  });
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function updateContact<T>(
  token: string,
  name?: string,
  email?: string,
  avatar?: string,
  phones?: [string],
  quote?: string,
  id?: string
): Promise<T | unknown> {
  const contact = { name, email, avatar, phones, quote, id };
  let uri = `${BASE_URL}/contacts/`;
  Object.keys(contact).forEach((item, index) => {
    if (index === 0) {
      uri += "?";
    } else {
      uri += "&";
    }
    if (item === "phones") {
      let stringifyArray = "[" as string;
      (Object.values(contact)[index] as [string]).forEach(
        (phone: string, num: number) => {
          stringifyArray += `${encodeURI(phone)},`;
          if (num === (Object.values(contact)[index] as [string]).length - 1) {
            stringifyArray += "]";
          }
        }
      );
      uri += `phones=${stringifyArray}`;
    } else {
      uri += `${item}=${encodeURI(Object.values(contact)[index] as string)}`;
    }
  });
  return fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteContact<T>(
  token: string,
  id?: string
): Promise<T | unknown> {
  let uri = `${BASE_URL}/contacts/`;
  if (id) {
    uri += `?id=${id}`;
  }
  return fetch(uri, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export function addFriend<T>(
  token: string,
  email: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/friends/?email=${encodeURI(email)}`;
  return fetch(uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function updateFriendData<T>(
  token: string,
  email?: string,
  avatar?: string,
  phones?: [string],
  quote?: string
): Promise<T | unknown> {
  const contact = { email, avatar, phones, quote };
  let uri = `${BASE_URL}/contacts/`;
  Object.keys(contact).forEach((item, index) => {
    if (index === 0) {
      uri += "?";
    } else {
      uri += "&";
    }
    if (item === "phones") {
      let stringifyArray = "[" as string;
      (Object.values(contact)[index] as [string]).forEach(
        (phone: string, num: number) => {
          stringifyArray += `${encodeURI(phone)},`;
          if (num === (Object.values(contact)[index] as [string]).length - 1) {
            stringifyArray += "]";
          }
        }
      );
      uri += `phones=${stringifyArray}`;
    } else {
      uri += `${item}=${encodeURI(Object.values(contact)[index] as string)}`;
    }
  });
  return fetch(uri, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      try {
        if (res.ok) {
          return res.json();
        }
      } catch (e) {
        return e;
      }
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

export function deleteFriend<T>(
  token: string,
  email: string
): Promise<T | unknown> {
  const uri = `${BASE_URL}/contacts/?email=${email}`;
  return fetch(uri, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
