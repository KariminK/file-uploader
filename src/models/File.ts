import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { config } from "dotenv";
config();
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

class FilesModel {
  async uploadFile(file: Express.Multer.File) {
    const base64 = Buffer.from(file.buffer).toString("base64");
    const encodedFile = "data:" + file.mimetype + ";base64," + base64;
    const uploadInfo = await cloudinary.uploader.upload(encodedFile, {
      resource_type: "auto",
    });
    return uploadInfo;
  }
}

const storage = multer.memoryStorage();
export const upload = multer({ storage });
export default new FilesModel();
