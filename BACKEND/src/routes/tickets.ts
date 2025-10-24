import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { chatService } from "../services/chat.service"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// ✅ Confirmar ticket (el usuario acepta crear el ticket)
router.post(
  "/confirm",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ticketNumber } = req.body
    const ticket = await chatService.confirmTicket(ticketNumber, Number(req.userId!))
    res.status(200).json({ 
      success: true, 
      ticket,
      message: "Ticket confirmado exitosamente"
    })
  }),
)

// ✅ Cancelar ticket (el usuario rechaza crear el ticket)
router.post(
  "/cancel",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { ticketNumber } = req.body
    await chatService.cancelTicket(ticketNumber, Number(req.userId!))
    res.status(200).json({ 
      success: true,
      message: "Ticket cancelado"
    })
  }),
)

export default router