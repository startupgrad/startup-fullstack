-- AlterTable
alter table "Idea"
  add column "createdAt" TIMESTAMP(3) not null default current_timestamp;
