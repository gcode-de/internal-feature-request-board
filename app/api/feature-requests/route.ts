import { NextRequest, NextResponse } from "next/server";
import { FeatureRequestRepository } from "@/lib/repositories/feature-request.repository";

/**
 * GET /api/feature-requests
 * Retrieve all feature requests (Discovery Context)
 */
export async function GET() {
  try {
    const requests = await FeatureRequestRepository.findAll();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to retrieve feature requests" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/feature-requests
 * Submit a new feature request (Submission Context)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.title || !body.description || !body.status || !body.priority) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, status, priority" },
        { status: 400 }
      );
    }

    const newRequest = await FeatureRequestRepository.create({
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create feature request" },
      { status: 500 }
    );
  }
}
