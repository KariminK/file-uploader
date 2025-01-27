import { Router } from "express";
import { folderController } from "../controllers";
import { validateFolder } from "../validations";
import { checkValidationResult } from "../helpers/checkValidationResult";

const folderRouter = Router();

folderRouter.get("/:parentName/new", folderController.getNewFolderForm);

folderRouter.post(
  "/:parentname",
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
