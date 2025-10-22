import { Router, type NextFunction, type Request, type Response } from "express"
import { authMiddleware, type AuthRequest } from "../middleware/auth"
import { validateRequest } from "../middleware/validation"
import { authService } from "../services/auth.service"
import { loginSchema, registerSchema } from "../utils/schemas"

const router = Router()

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  "/register",
  validateRequest(registerSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, clienteNombre } = req.body
    const result = await authService.register(email, password, clienteNombre)
    res.status(201).json(result)
  }),
)

router.post(
  "/login",
  validateRequest(loginSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json(result)
  }),
)

router.get(
  "/me",
  authMiddleware,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await authService.getUser(Number(req.userId!))
    res.json(user)
  }),
)

export default router
