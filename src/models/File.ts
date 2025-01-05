import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

cloudinary.config({ secure: true });

class FilesModel {
  async uploadFile(pathToFile: string) {
    const uploadInfo = await cloudinary.uploader.upload(pathToFile, {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });
    return uploadInfo;
  }
}

export const upload = multer({ dest: "temp/" });
export default new FilesModel();
