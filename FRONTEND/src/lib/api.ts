export async function enviarMensaje(message: string): Promise<string> {
  try {
    const response = await fetch("http://localhost:4000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.respuesta || "No se pudo generar una respuesta.";
  } catch (error) {
    console.error("Error en la API:", error);
    return "Ocurrió un error al enviar tu mensaje.";
  }
}
