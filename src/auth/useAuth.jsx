// src/auth/useAuth.js
export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return { user };
};
