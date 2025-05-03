export function checkToken(tokenFromCaller?: string): string {
  const token = tokenFromCaller ?? sessionStorage.getItem("token");

  if (!token) {
    console.error("No token provided or found in sessionStorage");
    throw new Error("Unauthorized: token missing");
  }

  return token;
}

export function getHeaders(): { Authorization: string } {
  const token = checkToken();
  return {
    Authorization: `Bearer ${token}`,
  };
}
