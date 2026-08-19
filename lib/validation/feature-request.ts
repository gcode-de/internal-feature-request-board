export const TITLE_MIN = 3;
export const TITLE_MAX = 100;
export const DESCRIPTION_MIN = 10;
export const DESCRIPTION_MAX = 1000;

export interface ValidationErrors {
  title?: string;
  description?: string;
}

export function validateFeatureRequest(title: string, description: string): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!title.trim()) errors.title = "Title is required";
  else if (title.trim().length < TITLE_MIN)
    errors.title = `Title must be at least ${TITLE_MIN} characters`;
  else if (title.length > TITLE_MAX) errors.title = `Title must not exceed ${TITLE_MAX} characters`;

  if (description.trim() && description.trim().length < DESCRIPTION_MIN)
    errors.description = `Description must be at least ${DESCRIPTION_MIN} characters`;
  else if (description.length > DESCRIPTION_MAX)
    errors.description = `Description must not exceed ${DESCRIPTION_MAX} characters`;

  return errors;
}
