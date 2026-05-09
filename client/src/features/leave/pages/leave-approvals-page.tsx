import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  listLeaves,
  approveLeave as approveLeaveApi,
  rejectLeave as rejectLeaveApi,
  getLeaveById,
} from "../api/leave-api";
import { LeaveCard } from "../components/leave-card";
import { LeaveApprovalForm } from "../components/leave-approval-form";
import { LeaveTimeline } from "../components/leave-timeline";
import { LEAVE_TYPE_LABELS } from "../types/leave";
import type { Leave } from "../types/leave";

export function LeaveApprovalsPage() {
  const navigate = useNavigate();
  const [selectedLeaveId, setSelectedLeaveId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data: leavesData, isLoading, refetch } = useQuery({
    queryKey: ["leaves-pending", page],
    queryFn: () =>
      listLeaves({
        page,
        limit: 10,
        status: "pending",
      }),
  });

  const { data: selectedLeave } = useQuery({
    queryKey: ["leave", selectedLeaveId],
    queryFn: () => (selectedLeaveId ? getLeaveById(selectedLeaveId) : null),
    enabled: !!selectedLeaveId,
  });

  const { mutateAsync: approveLeave, isPending: isApprovingPending } = useMutation({
    mutationFn: ({ leaveId, comment }: { leaveId: string; comment?: string }) =>
      approveLeaveApi(leaveId, { comment }),
    onSuccess: () => {
      toast.success("Leave approved successfully");
      setSelectedLeaveId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve leave");
    },
  });

  const { mutateAsync: rejectLeave, isPending: isRejectingPending } = useMutation({
    mutationFn: ({ leaveId, reason }: { leaveId: string; reason: string }) =>
      rejectLeaveApi(leaveId, { rejectionReason: reason }),
    onSuccess: () => {
      toast.success("Leave rejected successfully");
      setSelectedLeaveId(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject leave");
    },
  });

  const pendingCount = leavesData?.meta?.total || 0;

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Approvals</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {pendingCount > 0 ? (
              <>
                <AlertCircle className="inline h-4 w-4 text-amber-600 dark:text-amber-400" />
                {" "}
                {pendingCount} pending leave{pendingCount !== 1 ? "s" : ""} to review
              </>
            ) : (
              "All leaves have been reviewed"
            )}
          </p>
        </div>
      </div>

      {selectedLeave ? (
        // Detailed approval view
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => setSelectedLeaveId(null)}
                className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </button>

              <div className="space-y-6">
                {/* Employee Info */}
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Employee</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedLeave.employee.firstName} {selectedLeave.employee.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {selectedLeave.employee.email}
                  </p>
                </div>

                {/* Leave Details */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {LEAVE_TYPE_LABELS[selectedLeave.leaveType]}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(selectedLeave.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(selectedLeave.endDate), "MMM d, yyyy")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedLeave.daysRequested} days requested
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Reason</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedLeave.reason}
                  </p>
                </div>

                {/* Timeline */}
                <div className="border-t pt-6 dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Timeline</h3>
                  <div className="mt-4">
                    <LeaveTimeline leave={selectedLeave} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Approval Actions */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                <h3 className="font-semibold text-gray-900 dark:text-white">Decision</h3>
                <div className="mt-4">
                  <LeaveApprovalForm
                    onApprove={(comment) =>
                      approveLeave({
                        leaveId: selectedLeave._id,
                        comment,
                      })
                    }
                    onReject={(reason) =>
                      rejectLeave({
                        leaveId: selectedLeave._id,
                        reason,
                      })
                    }
                    isLoading={isApprovingPending || isRejectingPending}
                  />
                </div>
              </div>

              {/* Info Card */}
              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                <p className="font-medium">Review Guidelines</p>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>• Ensure dates don't conflict with other approvals</li>
                  <li>• Check employee balance before approval</li>
                  <li>• Add comments for context or concerns</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // List view
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
                />
              ))}
            </div>
          ) : !leavesData?.items || leavesData.items.length === 0 ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-12 text-center dark:border-emerald-800 dark:bg-emerald-950/50">
              <p className="text-emerald-600 dark:text-emerald-400">
                ✓ All leave requests have been reviewed
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leavesData.items.map((leave) => (
                <LeaveCard
                  key={leave._id}
                  leave={leave}
                  onClick={() => setSelectedLeaveId(leave._id)}
                  showApprovalActions={false}
                />
              ))}

              {/* Pagination */}
              {leavesData.meta && leavesData.meta.pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {leavesData.meta.page} of {leavesData.meta.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-600"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setPage(Math.min(leavesData.meta.pages, page + 1))
                      }
                      disabled={page === leavesData.meta.pages}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-600"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
