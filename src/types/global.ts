import { user } from "@prisma/client";

declare global {
  namespace Express {
    interface User extends user {}
  }
}

export interface newFolderData {
  name: string;
  ownerId: number;
  parentFolderId: null | number;
}
