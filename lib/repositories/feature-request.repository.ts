import { Prisma, RequestPriority, RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FeatureRequest, Priority, RequestFilters, Status } from "@/types/feature-request";

const requestInclude = {
  comments: {
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" as const },
  },
  createdBy: { select: { id: true, name: true } },
  auditLog: {
    include: { actor: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" as const },
  },
};

const statusToDb: Record<Status, RequestStatus> = {
  [Status.Proposed]: RequestStatus.PROPOSED,
  [Status.UnderReview]: RequestStatus.UNDER_REVIEW,
  [Status.Planned]: RequestStatus.PLANNED,
  [Status.InProgress]: RequestStatus.IN_PROGRESS,
  [Status.Shipped]: RequestStatus.SHIPPED,
  [Status.Rejected]: RequestStatus.REJECTED,
};

const priorityToDb: Record<Priority, RequestPriority> = {
  [Priority.P0]: RequestPriority.P0,
  [Priority.P1]: RequestPriority.P1,
  [Priority.P2]: RequestPriority.P2,
  [Priority.P3]: RequestPriority.P3,
};

function toDomain(
  request: Prisma.FeatureRequestGetPayload<{ include: typeof requestInclude }>,
): FeatureRequest {
  return {
    ...request,
    status: request.status.toLowerCase() as Status,
    priority: request.priority.toLowerCase() as Priority,
    auditLog: request.auditLog.map((entry) => ({
      ...entry,
      action: entry.action.toLowerCase() as "status_changed" | "priority_changed",
    })),
  };
}

export interface CreateFeatureRequest {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdById?: string;
}

export class FeatureRequestRepository {
  static async findAll(filters: RequestFilters = {}): Promise<FeatureRequest[]> {
    const where: Prisma.FeatureRequestWhereInput = {};
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.status) where.status = statusToDb[filters.status];
    if (filters.priority) where.priority = priorityToDb[filters.priority];

    const orderBy: Prisma.FeatureRequestOrderByWithRelationInput =
      filters.sort === "oldest"
        ? { createdAt: "asc" }
        : filters.sort === "updated"
          ? { updatedAt: "desc" }
          : filters.sort === "title"
            ? { title: "asc" }
            : filters.sort === "priority"
              ? { priority: "asc" }
              : { createdAt: "desc" };

    const requests = await prisma.featureRequest.findMany({
      where,
      include: requestInclude,
      orderBy,
    });
    return requests.map(toDomain);
  }

  static async findById(id: string): Promise<FeatureRequest | null> {
    const request = await prisma.featureRequest.findUnique({
      where: { id },
      include: requestInclude,
    });
    return request ? toDomain(request) : null;
  }

  static async create(input: CreateFeatureRequest): Promise<FeatureRequest> {
    const request = await prisma.featureRequest.create({
      data: {
        ...input,
        status: statusToDb[input.status],
        priority: priorityToDb[input.priority],
      },
      include: requestInclude,
    });
    return toDomain(request);
  }

  static async update(
    id: string,
    updates: Partial<FeatureRequest>,
    actorId?: string,
  ): Promise<FeatureRequest | null> {
    const exists = await prisma.featureRequest.findUnique({
      where: { id },
      select: { id: true, status: true, priority: true },
    });
    if (!exists) return null;

    const data: Prisma.FeatureRequestUpdateInput = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.status !== undefined) data.status = statusToDb[updates.status];
    if (updates.priority !== undefined) data.priority = priorityToDb[updates.priority];

    const auditEntries: Prisma.AuditLogCreateWithoutFeatureRequestInput[] = [];
    if (actorId && updates.status && statusToDb[updates.status] !== exists.status) {
      auditEntries.push({
        action: "STATUS_CHANGED",
        previousValue: exists.status.toLowerCase(),
        nextValue: updates.status,
        actor: { connect: { id: actorId } },
      });
    }
    if (actorId && updates.priority && priorityToDb[updates.priority] !== exists.priority) {
      auditEntries.push({
        action: "PRIORITY_CHANGED",
        previousValue: exists.priority.toLowerCase(),
        nextValue: updates.priority,
        actor: { connect: { id: actorId } },
      });
    }
    if (auditEntries.length) data.auditLog = { create: auditEntries };

    const request = await prisma.featureRequest.update({
      where: { id },
      data,
      include: requestInclude,
    });
    return toDomain(request);
  }

  static async addComment(
    id: string,
    content: string,
    authorId?: string,
  ): Promise<FeatureRequest | null> {
    const exists = await prisma.featureRequest.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;
    await prisma.comment.create({ data: { content, featureRequestId: id, authorId } });
    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await prisma.featureRequest.deleteMany({ where: { id } });
    return result.count > 0;
  }
}
