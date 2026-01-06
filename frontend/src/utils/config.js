export const api = "http://localhost:8080/api";


export const requestConfig = (method, data, token, image) => {
    let config;
    if (image) {
        config = {
            method: method,
            body: data,
            headers: { Authorization: token ? `Bearer ${token}` : "" },
        };
    } else if (method === "DELETE" || data === null) {
        config = {
            method: method,
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        };
    } else {
        config = {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
        };
    }
    return config;
};
