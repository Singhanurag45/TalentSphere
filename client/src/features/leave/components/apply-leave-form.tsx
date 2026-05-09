import { useState } from "react";
import { differenceInDays } from "date-fns";
import { Button } from "@/components/ui/button";
import type { LeaveType, ApplyLeaveInput } from "../types/leave";
import { LEAVE_TYPE_LABELS } from "../types/leave";

interface ApplyLeaveFormProps {
  onSubmit: (data: ApplyLeaveInput) => Promise<unknown>;
  isLoading?: boolean;
  availableBalance?: Partial<Record<LeaveType, number>>;
}

const LEAVE_TYPES: LeaveType[] = ["annual", "sick", "casual", "personal", "unpaid", "maternity", "paternity"];

export function ApplyLeaveForm({
  onSubmit,
  isLoading,
  availableBalance = {},
}: ApplyLeaveFormProps) {
  const [formData, setFormData] = useState({
    leaveType: "annual" as LeaveType,
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const startDate = formData.startDate ? new Date(formData.startDate) : null;
  const endDate = formData.endDate ? new Date(formData.endDate) : null;

  let daysRequested = 0;
  if (startDate && endDate && endDate >= startDate) {
    daysRequested = differenceInDays(endDate, startDate) + 1;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!formData.leaveType) newErrors.leaveType = "Leave type is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.reason || formData.reason.length < 10)
      newErrors.reason = "Reason must be at least 10 characters";

    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = "End date must be after start date";
    }

    const selectedLeaveBalance = availableBalance[formData.leaveType];
    if (
      formData.leaveType !== "unpaid" &&
      selectedLeaveBalance !== undefined &&
      selectedLeaveBalance < daysRequested
    ) {
      newErrors.daysRequested = `Insufficient balance. Available: ${selectedLeaveBalance} days`;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit({
          ...formData,
          daysRequested,
        });
      } catch (error) {
        setErrors({ submit: (error as Error).message });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Leave Type */}
      <div>
        <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Leave Type
        </label>
        <select
          id="leaveType"
          value={formData.leaveType}
          onChange={(e) => setFormData({ ...formData, leaveType: e.target.value as LeaveType })}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
        >
          {LEAVE_TYPES.map((type) => (
            <option key={type} value={type}>
              {LEAVE_TYPE_LABELS[type]}
              {availableBalance[type] !== undefined && ` (${availableBalance[type]} available)`}
            </option>
          ))}
        </select>
        {errors.leaveType && <p className="mt-1 text-sm text-rose-600">{errors.leaveType}</p>}
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Start Date
          </label>
          <input
            type="date"
            id="startDate"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          {errors.startDate && <p className="mt-1 text-sm text-rose-600">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white"
          />
          {errors.endDate && <p className="mt-1 text-sm text-rose-600">{errors.endDate}</p>}
        </div>
      </div>

      {/* Days Summary */}
      {daysRequested > 0 && (
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950/50">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>{daysRequested}</strong> day{daysRequested !== 1 ? "s" : ""} requested
          </p>
        </div>
      )}

      {/* Reason */}
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Reason for Leave
        </label>
        <textarea
          id="reason"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Please provide a reason for your leave request..."
          rows={4}
          maxLength={1000}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500"
        />
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formData.reason.length}/1000 characters
          </p>
          {errors.reason && <p className="text-sm text-rose-600">{errors.reason}</p>}
        </div>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
          {errors.submit}
        </div>
      )}
      {errors.daysRequested && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-600 dark:bg-rose-950/50 dark:text-rose-300">
          {errors.daysRequested}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Submitting..." : "Submit Leave Request"}
      </Button>
    </form>
  );
}
