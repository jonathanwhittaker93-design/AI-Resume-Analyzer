export function getErrorMessage(err: unknown): string {
  const e = err as {
    response?: { status?: number; data?: { detail?: string } };
    message?: string;
  };

  const detail = e?.response?.data?.detail;
  const status = e?.response?.status;

  if (typeof detail === "string" && detail.length > 0) {
    // Clean up raw exception strings from backend
    if (detail.includes("duplicate key") || detail.includes("already registered")) {
      return "An account with this email already exists. Please sign in instead.";
    }
    if (detail.includes("Invalid email or password")) {
      return "Incorrect email or password. Please try again.";
    }
    if (detail.includes("Could not retrieve resume")) {
      return "We couldn't find your uploaded resume. Please try uploading again.";
    }
    if (detail.includes("File upload failed")) {
      return "Your resume couldn't be uploaded. Please check your connection and try again.";
    }
    if (detail.includes("Failed to save analysis")) {
      return "Analysis completed but couldn't be saved. Please try again.";
    }
    if (detail.includes("Not authenticated") || status === 401) {
      return "Your session has expired. Please sign in again.";
    }
    return detail;
  }

  if (status === 413) return "Your file is too large. Maximum size is 5MB.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status === 500) return "Something went wrong on our end. Please try again shortly.";
  if (status === 503) return "Service is temporarily unavailable. Please try again shortly.";

  return "Something went wrong. Please try again.";
}