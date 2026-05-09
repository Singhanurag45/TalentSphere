import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { listLeaves } from "../api/leave-api";
import { LeaveCard } from "../components/leave-card";
import { LeaveTimeline } from "../components/leave-timeline";
import { LeaveStatusBadge } from "../components/leave-status-badge";
import type { Leave, ListLeavesParams } from "../types/leave";
import { LEAVE_TYPE_LABELS } from "../types/leave";

export function LeaveHistoryPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ListLeavesParams>({
    page: 1,
    limit: 10,
  });
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const { data: leavesData, isLoading } = useQuery({
    queryKey: ["leaves", filters],
    queryFn: () => listLeaves(filters),
  });

  const handleLeaveClick = async (leave: Leave) => {
    setSelectedLeave(leave);
  };

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave History</h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View all your leave applications
          </p>
        </div>
      </div>

      {selectedLeave ? (
        // Detailed view
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={() => setSelectedLeave(null)}
                className="mb-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to list
              </button>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {LEAVE_TYPE_LABELS[selectedLeave.leaveType]}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(selectedLeave.startDate), "MMM d, yyyy")} -{" "}
                    {format(new Date(selectedLeave.endDate), "MMM d, yyyy")}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-950/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Reason</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedLeave.reason}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Days Requested</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedLeave.daysRequested}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                    <div className="mt-1">
                      <LeaveStatusBadge status={selectedLeave.status} />
                    </div>
                  </div>
                </div>

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
            <div className="sticky top-20 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-white">Leave Details</h3>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {LEAVE_TYPE_LABELS[selectedLeave.leaveType]}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Applied On</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                    {format(new Date(selectedLeave.appliedAt), "MMM d, yyyy HH:mm")}
                  </p>
                </div>

                {selectedLeave.approvedAt && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedLeave.status === "approved" ? "Approved On" : "Processed On"}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedLeave.approvedAt), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                )}

                {selectedLeave.approvedBy && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Approved By</p>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {selectedLeave.approvedBy.firstName} {selectedLeave.approvedBy.lastName}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // List view
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.status || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value as any,
                  page: 1,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.leaveType || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  leaveType: e.target.value as any,
                  page: 1,
                })
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-300"
            >
              <option value="">All Types</option>
              <option value="annual">Annual Leave</option>
              <option value="sick">Sick Leave</option>
              <option value="casual">Casual Leave</option>
              <option value="personal">Personal Leave</option>
              <option value="unpaid">Unpaid Leave</option>
              <option value="maternity">Maternity Leave</option>
              <option value="paternity">Paternity Leave</option>
            </select>
          </div>

          {/* Leaves List */}
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
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center dark:border-gray-700 dark:bg-gray-900/50">
              <p className="text-gray-600 dark:text-gray-400">No leave applications found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {leavesData.items.map((leave) => (
                <div key={leave._id}>
                  <LeaveCard
                    leave={leave}
                    onClick={() => handleLeaveClick(leave)}
                  />
                </div>
              ))}

              {/* Pagination */}
              {leavesData.meta && leavesData.meta.pages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Page {leavesData.meta.page} of {leavesData.meta.pages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFilters({ ...filters, page: Math.max(1, filters.page! - 1) })
                      }
                      disabled={filters.page === 1}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:opacity-50 dark:border-gray-600"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setFilters({
                          ...filters,
                          page: Math.min(leavesData.meta.pages, filters.page! + 1),
                        })
                      }
                      disabled={filters.page === leavesData.meta.pages}
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
