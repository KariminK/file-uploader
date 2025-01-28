/*
  Warnings:

  - The primary key for the `file` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `file` table. All the data in the column will be lost.
  - The primary key for the `folder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `cloud_id` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_folderId_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "file" DROP CONSTRAINT "file_pkey",
DROP COLUMN "id",
ADD COLUMN     "cloud_id" TEXT NOT NULL,
ADD COLUMN     "size" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "folderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "file_pkey" PRIMARY KEY ("cloud_id");

-- AlterTable
ALTER TABLE "folder" DROP CONSTRAINT "folder_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "parentFolderId" SET DATA TYPE TEXT,
ADD CONSTRAINT "folder_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "folder_id_seq";

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
