"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";
import { Notification, NotificationsResponse } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getNotifications, hideNotification, markAllNotificationsAsRead, markNotificationAsRead, hideAllNotifications } from "@/services/notificationService";

interface NotificationsContextType {
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    hide: (id: string) => void;
    hideAll: () => void;
    refetch: () => Promise<any>;
    isLoading: boolean;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
    const context = useContext(NotificationsContext)
    if (!context) {
        throw new Error("useNotifications must be used within a NotificationsProvider");
    }
    return context;
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [page, setPage] = useState(1);

    const queryClient = useQueryClient();
    const { user } = useAuth();

    const { data, isLoading, refetch } = useQuery<NotificationsResponse>({
        queryKey: ["notifications"],
        queryFn: () => getNotifications(page, 10),
        enabled: !!user,
    });

    const { mutate: markAsRead } = useMutation({
        mutationFn: (id: string) => markNotificationAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })

    const { mutate: markAllAsRead } = useMutation({
        mutationFn: () => markAllNotificationsAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })

    const { mutate: hide } = useMutation({
        mutationFn: (id: string) => hideNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        }
    })

    const { mutate: hideAll } = useMutation({
        mutationFn: () => hideAllNotifications(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            console.log("All notifications hidden");
        }
    })




    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_API_NOTIFICATIONS
        if (user) {
            const newSocket = io(url, {
                query: { userId: user._id },
            });

            newSocket.on("connect", () => {
                console.log("✅ Connected:", newSocket.id);
            });

            newSocket.on("notification", (notif) => {
                const audio = new Audio('/notification-sound.mp3');
                audio.play();
                queryClient.invalidateQueries({ queryKey: ["notifications"] });

            });

            newSocket.on("disconnect", () => {
                console.log("Disconnected from notification socket");
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }
    }, [user]);



    return (
        <NotificationsContext.Provider
            value={{
                notifications: data?.notifications || [],
                total: data?.total || 0,
                page: data?.page || 1,
                limit: data?.limit || 10,
                isLoading,
                refetch,
                unreadCount: data?.unreadCount || 0,
                markAsRead,
                markAllAsRead,
                hide,
                hideAll
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
}
