export interface NewFolderData {
  name: string;
  ownerId: number;
  parentFolderId: null | string;
}

export interface FileData {
  name: string;
  ownerId: number;
  file_url: string;
  folderId?: string;
  cloud_id: string;
  size: number;
}
