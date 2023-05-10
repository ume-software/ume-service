/*
  Warnings:

  - Added the required column `default_cost` to the `provider_skill` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `skill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "provider" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "provider_skill" ADD COLUMN     "default_cost" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "skill" ALTER COLUMN "name" SET NOT NULL;
