import {
    FolderKanban, Sparkles, User, User2,
    Briefcase, Video, Brain, LayoutDashboard, Heading,
    Home, FileText, Code2,
    Network, Globe, Server
} from "lucide-react"

export type LucideIcon = typeof LayoutDashboard

export interface NavigationItem {
    name: string
    path: string
    icon: LucideIcon
    children?: NavigationItem[]
    requiredPermission?: string
    status?: string | "active" | "coming"
    comingSoon?: boolean
}

export interface NavigationConfig {
    primary: NavigationItem[]
    secondary: NavigationItem[]
}

// Focused nav: Build (Projects) → Interview-ready (Practice, Mock, AI) → Get Hired (Jobs).
// KnowMe & Pathfinder are parked (code kept, hidden from nav). Chat/Inbox, University,
// and the stub mock modes were removed.
export const mainNavigation: NavigationConfig = {
    primary: [
        {
            name: "Home",
            path: "home",
            icon: Home,
            status: "active"
        },
        {
            name: "Practice",
            path: "practice",
            icon: Code2,
            status: "active",
            children: [
                { name: 'DSA', path: 'practice/dsa', icon: Code2 },
                { name: 'System Design', path: 'practice/system-design', icon: Network },
                { name: 'Web Frontend', path: 'practice/web-frontend', icon: Globe },
                { name: 'Web Backend', path: 'practice/web-backend', icon: Server }
            ]
        },
        {
            name: "Projects",
            path: "projects",
            icon: FolderKanban,
            status: "active",
            children: [
                { name: 'Ideas', path: 'projects/ideas', icon: Heading },
                { name: 'My Projects', path: 'projects/myprojects', icon: User },
                { name: 'All Projects', path: 'projects/allprojects', icon: User2 }
            ]
        },
        {
            name: "Mock Interview",
            path: "mock",
            icon: Video,
            status: "active",
            children: [
                { name: 'Voice Mock', path: 'mock/voice', icon: Brain }
            ]
        },
        {
            name: "AI Tools",
            path: "ai",
            icon: Sparkles,
            status: "active",
            children: [
                { name: 'Job Interview', path: 'ai/jobinterviewassistant', icon: Briefcase },
                { name: 'Resume', path: 'ai/resume', icon: FileText },
                { name: 'Cover Letter', path: 'ai/resume/cover-letter', icon: FileText },
            ]
        },
        {
            name: "Jobs",
            path: "jobs",
            icon: Briefcase,
            status: "active"
        }
    ],
    secondary: []
}
