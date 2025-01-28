import { Router } from "express";
import { folderController } from "../controllers";
import { validateFolder } from "../validations";
import { checkValidationResult } from "../helpers/checkValidationResult";
import { IsAuthorized } from "../middlewares/authMiddleware";

const folderRouter = Router();

folderRouter.use(IsAuthorized);

folderRouter.get("/:folderId/new", folderController.getNewFolderForm);

folderRouter.post(
  "/:folderId",
  validateFolder("name"),
  checkValidationResult("forms/new-folder"),
  folderController.addNewFolder,
);

folderRouter.get("/:name", folderController.getFolderContent);

folderRouter.delete("/:name", folderController.deleteFolder);

folderRouter.get("/:name", folderController.getEditFolderForm);

folderRouter.put(
  "/:name",
  validateFolder("newName"),
  folderController.editFolder,
);

export default folderRouter;
