import { Router, type NextFunction, type Request, type Response } from 'express'
import multer from 'multer'
import type { AuthRequest } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { cloudinaryService } from '../services/cloudinary.service'
import { logger } from '../utils/logger'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Solo se permiten imágenes'))
      return
    }
    cb(null, true)
  }
})

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

router.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      throw new AppError(400, 'No se proporcionó ninguna imagen')
    }

    logger.info(`Usuario ${req.userId} subiendo imagen: ${req.file.originalname}`)

    const imageUrl = await cloudinaryService.uploadImage(
      req.file.buffer,
      `cistcor-chatbot/user-${req.userId}`
    )

    res.status(200).json({
      success: true,
      url: imageUrl,
      message: 'Imagen subida exitosamente'
    })
  })
)

export default router