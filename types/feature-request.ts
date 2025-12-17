// Domain types for Feature Request Board

import { Comment } from "./comment";

export enum Status {
  Proposed = "proposed",
  UnderReview = "under_review",
  Planned = "planned",
  InProgress = "in_progress",
  Shipped = "shipped",
  Rejected = "rejected",
}

export enum Priority {
  P0 = "p0", // Critical
  P1 = "p1", // High
  P2 = "p2", // Medium
  P3 = "p3", // Low
}

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  comments: Comment[];
}

export const statusLabels: Record<Status, string> = {
  [Status.Proposed]: "Proposed",
  [Status.UnderReview]: "Under Review",
  [Status.Planned]: "Planned",
  [Status.InProgress]: "In Progress",
  [Status.Shipped]: "Shipped",
  [Status.Rejected]: "Rejected",
};

export const priorityLabels: Record<Priority, string> = {
  [Priority.P0]: "P0 - Critical",
  [Priority.P1]: "P1 - High",
  [Priority.P2]: "P2 - Medium",
  [Priority.P3]: "P3 - Nobody cares",
};
