import axios from 'axios';
import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el campo 'message'" });
    }

    const webhookUrl = 'http://localhost:5678/webhook/ia-soporte-facturacion';

    const response = await axios.post(webhookUrl, { question: message });

    const aiRespuesta = response.data.respuesta || "No se obtuvo respuesta del agente.";

    res.json({ respuesta: aiRespuesta });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: "Error al comunicarse con la IA" });
  }
});

export default router;
