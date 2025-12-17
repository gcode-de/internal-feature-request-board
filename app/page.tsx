"use client";

import { useEffect, useState } from "react";
import { FeatureRequestList } from "@/components/FeatureRequestList";
import { FeatureRequest } from "@/types/feature-request";

export default function HomePage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch("/api/feature-requests");
        if (!response.ok) {
          throw new Error("Failed to fetch feature requests");
        }
        const data: FeatureRequest[] = await response.json();
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Internal Feature Request Board</h1>
        <p className="text-sm text-muted-foreground">Submitted ideas and their current status</p>
      </div>

      <FeatureRequestList requests={requests} isLoading={isLoading} error={error} />
    </main>
  );
}
