import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  applyLeave as applyLeaveApi,
  getLeaveBalance,
} from "../api/leave-api";
import { ApplyLeaveForm } from "../components/apply-leave-form";
import { LeaveBalanceCard } from "../components/leave-balance-card";
import type { ApplyLeaveInput, LeaveType } from "../types/leave";
import { LEAVE_TYPE_LABELS } from "../types/leave";

const LEAVE_TYPES: LeaveType[] = ["annual", "sick", "casual", "personal", "unpaid", "maternity", "paternity"];

export function ApplyLeavePage() {
  const navigate = useNavigate();

  const { data: leaveBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ["leaveBalance"],
    queryFn: () => getLeaveBalance(),
    retry: 1,
  });

  const { mutateAsync: submitLeave, isPending } = useMutation({
    mutationFn: (data: ApplyLeaveInput) => applyLeaveApi(data),
    onSuccess: () => {
      toast.success("Leave application submitted successfully!");
      navigate("/leaves/history");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to submit leave request");
    },
  });

  const availableBalance = leaveBalance?.leaveTypes
    ? Object.entries(leaveBalance.leaveTypes).reduce(
        (acc, [type, bal]) => {
          acc[type as LeaveType] = bal.allocated - bal.used - bal.pending;
          return acc;
        },
        {} as Partial<Record<LeaveType, number>>
      )
    : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Apply for Leave</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Request time off from work
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <ApplyLeaveForm
              onSubmit={submitLeave}
              isLoading={isPending}
              availableBalance={availableBalance}
            />
          </div>
        </div>

        {/* Leave Balance Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              Leave Balance ({leaveBalance?.fiscal_year})
            </h2>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {LEAVE_TYPES.map((type) => (
                <LeaveBalanceCard
                  key={type}
                  leaveType={type}
                  balance={leaveBalance?.leaveTypes[type] || { allocated: 0, used: 0, pending: 0, carried_over: 0 }}
                  isLoading={balanceLoading}
                />
              ))}
            </div>

            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              <p className="font-medium">💡 Tip</p>
              <p className="mt-1 text-xs">
                Pending leaves are those awaiting approval. They will be deducted from your balance once approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
