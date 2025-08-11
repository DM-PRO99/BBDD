function getAuthHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { "Authorization": `Bearer ${token}` } : {};
}

export async function get(url) {
  try {
    const response = await fetch(url, {
      headers: {
        ...getAuthHeaders()
      }
    });
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedUser");
      location.href = "/";
      return;
    }
    return await response.json();
  } catch (error) {
    console.error("Error en GET:", error);
  }
}

export async function post(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(body)
    });
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedUser");
      location.href = "/";
      return;
    }
    return await response.json();
  } catch (error) {
    console.error("Error en POST:", error);
  }
}

export async function update(url, id, body) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      },
      body: JSON.stringify(body)
    });
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedUser");
      location.href = "/";
      return;
    }
    return await response.json();
  } catch (error) {
    console.error("Error en PUT:", error);
    throw error;
  }
}

export async function deletes(url, id) {
  try {
    const response = await fetch(`${url}/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeaders()
      }
    });
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("loggedUser");
      location.href = "/";
      return;
    }
    return response.ok;
  } catch (error) {
    console.error("Error en DELETE:", error);
    throw error;
  }
}
