"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Check, Trash2, X } from "lucide-react"
import { useNotifications } from "@/context/NotificationsContext"
import { Notification } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useLanguage } from "@/context/LanguageContext"



export default function NotificationsPage() {

    const { notifications, total, markAsRead, hide, hideAll, markAllAsRead, unreadCount } = useNotifications()
    const { t } = useTranslation()
    const { language } = useLanguage()

    return (
        <div className="container space-y-6 mx-auto py-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('notifications.title')}</h1>
                    <p className="text-gray-600 mt-1">
                        {unreadCount > 0 ? t('notifications.unreadCount', { count: total }) : t('notifications.allCaughtUp')}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} >
                        <Check className="h-4 w-4 mr-2" />
                        {t('notifications.markAllRead')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={hideAll} >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('notifications.clearAll')}
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('notifications.noNotifications')}</h3>
                            <p className="text-gray-500">{t('notifications.checkBackLater')}</p>
                        </CardContent>
                    </Card>
                ) : (
                    notifications.map((notification: Notification) => (
                        <Card
                            key={notification._id}
                            className={`transition-all hover:shadow-md ${!notification.read ? "border-blue-200 bg-blue-50" : ""}`}
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1"><Bell /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {/* Prefer Arabic fields when available; fall back to keyword mapping or original title */}
                                                {(() => {
                                                    const title = notification.title || '';
                                                    const localizedTitle = language === 'ar' && notification.titleAr ? notification.titleAr : '';
                                                    if (localizedTitle) return localizedTitle;
                                                    const tl = title.toLowerCase();
                                                    if (tl.includes('appointment')) {
                                                        if (tl.includes('new') || tl.includes('booked') || tl.includes('book')) return t('notifications.newAppointment');
                                                        if (tl.includes('reminder')) return t('notifications.appointmentReminder');
                                                        if (tl.includes('updated') || tl.includes('update')) return t('notifications.appointmentUpdated');
                                                        if (tl.includes('cancelled') || tl.includes('canceled') || tl.includes('cancel')) return t('notifications.appointmentCancelled');
                                                    }
                                                    return title;
                                                })()}
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 mt-2 leading-relaxed">{language === 'ar' && notification.messageAr ? notification.messageAr : notification.message}</p>
                                        <div className="flex items-center gap-1 mt-4">
                                            <Clock className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">{formatDate(notification.createdAt as any, language)}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!notification.read && (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                title="Mark as read"
                                                onClick={() => markAsRead(notification._id)}
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            title="Hide notification"
                                            onClick={() => hide(notification._id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
