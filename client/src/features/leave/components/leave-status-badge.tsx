import { LEAVE_STATUS_CONFIG } from "../types/leave";
import type { LeaveStatus } from "../types/leave";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  className?: string;
}

export function LeaveStatusBadge({ status, className }: LeaveStatusBadgeProps) {
  const config = LEAVE_STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${config.bgColor} ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
