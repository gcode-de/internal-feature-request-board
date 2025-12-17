/**
 * Comment Domain Model (Discussion Context)
 * Represents a comment or decision note on a feature request
 */

export interface Comment {
  id: string;
  featureRequestId: string;
  content: string;
  createdAt: Date;
}
