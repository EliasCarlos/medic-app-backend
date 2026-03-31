-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'doctor';

-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'patient';
