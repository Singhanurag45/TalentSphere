import type { LeaveTypeBalance } from "../types/leave";
import { LEAVE_TYPE_LABELS } from "../types/leave";
import type { LeaveType } from "../types/leave";

interface LeaveBalanceCardProps {
  leaveType: LeaveType;
  balance: LeaveTypeBalance;
  isLoading?: boolean;
}

export function LeaveBalanceCard({ leaveType, balance, isLoading }: LeaveBalanceCardProps) {
  const available = balance.allocated - balance.used - balance.pending;
  const utilizationPercent = (balance.used / balance.allocated) * 100;

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-8 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  const colors: Record<LeaveType, { bg: string; text: string }> = {
    annual: { bg: "bg-blue-50 dark:bg-blue-950/50", text: "text-blue-700 dark:text-blue-300" },
    sick: { bg: "bg-red-50 dark:bg-red-950/50", text: "text-red-700 dark:text-red-300" },
    casual: { bg: "bg-amber-50 dark:bg-amber-950/50", text: "text-amber-700 dark:text-amber-300" },
    personal: { bg: "bg-violet-50 dark:bg-violet-950/50", text: "text-violet-700 dark:text-violet-300" },
    unpaid: { bg: "bg-gray-50 dark:bg-gray-950/50", text: "text-gray-700 dark:text-gray-300" },
    maternity: { bg: "bg-pink-50 dark:bg-pink-950/50", text: "text-pink-700 dark:text-pink-300" },
    paternity: { bg: "bg-cyan-50 dark:bg-cyan-950/50", text: "text-cyan-700 dark:text-cyan-300" },
  };

  const color = colors[leaveType];

  return (
    <div className={`rounded-lg border border-gray-200 p-4 dark:border-gray-700 ${color.bg}`}>
      <h3 className={`text-sm font-medium ${color.text}`}>{LEAVE_TYPE_LABELS[leaveType]}</h3>

      <div className="mt-4 space-y-3">
        {/* Balance summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className={`text-lg font-bold ${color.text}`}>{available}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Available</p>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${color.text}`}>{balance.used}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Used</p>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${color.text}`}>{balance.pending}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className={`h-full transition-all ${color.text.replace("text", "bg")}`}
              style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {balance.allocated} days allocated
          </p>
        </div>
      </div>
    </div>
  );
}
