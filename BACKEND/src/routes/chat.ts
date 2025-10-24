import { Router, type NextFunction, type Request, type Response } from "express"
import type { AuthRequest } from "../middleware/auth"
import { validateRequest } from "../middleware/validation"
import { chatService } from "../services/chat.service"
import { createChatSchema, createMessageSchema } from "../utils/schemas"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  "/",
  validateRequest(createChatSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title } = req.body
    const chat = await chatService.createChat(Number(req.userId!), title)
    res.status(201).json(chat)
  }),
)

router.get(
  "/",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const chats = await chatService.getUserChats(Number(req.userId!))
    res.json(chats)
  }),
)

router.get(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const chat = await chatService.getChat(Number(req.params.id), Number(req.userId!))
    res.json(chat)
  }),
)

router.get(
  "/:id/messages",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const messages = await chatService.getMessagesByChatId(Number(req.params.id), Number(req.userId!))
    res.json(messages)
  }),
)

router.post(
  "/:id/messages",
  validateRequest(createMessageSchema),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { content, imageUrl } = req.body
    const result = await chatService.addMessage(Number(req.params.id), Number(req.userId!), content, imageUrl)
    res.status(201).json(result)
  }),
)

router.put(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { title } = req.body
    const result = await chatService.updateChatTitle(Number(req.params.id), Number(req.userId!), title)
    res.json(result)
  }),
)

router.delete(
  "/:id",
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await chatService.deleteChat(Number(req.params.id), Number(req.userId!))
    res.json(result)
  }),
)

export default router