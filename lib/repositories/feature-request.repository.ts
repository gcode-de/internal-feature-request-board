import { FeatureRequest, Status, Priority } from "@/types/feature-request";

// In-Memory store (mock database)
let featureRequests: Map<string, FeatureRequest> = new Map([
  [
    "req-001",
    {
      id: "req-001",
      title: "Advanced search with filters",
      description:
        "Enable users to filter requests by status, priority, and tags for better discovery.",
      status: Status.Planned,
      priority: Priority.P1,
      comments: [],
    },
  ],
  [
    "req-002",
    {
      id: "req-002",
      title: "Email notifications for status changes",
      description: "Notify submitters when their request status changes to keep them informed.",
      status: Status.UnderReview,
      priority: Priority.P2,
      comments: [],
    },
  ],
  [
    "req-003",
    {
      id: "req-003",
      title: "Duplicate detection on submission",
      description:
        "Suggest similar existing requests when users submit new ideas to reduce duplicates.",
      status: Status.Proposed,
      priority: Priority.P2,
      comments: [],
    },
  ],
  [
    "req-004",
    {
      id: "req-004",
      title: "Public roadmap view",
      description: "Display planned and in-progress features on a public-facing roadmap page.",
      status: Status.InProgress,
      priority: Priority.P0,
      comments: [],
    },
  ],
  [
    "req-005",
    {
      id: "req-005",
      title: "Dark mode toggle",
      description: "Allow users to switch between light and dark themes for better accessibility.",
      status: Status.Shipped,
      priority: Priority.P3,
      comments: [],
    },
  ],
]);

// Domain Repository: Submission Context
export class FeatureRequestRepository {
  /**
   * Retrieve all feature requests
   */
  static async findAll(): Promise<FeatureRequest[]> {
    return Array.from(featureRequests.values());
  }

  /**
   * Retrieve a single feature request by ID
   */
  static async findById(id: string): Promise<FeatureRequest | null> {
    return featureRequests.get(id) || null;
  }

  /**
   * Submit a new feature request
   */
  static async create(request: Omit<FeatureRequest, "id" | "comments">): Promise<FeatureRequest> {
    const id = `req-${Date.now()}`;
    const newRequest: FeatureRequest = {
      ...request,
      id,
      comments: [],
    };
    featureRequests.set(id, newRequest);
    return newRequest;
  }

  /**
   * Update an existing feature request (Curation Context)
   */
  static async update(
    id: string,
    updates: Partial<FeatureRequest>,
  ): Promise<FeatureRequest | null> {
    const existing = featureRequests.get(id);
    if (!existing) return null;

    const updated: FeatureRequest = {
      ...existing,
      ...updates,
      id: existing.id, // Prevent ID tampering
    };
    featureRequests.set(id, updated);
    return updated;
  }

  /**
   * Delete a feature request
   */
  static async delete(id: string): Promise<boolean> {
    return featureRequests.delete(id);
  }

  /**
   * Clear all data (useful for testing)
   */
  static async reset(): Promise<void> {
    featureRequests.clear();
  }
}
