"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeatureRequestForm } from "@/components/FeatureRequestForm";
import { FeatureRequest, statusLabels, priorityLabels } from "@/types/feature-request";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default function FeatureRequestDetailPage({ params }: DetailPageProps) {
  const router = useRouter();
  const [request, setRequest] = useState<FeatureRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const loadParams = async () => {
      const { id: requestId } = await params;
      setId(requestId);
    };
    loadParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/feature-requests/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Feature request not found");
          }
          throw new Error("Failed to fetch feature request");
        }

        const data: FeatureRequest = await response.json();
        setRequest(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    if (id) {
      // Refetch request data
      fetch(`/api/feature-requests/${id}`)
        .then((res) => res.json())
        .then((data) => setRequest(data));
    }
  };

  if (isLoading) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading feature request...</p>
        </div>
      </main>
    );
  }

  if (error || !request) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <Link href="/">
          <Button variant="outline" className="mb-6">
            ← Back to Board
          </Button>
        </Link>
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
          <p className="text-sm text-red-800 dark:text-red-200">
            {error || "Feature request not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          ← Back to Board
        </Button>
      </Link>

      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{request.title}</h1>
            <p className="text-muted-foreground mb-4">{request.description}</p>

            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                    request.status === "shipped"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : request.status === "in_progress"
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        : request.status === "planned"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : request.status === "under_review"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  }`}
                >
                  {statusLabels[request.status]}
                </span>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <span className="text-sm font-semibold text-foreground">
                  {priorityLabels[request.priority]}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFormOpen(true)}
            className="flex-shrink-0"
          >
            edit
          </Button>
        </div>
      </div>

      <FeatureRequestForm
        request={request}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </main>
  );
}
