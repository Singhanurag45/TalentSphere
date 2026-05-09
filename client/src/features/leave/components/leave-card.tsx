import { format, formatDistance } from "date-fns";
import { ChevronRight, Calendar, FileText, User } from "lucide-react";
import type { Leave } from "../types/leave";
import { LeaveStatusBadge } from "./leave-status-badge";
import { LEAVE_TYPE_LABELS } from "../types/leave";

interface LeaveCardProps {
  leave: Leave;
  onClick?: () => void;
  showApprovalActions?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

export function LeaveCard({
  leave,
  onClick,
  showApprovalActions,
  onApprove,
  onReject,
}: LeaveCardProps) {
  const dateRange = `${format(new Date(leave.startDate), "MMM d")} - ${format(new Date(leave.endDate), "MMM d, yyyy")}`;
  const appliedAgo = formatDistance(new Date(leave.appliedAt), new Date(), { addSuffix: true });

  return (
    <div
      onClick={onClick}
      className="rounded-lg border border-gray-200 bg-white p-6 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-900 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {LEAVE_TYPE_LABELS[leave.leaveType]}
            </h3>
            <LeaveStatusBadge status={leave.status} />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{dateRange}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>{leave.daysRequested} days requested</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>
                {leave.appliedBy?.firstName} {leave.appliedBy?.lastName}
              </span>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
            {leave.reason}
          </p>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Applied {appliedAgo}</p>
        </div>

        {!showApprovalActions && <ChevronRight className="h-5 w-5 text-gray-400" />}
      </div>

      {showApprovalActions && (
        <div className="mt-4 flex gap-2 border-t pt-4 dark:border-gray-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReject?.();
            }}
            className="flex-1 rounded-lg bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 dark:hover:bg-rose-950"
          >
            Reject
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.();
            }}
            className="flex-1 rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}
