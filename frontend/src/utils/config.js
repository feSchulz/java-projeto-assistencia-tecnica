export const api = "http://localhost:8080/api/auth/v1";
export const apiBase = "http://localhost:8080/api";
export const requestConfig = (method, data, token, image) => {
    const headers = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (image) {
        return { method, body: data, headers };
    }

    if (method === "DELETE" || data == null) {
        return { method, headers };
    }

    headers["Content-Type"] = "application/json";
    return {
        method,
        headers,
        body: JSON.stringify(data),
    };
};
