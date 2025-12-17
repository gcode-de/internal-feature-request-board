"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FeatureRequest,
  Status,
  Priority,
  statusLabels,
  priorityLabels,
} from "@/types/feature-request";

const initialRequests: FeatureRequest[] = [
  {
    id: "req-001",
    title: "Advanced search with filters",
    description:
      "Enable users to filter requests by status, priority, and tags for better discovery.",
    status: Status.Planned,
    priority: Priority.P1,
  },
  {
    id: "req-002",
    title: "Email notifications for status changes",
    description: "Notify submitters when their request status changes to keep them informed.",
    status: Status.UnderReview,
    priority: Priority.P2,
  },
  {
    id: "req-003",
    title: "Duplicate detection on submission",
    description:
      "Suggest similar existing requests when users submit new ideas to reduce duplicates.",
    status: Status.Proposed,
    priority: Priority.P2,
  },
  {
    id: "req-004",
    title: "Public roadmap view",
    description: "Display planned and in-progress features on a public-facing roadmap page.",
    status: Status.InProgress,
    priority: Priority.P0,
  },
  {
    id: "req-005",
    title: "Dark mode toggle",
    description: "Allow users to switch between light and dark themes for better accessibility.",
    status: Status.Shipped,
    priority: Priority.P3,
  },
];

export default function HomePage() {
  const [requests] = useState<FeatureRequest[]>(initialRequests);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Internal Feature Request Board</h1>
        <p className="text-sm text-muted-foreground">Submitted ideas and their current status</p>
      </div>

      <div className="space-y-3">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-4">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-lg font-semibold">{request.title}</CardTitle>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {priorityLabels[request.priority]}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4 pt-0">
              <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    request.status === Status.Shipped
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : request.status === Status.InProgress
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        : request.status === Status.Planned
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : request.status === Status.UnderReview
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {statusLabels[request.status]}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
