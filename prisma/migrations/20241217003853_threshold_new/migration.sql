/*
  Warnings:

  - Made the column `twitterName` on table `Member` required. This step will fail if there are existing NULL values in that column.
  - Made the column `twitterLink` on table `Member` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "lastChecked" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "meetsThreshold" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "twitterName" SET NOT NULL,
ALTER COLUMN "twitterLink" SET NOT NULL;
