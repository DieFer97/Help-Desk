import { v2 as cloudinary } from 'cloudinary'
import { getEnv } from '../config/env'
import { logger } from '../utils/logger'

const env = getEnv()

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true
})

export const cloudinaryService = {
  /**
   *
   * @param buffer B
   * @param folder
   * @returns
   */
  async uploadImage(buffer: Buffer, folder: string = 'cistcor-chatbot'): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              logger.error(`Error subiendo imagen a Cloudinary: ${error.message}`)
              reject(error)
            } else {
              logger.info(`Imagen subida exitosamente: ${result?.secure_url}`)
              resolve(result!.secure_url)
            }
          }
        )

        uploadStream.end(buffer)
      })
    } catch (error) {
      logger.error(`Error en cloudinaryService.uploadImage: ${error}`)
      throw error
    }
  },

  /**
   * @param imageUrl URL de la imagen en Cloudinary
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      const parts = imageUrl.split('/')
      const filename = parts[parts.length - 1].split('.')[0]
      const folder = parts[parts.length - 2]
      const publicId = `${folder}/${filename}`

      const result = await cloudinary.uploader.destroy(publicId)

      if (result.result === 'ok') {
        logger.info(`Imagen eliminada de Cloudinary: ${publicId}`)
        return true
      }

      return false
    } catch (error) {
      logger.error(`Error eliminando imagen de Cloudinary: ${error}`)
      return false
    }
  }
}