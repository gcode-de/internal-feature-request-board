"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FeatureRequest, Status, Priority } from "@/types/feature-request";
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  validateFeatureRequest,
} from "@/lib/validation/feature-request";

interface FeatureRequestFormProps {
  request?: FeatureRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
  canDelete?: boolean;
}

export function FeatureRequestForm({
  request,
  isOpen,
  onClose,
  onSuccess,
  onDelete,
  canDelete = false,
}: FeatureRequestFormProps) {
  const isEditMode = !!request;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(request?.title || "");
  const [description, setDescription] = useState(request?.description || "");
  const [status, setStatus] = useState<Status>(request?.status || Status.Proposed);
  const [priority, setPriority] = useState<Priority>(request?.priority || Priority.P2);
  const [touched, setTouched] = useState({ title: false, description: false });

  // Validation
  const validationErrors = useMemo(
    () => validateFeatureRequest(title, description),
    [title, description],
  );

  const isFormValid = Object.keys(validationErrors).length === 0;

  // Reset form when opening in submit mode
  useEffect(() => {
    if (isOpen && !isEditMode) {
      setTitle("");
      setDescription("");
      setStatus(Status.Proposed);
      setPriority(Priority.P2);
      setApiError(null);
      setTouched({ title: false, description: false });
    }
  }, [isOpen, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submit
    if (!isFormValid) {
      setApiError("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      const payload = { title: title.trim(), description: description.trim(), status, priority };

      if (isEditMode && request) {
        // Update existing request (Curation Context)
        const response = await fetch(`/api/feature-requests/${request.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to update request");
        }
      } else {
        // Submit new request (Submission Context)
        const response = await fetch("/api/feature-requests", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to submit request");
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!request || !confirm("Are you sure you want to delete this request?")) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const response = await fetch(`/api/feature-requests/${request.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete request");
      }

      onClose();
      onDelete?.();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Curate Feature Request" : "Submit Feature Request"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update status, priority, or details of this request."
              : "Describe the feature you'd like to propose for the team."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title{" "}
              <span className="text-xs text-muted-foreground">
                ({title.length}/{TITLE_MAX})
              </span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              maxLength={TITLE_MAX}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder={"Enter title"}
            />
            {touched.title && validationErrors.title && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {validationErrors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description{" "}
              <span className="text-xs text-muted-foreground">
                ({description.length}/{DESCRIPTION_MAX})
              </span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
              maxLength={DESCRIPTION_MAX}
              rows={4}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder={"Describe the request"}
            />
            {touched.description && validationErrors.description && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {validationErrors.description}
              </p>
            )}
          </div>

          {isEditMode && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value={Status.Proposed}>Proposed</option>
                  <option value={Status.UnderReview}>Under Review</option>
                  <option value={Status.Planned}>Planned</option>
                  <option value={Status.InProgress}>In Progress</option>
                  <option value={Status.Shipped}>Shipped</option>
                  <option value={Status.Rejected}>Rejected</option>
                </select>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value={Priority.P0}>P0 - Critical</option>
                  <option value={Priority.P1}>P1 - High</option>
                  <option value={Priority.P2}>P2 - Medium</option>
                  <option value={Priority.P3}>P3 - Low</option>
                </select>
              </div>
            </div>
          )}

          {apiError && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
            </div>
          )}

          <DialogFooter>
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {isEditMode && canDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                  >
                    Delete Request
                  </Button>
                )}
              </div>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting || !isFormValid}
                >
                  {isSubmitting ? "Saving..." : isEditMode ? "Update Request" : "Submit Request"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
