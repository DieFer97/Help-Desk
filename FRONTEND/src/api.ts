const BACKEND_URL = "http://localhost:3000"

export const apiCall = async (endpoint: string, options: RequestInit = {}, token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(typeof options.headers === "object" && options.headers !== null
      ? (options.headers as Record<string, string>)
      : {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`)
  }

  return response.json()
}

export const enviarPregunta = async (pregunta: string, token: string): Promise<string> => {
  try {
    const response = await apiCall(
      "/api/chat",
      {
        method: "POST",
        body: JSON.stringify({ message: pregunta }),
      },
      token,
    )

    return response.respuesta || "No se recibió respuesta válida."
  } catch (error) {
    console.error("Error al enviar la pregunta:", error)
    return "Hubo un error, inténtalo de nuevo."
  }
}
