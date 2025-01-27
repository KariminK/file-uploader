import { Router } from "express";
import { fileController } from "../controllers";
import { upload } from "../models/File";
import { validateFile } from "../validations";

const fileRouter = Router();

fileRouter.get("/:parentFolder/upload", fileController.getUploadForm);

fileRouter.post(
  "/:parentFolder/upload",
  upload.single("file"),
  validateFile,
  fileController.uploadFile,
);

fileRouter.get("/:cloud_id/delete", fileController.getDeleteForm);

fileRouter.delete("/:cloud_id/delete", fileController.deleteFile);

fileRouter.get("/:cloud_id/details", fileController.getFileDetails);

export default fileRouter;
