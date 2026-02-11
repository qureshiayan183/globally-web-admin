export function logout() {
  window.localStorage.removeItem("user");
}

export function onErrorLogout() {
  logout();
  window.location.href = "/auth/login";
}

export function handleResponse(data) {
  if (!data) {
    throw new Error("No response data received");
  }

  if (data.error) {
    if (data.code === 3) {
      // onErrorLogout();
    }
    if (data.code === 401) {
      // onErrorLogout();
    }
    throw new Error(data.message || "An error occurred");
  }

  return data;
}
