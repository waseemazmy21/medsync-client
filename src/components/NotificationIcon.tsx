import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/context/NotificationsContext";
import { Bell } from "lucide-react"
import Link from "next/link"

export function NotificationIcon() {
    const { unreadCount } = useNotifications();
    return (
        <div className="relative">
            <Link href="/notifications" aria-label="Notifications" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        className="absolute -top-2 -right-2 rounded-full text-sm font-bold leading-none w-4 h-4 felx justify-center items-center text-white"
                        variant="destructive"
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                )}
            </Link>
        </div>
    )
}
