import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LeaveApprovalFormProps {
  onApprove: (comment?: string) => Promise<unknown>;
  onReject: (reason: string) => Promise<unknown>;
  isLoading?: boolean;
}

export function LeaveApprovalForm({
  onApprove,
  onReject,
  isLoading,
}: LeaveApprovalFormProps) {
  const [mode, setMode] = useState<"view" | "approve" | "reject">("view");
  const [comment, setComment] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [error, setError] = useState("");

  const handleApprove = async () => {
    try {
      setError("");
      await onApprove(comment || undefined);
      setMode("view");
      setComment("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setError("");
      await onReject(rejectionReason);
      setMode("view");
      setRejectionReason("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (mode === "view") {
    return (
      <div className="flex gap-2">
        <Button
          onClick={() => setMode("approve")}
          disabled={isLoading}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
        >
          Approve
        </Button>
        <Button
          onClick={() => setMode("reject")}
          disabled={isLoading}
          variant="outline"
          className="flex-1 border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
        >
          Reject
        </Button>
      </div>
    );
  }

  if (mode === "approve") {
    return (
      <div className="space-y-4 rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950/50">
        <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">Approve Leave Request</h3>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add optional comment (e.g., enjoyed the trip, see you soon!)"
          maxLength={500}
          rows={3}
          className="block w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none dark:border-emerald-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {comment.length}/500 characters
        </div>

        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={() => setMode("view")}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-800"
          >
            {isLoading ? "Processing..." : "Confirm Approval"}
          </button>
        </div>
      </div>
    );
  }

  if (mode === "reject") {
    return (
      <div className="space-y-4 rounded-lg bg-rose-50 p-4 dark:bg-rose-950/50">
        <h3 className="font-semibold text-rose-900 dark:text-rose-200">Reject Leave Request</h3>

        <textarea
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Please provide a reason for rejection..."
          maxLength={500}
          rows={3}
          className="block w-full rounded-lg border border-rose-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-rose-500 focus:outline-none dark:border-rose-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {rejectionReason.length}/500 characters
        </div>

        {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={() => setMode("view")}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading || !rejectionReason.trim()}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:opacity-50 dark:bg-rose-700 dark:hover:bg-rose-800"
          >
            {isLoading ? "Processing..." : "Confirm Rejection"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
