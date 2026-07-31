"use client"

import { useRouter } from "next/navigation"
import { LayoutGrid, Settings, type LucideIcon } from "lucide-react"
import { useSession, signOut } from "@repo/auth/client"
import { toast } from "@repo/ui/components/ui/sonner"
import { AppSidebar, type AppSidebarNavItem } from "@repo/ui/components/app-sidebar"
import { useSidebar } from "@/components/navigation/sidebarprovider"

interface NavItem {
    name: string
    path: string
    icon: LucideIcon
    children?: NavItem[]
}

interface PlatformConfig {
    name: string
    icon: LucideIcon
    color: string
    bgColor?: string
    textColor?: string
    navItems: NavItem[]
    overviewHref: string
}

export function PlatformSidebar({ platform }: { platform: PlatformConfig }) {
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar()
    const { data: session, isPending } = useSession()
    const router = useRouter()

    const PlatformIcon = platform.icon

    // Keep the cross-platform back-link the original admin sidebar had.
    const primary: AppSidebarNavItem[] = [
        { name: "All Platforms", path: "dashboard", icon: LayoutGrid },
        ...(platform.navItems as AppSidebarNavItem[]),
    ]

    const handleSignOut = async () => {
        await signOut()
        toast.success("Signed out")
        router.push("/signin")
    }

    return (
        <AppSidebar
            brand={{
                name: platform.name,
                subtitle: "Admin Console",
                homeHref: platform.overviewHref,
                logo: (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
                        <PlatformIcon className="h-[18px] w-[18px]" />
                    </div>
                ),
            }}
            primary={primary}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            user={session?.user ? { name: session.user.name, image: session.user.image, role: (session.user as { role?: string }).role ?? "Admin" } : null}
            isPending={isPending}
            onSignOut={handleSignOut}
            profileHref="/admins/profile"
            profileLinks={[{ label: "Profile Settings", href: "/admins/profile", icon: Settings }]}
        />
    )
}

export default PlatformSidebar
