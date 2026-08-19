import { Prisma, RequestPriority, RequestStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { FeatureRequest, Priority, Status } from "@/types/feature-request";

const requestInclude = {
  comments: {
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "asc" as const },
  },
  createdBy: { select: { id: true, name: true } },
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
  static async findAll(): Promise<FeatureRequest[]> {
    const requests = await prisma.featureRequest.findMany({
      include: requestInclude,
      orderBy: { createdAt: "desc" },
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

  static async update(id: string, updates: Partial<FeatureRequest>): Promise<FeatureRequest | null> {
    const exists = await prisma.featureRequest.findUnique({ where: { id }, select: { id: true } });
    if (!exists) return null;

    const data: Prisma.FeatureRequestUpdateInput = {};
    if (updates.title !== undefined) data.title = updates.title;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.status !== undefined) data.status = statusToDb[updates.status];
    if (updates.priority !== undefined) data.priority = priorityToDb[updates.priority];

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
