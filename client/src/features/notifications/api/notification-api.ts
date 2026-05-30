import { http } from "@/shared/api/http";

export type NotificationType =
  | "leave_request"
  | "leave_approved"
  | "leave_rejected"
  | "general";

export type AppNotification = {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  readAt?: string | null;
  createdAt: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    unreadCount?: number;
  };
};

export async function listNotifications(params?: { limit?: number; unreadOnly?: boolean }) {
  const { data } = await http.get<ApiResponse<AppNotification[]>>("/notifications", {
    params,
  });

  return {
    items: data.data,
    unreadCount: data.meta?.unreadCount ?? 0,
  };
}

export async function markNotificationRead(notificationId: string) {
  const { data } = await http.patch<ApiResponse<AppNotification>>(
    `/notifications/${notificationId}/read`,
  );
  return data.data;
}

export async function markAllNotificationsRead() {
  const { data } = await http.patch<ApiResponse<{ ok: boolean }>>(
    "/notifications/read-all",
  );
  return data.data;
}
