import { format } from "date-fns";
import {
  CheckCircle2,
  CircleOff,
  XCircle,
  Clock3,
  FileText,
  MessageSquare,
} from "lucide-react";
import type { Leave } from "../types/leave";

interface LeaveTimelineProps {
  leave: Leave;
}

export function LeaveTimeline({ leave }: LeaveTimelineProps) {
  const events = [
    {
      type: "applied",
      date: leave.appliedAt,
      title: "Application Submitted",
      description: `${leave.appliedBy?.firstName} ${leave.appliedBy?.lastName} submitted the leave request`,
      icon: FileText,
      color: "bg-blue-100 dark:bg-blue-950",
    },
    ...(leave.status === "approved"
      ? [
          {
            type: "approved",
            date: leave.approvedAt,
            title: "Leave Approved",
            description: `Approved by ${leave.approvedBy?.firstName} ${leave.approvedBy?.lastName}`,
            icon: CheckCircle2,
            color: "bg-emerald-100 dark:bg-emerald-950",
          },
        ]
      : []),
    ...(leave.status === "rejected"
      ? [
          {
            type: "rejected",
            date: leave.approvedAt,
            title: "Leave Rejected",
            description: `${leave.rejectionReason}`,
            icon: XCircle,
            color: "bg-rose-100 dark:bg-rose-950",
          },
        ]
      : []),
    ...(leave.status === "cancelled"
      ? [
          {
            type: "cancelled",
            date: leave.updatedAt,
            title: "Leave Cancelled",
            description: "This leave request was cancelled",
            icon: CircleOff,
            color: "bg-slate-100 dark:bg-slate-950",
          },
        ]
      : []),
    ...(leave.status === "pending"
      ? [
          {
            type: "pending",
            date: null,
            title: "Awaiting Approval",
            description: "Your leave request is awaiting approval",
            icon: Clock3,
            color: "bg-amber-100 dark:bg-amber-950",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {events.map((event, index) => {
        const Icon = event.icon;
        const isLast = index === events.length - 1;

        return (
          <div key={event.type} className="flex gap-4">
            {/* Timeline connector */}
            <div className="flex flex-col items-center">
              <div className={`rounded-full p-2 ${event.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              {!isLast && <div className="mt-2 h-12 w-0.5 bg-gray-300 dark:bg-gray-600" />}
            </div>

            {/* Event details */}
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                {event.date && (
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(event.date), "MMM d, yyyy HH:mm")}
                  </time>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
            </div>
          </div>
        );
      })}

      {/* Comments section */}
      {leave.comments && leave.comments.length > 0 && (
        <div className="mt-8 space-y-4 border-t pt-6 dark:border-gray-700">
          <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
            <MessageSquare className="h-4 w-4" />
            Comments
          </h4>
          {leave.comments.map((comment) => (
            <div
              key={comment._id}
              className="rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {comment.author.firstName} {comment.author.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(comment.createdAt), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
