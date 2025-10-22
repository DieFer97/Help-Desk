import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { adminService } from "../services/admin.service"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.get(
  "/stats",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const stats = await adminService.getStats()
    res.json(stats)
  }),
)

router.get(
  "/tickets",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const tickets = await adminService.getAllTickets()
    res.json(tickets)
  }),
)

router.patch(
  "/tickets/:id/status",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { estado } = req.body
    const ticket = await adminService.updateTicketStatus(req.params.id, estado)
    res.json(ticket)
  }),
)

export default router
