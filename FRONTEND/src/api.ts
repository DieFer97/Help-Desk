// FRONTEND/src/api.ts
export const enviarPregunta = async (pregunta: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5678/webhook/ia-soporte-facturacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: pregunta })
    });

    const data = await response.json();
    return data.respuesta; // lo que devuelve tu Code Node en n8n
  } catch (error) {
    console.error('Error al enviar la pregunta al chat:', error);
    return 'Hubo un error, inténtalo de nuevo.';
  }
};
