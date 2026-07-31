"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Layers } from "lucide-react"
import { useSession, signOut } from "@repo/auth/client"
import { toast } from "@repo/ui/components/ui/sonner"
import {
    AppSidebar, type AppSidebarNotification,
} from "@repo/ui/components/app-sidebar"
import { useSidebar } from "@/components/navigation/sidebarprovider"
import { hiringNavigation } from "@/lib/navigation"
import { getNotifications, markNotificationAsRead } from "@/actions/notifications/notifications.action"

export function HiringSidebar() {
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const [notifs, setNotifs] = useState<AppSidebarNotification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        try {
            const r = await getNotifications(20)
            if (r.success && r.notifications) {
                setNotifs((r.notifications as Array<Record<string, unknown>>).map(n => ({
                    id: n.id as string,
                    title: n.title as string,
                    description: (n.message as string) ?? null,
                    read: Boolean(n.read),
                    type: (n.type as string) ?? "INFO",
                    actionUrl: (n.actionUrl as string) ?? null,
                    createdAt: n.createdAt as Date,
                })))
                setUnreadCount(r.unreadCount || 0)
            }
        } catch { /* silent */ } finally { setLoading(false) }
    }, [])

    useEffect(() => { if (session?.user) load() }, [session?.user, load])

    const onItemClick = async (n: AppSidebarNotification) => {
        if (!n.read) {
            await markNotificationAsRead(n.id)
            setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
            setUnreadCount(c => Math.max(0, c - 1))
        }
        if (n.actionUrl) router.push(n.actionUrl)
    }

    const handleSignOut = async () => {
        await signOut()
        toast.success("Signed out")
        router.push("/signin")
    }

    return (
        <AppSidebar
            brand={{
                name: "BuildrHQ",
                subtitle: "Hiring Portal",
                homeHref: "/home",
                logo: (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                        <Layers className="h-[18px] w-[18px]" />
                    </div>
                ),
            }}
            primary={hiringNavigation.primary}
            secondary={hiringNavigation.secondary}
            secondaryLabel="Management"
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            user={session?.user ? { name: session.user.name, image: session.user.image, role: (session.user as { role?: string }).role ?? "Recruiter" } : null}
            isPending={isPending}
            onSignOut={handleSignOut}
            profileHref="/settings"
            notifications={{
                items: notifs,
                unreadCount,
                loading,
                onItemClick,
                onMarkAllRead: () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); setUnreadCount(0) },
                viewAllHref: "/home",
            }}
        />
    )
}

export default HiringSidebar
