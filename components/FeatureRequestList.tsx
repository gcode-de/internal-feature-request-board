"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FeatureRequest,
  Status,
  Priority,
  statusLabels,
  priorityLabels,
} from "@/types/feature-request";

interface FeatureRequestListProps {
  requests: FeatureRequest[];
  isLoading: boolean;
  error: string | null;
  onRequestClick?: (request: FeatureRequest) => void;
}

export function FeatureRequestList({
  requests,
  isLoading,
  error,
  onRequestClick,
}: FeatureRequestListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading feature requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
        <p className="text-sm text-red-800 dark:text-red-200">Error: {error}</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No feature requests found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card
          key={request.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onRequestClick?.(request)}
        >
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
  );
}
