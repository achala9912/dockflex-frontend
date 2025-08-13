// const USER = "USER";
// const TOKEN = "TOKEN";

// export const getLocalUser = () =>
//   JSON.parse(localStorage.getItem(USER) || "{}");

// export const setLocalUser = (user = {}) =>
//   localStorage.setItem(USER, JSON.stringify(user || {}));

// export const getToken = () => `Bearer ${localStorage.getItem(TOKEN)}`;

// export const setToken = (token = '') => localStorage.setItem(TOKEN, token);

// export const logoutUser = () => {
//   localStorage.removeItem(TOKEN);
//   localStorage.removeItem(USER);
// };

const USER = "USER";
const TOKEN = "TOKEN";

export const getLocalUser = () => {
  if (typeof window === "undefined") return {};
  return JSON.parse(sessionStorage.getItem(USER) || "{}");
};

export const setLocalUser = (user = 
  {}) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(USER, JSON.stringify(user || {}));
  }
};

export const getToken = () => {
  if (typeof window === "undefined") return "";
  const token = sessionStorage.getItem(TOKEN);
  return token ? `Bearer ${token}` : "";
};

export const setToken = (token = "") => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(TOKEN, token);
  }
};

export const logoutUser = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(TOKEN);
    sessionStorage.removeItem(USER);
  }
};
