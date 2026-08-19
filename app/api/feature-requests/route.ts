import { NextRequest, NextResponse } from "next/server";
import { FeatureRequestRepository } from "@/lib/repositories/feature-request.repository";
import { getSessionUser } from "@/lib/auth/session";
import { Priority, Status } from "@/types/feature-request";

/**
 * GET /api/feature-requests
 * Retrieve all feature requests (Discovery Context)
 */
export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const requests = await FeatureRequestRepository.findAll();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Failed to retrieve feature requests" }, { status: 500 });
  }
}

/**
 * POST /api/feature-requests
 * Submit a new feature request (Submission Context)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();

    // Basic validation
    if (!body.title) {
      return NextResponse.json({ error: "Missing required field: title" }, { status: 400 });
    }

    const newRequest = await FeatureRequestRepository.create({
      title: body.title,
      description: body.description || "",
      status: Status.Proposed,
      priority: Priority.P2,
      createdById: user.id,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create feature request" }, { status: 500 });
  }
}
