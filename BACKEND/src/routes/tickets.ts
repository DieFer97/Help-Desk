import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { validateRequest } from "../middleware/validation"
import { ticketService } from "../services/ticket.service"
import { createTicketSchema } from "../utils/schemas"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  "/",
  validateRequest(createTicketSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { asunto, detalle, prioridad } = req.body
    const ticket = await ticketService.createTicket(Number(req.userId!), asunto, detalle, prioridad)
    res.status(201).json(ticket)
  }),
)

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tickets = await ticketService.getUserTickets(Number(req.userId!))
    res.json(tickets)
  }),
)

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const ticket = await ticketService.getTicket(Number(req.params.id), Number(req.userId!))
    res.json(ticket)
  }),
)

router.patch(
  "/:id/status",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { estado } = req.body
    const ticket = await ticketService.updateTicketStatus(Number(req.params.id), Number(req.userId!), estado)
    res.json(ticket)
  }),
)

export default router
