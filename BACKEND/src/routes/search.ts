import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { validateRequest } from "../middleware/validation"
import { searchService } from "../services/search.service"
import { searchSchema } from "../utils/schemas"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  "/",
  validateRequest(searchSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { query, type } = req.body

    if (type === "chats" || !type) {
      const chats = await searchService.searchChats(Number(req.userId!), query)
      return res.json({ chats })
    }

    if (type === "messages") {
      const messages = await searchService.searchMessages(Number(req.userId!), query)
      return res.json({ messages })
    }

    if (type === "tickets") {
      const tickets = await searchService.searchTickets(Number(req.userId!), query)
      return res.json({ tickets })
    }

    res.json({})
  }),
)

export default router
