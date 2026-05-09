import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeaveBalance } from "../api/leave-api";
import { LeaveBalanceCard } from "../components/leave-balance-card";
import type { LeaveType } from "../types/leave";

const LEAVE_TYPES: LeaveType[] = ["annual", "sick", "casual", "personal", "unpaid", "maternity", "paternity"];

export function LeaveBalancePage() {
  const navigate = useNavigate();

  const { data: leaveBalance, isLoading } = useQuery({
    queryKey: ["leaveBalance"],
    queryFn: () => getLeaveBalance(),
  });

  const totalDaysAllocated = Object.values(leaveBalance?.leaveTypes || {}).reduce(
    (sum, bal) => sum + bal.allocated,
    0
  );

  const totalDaysUsed = Object.values(leaveBalance?.leaveTypes || {}).reduce(
    (sum, bal) => sum + bal.used,
    0
  );

  const totalDaysPending = Object.values(leaveBalance?.leaveTypes || {}).reduce(
    (sum, bal) => sum + bal.pending,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Balance</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Fiscal Year: {leaveBalance?.fiscal_year}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Allocated</p>
          <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
            {isLoading ? "-" : totalDaysAllocated}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Used</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {isLoading ? "-" : totalDaysUsed}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {isLoading ? "-" : totalDaysPending}
          </p>
        </div>
      </div>

      {/* Leave Types Grid */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Leave Type Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEAVE_TYPES.map((type) => (
            <LeaveBalanceCard
              key={type}
              leaveType={type}
              balance={leaveBalance?.leaveTypes[type] || { allocated: 0, used: 0, pending: 0, carried_over: 0 }}
              isLoading={isLoading}
            />
          ))}
        </div>
      </div>

      {/* Information */}
      <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-950/50">
        <h3 className="font-semibold text-blue-900 dark:text-blue-200">How Leave Works</h3>
        <ul className="mt-3 space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>
            <strong>Allocated:</strong> Total leave days available for this fiscal year
          </li>
          <li>
            <strong>Used:</strong> Leave days that have been approved and taken
          </li>
          <li>
            <strong>Pending:</strong> Leave requests awaiting approval (will be deducted once approved)
          </li>
          <li>
            <strong>Available:</strong> Days you can still apply for (Allocated - Used - Pending)
          </li>
        </ul>
      </div>
    </div>
  );
}
