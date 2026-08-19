CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'PRODUCT_OWNER', 'ADMIN');
CREATE TYPE "RequestStatus" AS ENUM ('PROPOSED', 'UNDER_REVIEW', 'PLANNED', 'IN_PROGRESS', 'SHIPPED', 'REJECTED');
CREATE TYPE "RequestPriority" AS ENUM ('P0', 'P1', 'P2', 'P3');
CREATE TYPE "AuditAction" AS ENUM ('STATUS_CHANGED', 'PRIORITY_CHANGED');

CREATE TABLE "User" ("id" TEXT NOT NULL, "email" TEXT NOT NULL, "name" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'EMPLOYEE', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Session" ("id" TEXT NOT NULL, "tokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "userId" TEXT NOT NULL, CONSTRAINT "Session_pkey" PRIMARY KEY ("id"));
CREATE TABLE "FeatureRequest" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '', "status" "RequestStatus" NOT NULL DEFAULT 'PROPOSED', "priority" "RequestPriority" NOT NULL DEFAULT 'P2', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, "createdById" TEXT, CONSTRAINT "FeatureRequest_pkey" PRIMARY KEY ("id"));
CREATE TABLE "Comment" ("id" TEXT NOT NULL, "content" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "featureRequestId" TEXT NOT NULL, "authorId" TEXT, CONSTRAINT "Comment_pkey" PRIMARY KEY ("id"));
CREATE TABLE "AuditLog" ("id" TEXT NOT NULL, "action" "AuditAction" NOT NULL, "previousValue" TEXT NOT NULL, "nextValue" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "featureRequestId" TEXT NOT NULL, "actorId" TEXT NOT NULL, CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "FeatureRequest_status_idx" ON "FeatureRequest"("status");
CREATE INDEX "FeatureRequest_priority_idx" ON "FeatureRequest"("priority");
CREATE INDEX "FeatureRequest_createdAt_idx" ON "FeatureRequest"("createdAt");
CREATE INDEX "Comment_featureRequestId_createdAt_idx" ON "Comment"("featureRequestId", "createdAt");
CREATE INDEX "AuditLog_featureRequestId_createdAt_idx" ON "AuditLog"("featureRequestId", "createdAt");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeatureRequest" ADD CONSTRAINT "FeatureRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_featureRequestId_fkey" FOREIGN KEY ("featureRequestId") REFERENCES "FeatureRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
