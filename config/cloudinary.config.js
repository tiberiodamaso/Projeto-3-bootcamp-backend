import cloudinary from 'cloudinary'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import * as dotenv from dotenv

dotenv.config()

const cloudinaryInst = cloudinary.v2
cloudinaryInst.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInst,
  params: {
    folder: 'Projeto-3',
    format: async (req, res) => 'png',
    use_filename: true
  }
})

const uploadImg = multer({ storage: storage })

export default uploadImg