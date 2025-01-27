// nazwy typów, interfejsów z wielkiej litery
export interface NewFolderData {
  name: string;
  ownerId: number;
  parentFolderId: null | number;
}

export interface FileData {
  name: string;
  ownerId: number;
  file_url: string;
  folderId?: number;
  cloud_id: string;
  size: number;
}
