import { NextRequest, NextResponse } from "next/server";
import { FeatureRequestRepository } from "@/lib/repositories/feature-request.repository";
import { Status, Priority } from "@/types/feature-request";

/**
 * GET /api/feature-requests/[id]
 * Retrieve a single feature request (Discovery Context)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const featureRequest = await FeatureRequestRepository.findById(id);

    if (!featureRequest) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    return NextResponse.json(featureRequest);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve feature request" }, { status: 500 });
  }
}

/**
 * PUT /api/feature-requests/[id]
 * Update a feature request (Curation Context)
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const existing = await FeatureRequestRepository.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    const { title, description, status, priority, comment } = body;

    const updates: Partial<typeof existing> = {};

    if (typeof title === "string") updates.title = title;
    if (typeof description === "string") updates.description = description;
    if (typeof status === "string" && Object.values(Status).includes(status as Status)) {
      updates.status = status as Status;
    }
    if (typeof priority === "string" && Object.values(Priority).includes(priority as Priority)) {
      updates.priority = priority as Priority;
    }

    if (typeof comment === "string" && comment.trim()) {
      const newComment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        featureRequestId: id,
        content: comment,
        createdAt: new Date(),
      };
      updates.comments = [...existing.comments, newComment];
    }

    const updated = await FeatureRequestRepository.update(id, updates);

    if (!updated) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update feature request" }, { status: 500 });
  }
}

/**
 * DELETE /api/feature-requests/[id]
 * Delete a feature request (Curation Context)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await FeatureRequestRepository.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Feature request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Feature request deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete feature request" }, { status: 500 });
  }
}
