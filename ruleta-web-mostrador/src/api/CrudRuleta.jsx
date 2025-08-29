import api from "../api/api";

export async function GetPremios(datos) {
  try {
    const response = await api.post("/api/opciones", datos);

    return { error: false, premios: response.data };
  } catch (error) {
    return {
      error: true,
      detail: error.response?.data?.detail || "Error desconocido",
    };
  }
}

export async function GetResultado() {
  try {
    const response = await api.post("/api/premio");

    return { error: false, resultado: response.data };
  } catch (error) {
    return {
      error: true,
      detail: error.response?.data?.detail || "Error desconocido",
    };
  }
}