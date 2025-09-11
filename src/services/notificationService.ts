import { NotificationsResponse } from "@/lib/types";
import api from "./axios-instance";

export const getNotifications = async (page = 1, limit = 10): Promise<NotificationsResponse> => {
    const res = await api.get(`/notification`, {
        params: { page, limit },
    });
    return res.data.data;
};

export const markNotificationAsRead = async (id: string) => {
    await api.patch(`/notification/${id}/read`);
};

export const markAllNotificationsAsRead = async () => {
    await api.patch(`/notification/read-all`);
};

export const hideNotification = async (id: string) => {
    await api.patch(`/notification/${id}/hide`);
};

export const hideAllNotifications = async () => {
    await api.patch(`/notification/hide-all`);
};