"use client";

import { useEffect, useState } from "react";
import { FeatureRequestList } from "@/components/FeatureRequestList";
import { FeatureRequestForm } from "@/components/FeatureRequestForm";
import { Button } from "@/components/ui/button";
import { FeatureRequest } from "@/types/feature-request";

export default function HomePage() {
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleFormSuccess = () => {
    fetchRequests();
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Internal Feature Request Board</h1>
          <p className="text-sm text-muted-foreground">Submitted ideas and their current status</p>
        </div>
        <Button onClick={() => handleOpenForm()} size="sm">
          Submit Request
        </Button>
      </div>

      <FeatureRequestList requests={requests} isLoading={isLoading} error={error} />

      <FeatureRequestForm
        request={selectedRequest}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </main>
  );
}
