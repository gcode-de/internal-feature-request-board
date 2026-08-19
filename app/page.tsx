"use client";

import { useCallback, useEffect, useState } from "react";
import { FeatureRequestList } from "@/components/FeatureRequestList";
import { FeatureRequestForm } from "@/components/FeatureRequestForm";
import { Button } from "@/components/ui/button";
import {
  FeatureRequest,
  Priority,
  priorityLabels,
  RequestSort,
  Status,
  statusLabels,
} from "@/types/feature-request";
import { UserMenu } from "@/components/UserMenu";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [sort, setSort] = useState<RequestSort>("newest");

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (priority) params.set("priority", priority);
      params.set("sort", sort);
      const response = await fetch(`/api/feature-requests?${params}`);
      if (response.status === 401) {
        router.push("/login");
        return;
      }
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
  }, [priority, router, search, sort, status]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

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
    <main className="mx-auto max-w-5xl p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Internal Feature Request Board</h1>
          <p className="text-sm text-muted-foreground">Submitted ideas and their current status</p>
        </div>
        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <UserMenu />
          <Button onClick={() => handleOpenForm()} size="sm">
            Submit Request
          </Button>
        </div>
      </div>

      <section
        aria-label="Request filters"
        className="mb-5 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <label htmlFor="search" className="mb-1 block text-xs font-medium text-muted-foreground">
            Search
          </label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Title or description"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="status-filter"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value as Status | "")}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            {Object.values(Status).map((value) => (
              <option key={value} value={value}>
                {statusLabels[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="priority-filter"
            className="mb-1 block text-xs font-medium text-muted-foreground"
          >
            Priority
          </label>
          <select
            id="priority-filter"
            value={priority}
            onChange={(event) => setPriority(event.target.value as Priority | "")}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">All priorities</option>
            {Object.values(Priority).map((value) => (
              <option key={value} value={value}>
                {priorityLabels[value]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sort" className="mb-1 block text-xs font-medium text-muted-foreground">
            Sort
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value as RequestSort)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="updated">Recently updated</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>
      </section>

      <FeatureRequestList requests={requests} isLoading={isLoading} error={error} />

      <FeatureRequestForm
        request={null}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </main>
  );
}
