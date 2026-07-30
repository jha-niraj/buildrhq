"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    AlertCircle, RefreshCw, Pencil, Share2, Settings, Plus, MapPin, Building2,
    Globe, GraduationCap, Briefcase, Sparkles, Zap, FolderKanban, Users,
    ExternalLink, Calendar, FileText, ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@repo/ui/components/ui/card";
import { Button } from "@repo/ui/components/ui/button";
import { Badge } from "@repo/ui/components/ui/badge";
import toast from "@repo/ui/components/ui/sonner";
import { cn } from "@repo/ui/lib/utils";
import { useUserStore } from "@/app/store/useUserStore";
import { ShareProfileModal, EditProfileModal } from "@/components/profile";
import { AddSkillsSheet } from "@/components/profile/sheets/add-skills-sheet";
import { AddWorkExperienceSheet } from "@/components/profile/sheets/add-work-experience-sheet";
import { AddEducationSheet } from "@/components/profile/sheets/add-education-sheet";
import { AddProjectSheet } from "@/components/profile/sheets/add-project-sheet";
import { getOwnProfile, getUserProfileStats } from "@/actions/(main)/user/profile.action";
import { ProfileSkeleton } from "./profile-skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileStats {
    projectsCount: number;
    skillsCount: number;
    followersCount: number;
    followingCount: number;
    xp: number;
    level: number;
    credits: number;
}

interface Skill { id: string; name: string; level: string; category: string }

interface ProfileData {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
    totalXp: number;
    currentXp: number;
    currentLevel: number;
    credits?: number;
    location: string | null;
    company: string | null;
    occupation: string | null;
    website: string | null;
    university: string | null;
    semester: string | null;
    hasResume: boolean;
    resume: string | null;
    createdAt: Date;
    skills: Skill[];
    experiences: Array<{
        id: string;
        companyName: string;
        roleTitle: string;
        description: string | null;
        startDate: Date;
        endDate: Date | null;
        isCurrentlyWorking: boolean;
        companyWebsite: string | null;
    }>;
    educations?: Array<{
        id: string;
        institution: string;
        degree: string | null;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    portfolioProjects?: Array<{
        id: string;
        projectName: string;
        projectType: string;
        description: string | null;
        status: string;
        technologies: string[];
        thumbnailUrl: string | null;
    }>;
    socialLinks?: Array<{ id: string; platform: string; url: string }>;
    userProfile?: {
        showEmail: boolean;
        coverGradient: string | null;
        tagline: string | null;
        theme: string;
        profileViews: number;
        completionScore: number;
    } | null;
    _count?: { followers: number; following: number };
}

// ─── Small building blocks ────────────────────────────────────────────────────

function Section({ title, icon: Icon, action, children }: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    action?: { label: string; onClick: () => void };
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-orange-500" />
                    <h2 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
                        {title}
                    </h2>
                </div>
                {action && (
                    <button
                        type="button"
                        onClick={action.onClick}
                        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-neutral-400 transition-colors hover:text-orange-500"
                    >
                        <Plus className="h-3.5 w-3.5" /> {action.label}
                    </button>
                )}
            </div>
            {children}
        </section>
    );
}

function Empty({ text, action }: { text: string; action?: { label: string; onClick: () => void } }) {
    return (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{text}</p>
            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="cursor-pointer text-sm font-medium text-orange-500 hover:underline"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}

function dateRange(start: Date | string | null, end: Date | string | null, current?: boolean) {
    const fmt = (d: Date | string) =>
        new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
    if (!start) return current ? "Present" : "";
    return `${fmt(start)} — ${current ? "Present" : end ? fmt(end) : "Present"}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const router = useRouter();
    const { user: storeUser, isLoading: storeLoading, error: storeError, fetchUser } = useUserStore();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [shareOpen, setShareOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [skillsOpen, setSkillsOpen] = useState(false);
    const [experienceOpen, setExperienceOpen] = useState(false);
    const [educationOpen, setEducationOpen] = useState(false);
    const [projectOpen, setProjectOpen] = useState(false);

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            await fetchUser();
            const profileResult = await getOwnProfile();
            if (!profileResult.success) {
                setError(profileResult.error || "Failed to load profile");
                return;
            }
            setProfileData((profileResult.user as ProfileData) || null);
            if (profileResult.user?.id) {
                const statsResult = await getUserProfileStats(profileResult.user.id);
                if (statsResult.success && statsResult.stats) setStats(statsResult.stats);
            }
        } catch (err) {
            console.error("Error loading profile:", err);
            setError("Failed to load profile data");
        } finally {
            setIsLoading(false);
        }
    }, [fetchUser]);

    // No spinner: used after an edit, where the page is already on screen and a
    // flash back to the loading state would be worse than a beat of stale data.
    const refreshProfileData = useCallback(async () => {
        try {
            const profileResult = await getOwnProfile();
            if (profileResult.success && profileResult.user) {
                setProfileData(profileResult.user as ProfileData);
                const statsResult = await getUserProfileStats(profileResult.user.id);
                if (statsResult.success && statsResult.stats) setStats(statsResult.stats);
            }
        } catch (err) {
            console.error("Error refreshing profile:", err);
        }
    }, []);

    useEffect(() => { loadProfile(); }, [loadProfile]);

    const onSheetSuccess = useCallback(() => {
        void refreshProfileData();
        toast.success("Profile updated");
    }, [refreshProfileData]);

    // Merge the store user over the fetched profile so an Edit Profile save shows
    // instantly without waiting for the refetch to land.
    const profile = useMemo(() => {
        if (!profileData) return null;
        if (!storeUser) return profileData;
        return {
            ...profileData,
            name: storeUser.name ?? profileData.name,
            bio: storeUser.bio ?? profileData.bio,
            location: storeUser.location ?? profileData.location,
            company: storeUser.company ?? profileData.company,
            occupation: storeUser.occupation ?? profileData.occupation,
            website: storeUser.website ?? profileData.website,
        };
    }, [profileData, storeUser]);

    if ((isLoading || storeLoading) && !profileData) return <ProfileSkeleton />;

    if (error || storeError) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="py-10 text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                            <AlertCircle className="h-7 w-7 text-destructive" />
                        </div>
                        <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
                        <p className="mb-6 text-muted-foreground">{error || storeError}</p>
                        <Button onClick={() => void loadProfile()} className="gap-2">
                            <RefreshCw className="h-4 w-4" /> Try again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardContent className="py-10 text-center">
                        <h2 className="mb-2 text-xl font-semibold">Sign in to view your profile</h2>
                        <p className="mb-6 text-muted-foreground">
                            Create an account or sign in to access your developer profile.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button variant="outline" onClick={() => router.push("/register")}>Create account</Button>
                            <Button onClick={() => router.push("/signin")}>Sign in</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const s: ProfileStats = stats ?? {
        projectsCount: profile.portfolioProjects?.length ?? 0,
        skillsCount: profile.skills?.length ?? 0,
        followersCount: profile._count?.followers ?? 0,
        followingCount: profile._count?.following ?? 0,
        xp: profile.totalXp || profile.currentXp || 0,
        level: profile.currentLevel || 1,
        credits: profile.credits ?? 0,
    };

    // XP inside the current level. Levels are 1000 XP wide, so the bar is the
    // remainder — a lifetime total would sit at ~100% forever and say nothing.
    const xpIntoLevel = s.xp % 1000;
    const xpProgress = Math.min(100, Math.round((xpIntoLevel / 1000) * 100));

    const headline = profile.userProfile?.tagline || profile.occupation || null;
    const experiences = profile.experiences ?? [];
    const educations = profile.educations ?? [];
    const projects = profile.portfolioProjects ?? [];
    const skills = profile.skills ?? [];

    const metaBits = [
        profile.location && { icon: MapPin, text: profile.location },
        profile.company && { icon: Building2, text: profile.company },
        profile.university && { icon: GraduationCap, text: profile.university },
    ].filter(Boolean) as Array<{ icon: React.ComponentType<{ className?: string }>; text: string }>;

    return (
        <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 pb-12 sm:px-6 lg:px-8">
            {/* ── Identity card ── */}
            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
            >
                <div className="h-24 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 sm:h-28" />
                <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex items-end gap-4">
                            <div className="-mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-neutral-100 dark:border-neutral-900 dark:bg-neutral-800 sm:-mt-12 sm:h-24 sm:w-24">
                                {profile.image ? (
                                    <Image
                                        src={profile.image}
                                        alt={profile.name ?? "Profile photo"}
                                        width={96}
                                        height={96}
                                        className="h-full w-full object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-neutral-400">
                                        {(profile.name ?? "?").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 pb-1">
                                <h1 className="truncate text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                                    {profile.name ?? "Your profile"}
                                </h1>
                                {profile.username && (
                                    <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
                                        @{profile.username}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setEditOpen(true)}>
                                <Pencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShareOpen(true)}>
                                <Share2 className="h-3.5 w-3.5" /> Share
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5"
                                onClick={() => router.push("/settings")}
                            >
                                <Settings className="h-3.5 w-3.5" /> Settings
                            </Button>
                        </div>
                    </div>

                    {headline && (
                        <p className="mt-4 text-sm font-medium text-neutral-700 dark:text-neutral-200">{headline}</p>
                    )}
                    {profile.bio && (
                        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                            {profile.bio}
                        </p>
                    )}

                    {(metaBits.length > 0 || profile.website) && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                            {metaBits.map((m) => (
                                <span key={m.text} className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                                    <m.icon className="h-3.5 w-3.5" /> {m.text}
                                </span>
                            ))}
                            {profile.website && (
                                <a
                                    href={profile.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:underline"
                                >
                                    <Globe className="h-3.5 w-3.5" /> Website
                                </a>
                            )}
                        </div>
                    )}

                    {/* Level + XP */}
                    <div className="mt-5 rounded-xl border border-neutral-100 bg-neutral-50/60 p-4 dark:border-neutral-800 dark:bg-neutral-950/30">
                        <div className="mb-2 flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900 dark:text-white">
                                <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Level {s.level}
                            </span>
                            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                                {xpIntoLevel} / 1000 XP to level {s.level + 1}
                            </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all"
                                style={{ width: `${xpProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {[
                            { label: "Total XP", value: s.xp.toLocaleString(), icon: Zap },
                            { label: "Projects", value: s.projectsCount, icon: FolderKanban },
                            { label: "Skills", value: s.skillsCount, icon: Sparkles },
                            { label: "Followers", value: s.followersCount, icon: Users },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-xl border border-neutral-100 px-3.5 py-2.5 dark:border-neutral-800"
                            >
                                <div className="flex items-center gap-1.5">
                                    <stat.icon className="h-3 w-3 text-neutral-400" />
                                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{stat.label}</p>
                                </div>
                                <p className="mt-0.5 text-lg font-bold tabular-nums text-neutral-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ── Everything else: one column of sections, no tabs ── */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <Section
                        title="Projects"
                        icon={FolderKanban}
                        action={{ label: "Add", onClick: () => setProjectOpen(true) }}
                    >
                        {projects.length === 0 ? (
                            <Empty
                                text="No projects on your profile yet."
                                action={{ label: "Add your first project", onClick: () => setProjectOpen(true) }}
                            />
                        ) : (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {projects.slice(0, 6).map((p) => (
                                    <div
                                        key={p.id}
                                        className="rounded-xl border border-neutral-100 p-4 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-600"
                                    >
                                        <div className="mb-1.5 flex items-start justify-between gap-2">
                                            <h3 className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                                                {p.projectName}
                                            </h3>
                                            <Badge variant="secondary" className="shrink-0 text-xs">{p.status}</Badge>
                                        </div>
                                        {p.description && (
                                            <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">
                                                {p.description}
                                            </p>
                                        )}
                                        {p.technologies?.length > 0 && (
                                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                {p.technologies.slice(0, 4).map((t) => (
                                                    <span
                                                        key={t}
                                                        className="rounded-md bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300"
                                                    >
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    <Section
                        title="Experience"
                        icon={Briefcase}
                        action={{ label: "Add", onClick: () => setExperienceOpen(true) }}
                    >
                        {experiences.length === 0 ? (
                            <Empty
                                text="No work experience added yet."
                                action={{ label: "Add a role", onClick: () => setExperienceOpen(true) }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {experiences.map((e) => (
                                    <div key={e.id} className="flex gap-3">
                                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <Briefcase className="h-4 w-4 text-neutral-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                {e.roleTitle}
                                            </p>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                                {e.companyWebsite ? (
                                                    <a
                                                        href={e.companyWebsite}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 hover:text-orange-500"
                                                    >
                                                        {e.companyName} <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : e.companyName}
                                            </p>
                                            <p className="mt-0.5 font-mono text-xs text-neutral-400">
                                                {dateRange(e.startDate, e.endDate, e.isCurrentlyWorking)}
                                            </p>
                                            {e.description && (
                                                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                                                    {e.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    <Section
                        title="Education"
                        icon={GraduationCap}
                        action={{ label: "Add", onClick: () => setEducationOpen(true) }}
                    >
                        {educations.length === 0 ? (
                            <Empty
                                text="No education added yet."
                                action={{ label: "Add your school", onClick: () => setEducationOpen(true) }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {educations.map((ed) => (
                                    <div key={ed.id} className="flex gap-3">
                                        <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <GraduationCap className="h-4 w-4 text-neutral-500" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                                                {ed.institution}
                                            </p>
                                            {ed.degree && (
                                                <p className="text-sm text-neutral-600 dark:text-neutral-400">{ed.degree}</p>
                                            )}
                                            <p className="mt-0.5 inline-flex items-center gap-1 font-mono text-xs text-neutral-400">
                                                <Calendar className="h-3 w-3" />
                                                {dateRange(ed.startDate, ed.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                <div className="space-y-5">
                    <Section
                        title="Skills"
                        icon={Sparkles}
                        action={{ label: "Manage", onClick: () => setSkillsOpen(true) }}
                    >
                        {skills.length === 0 ? (
                            <Empty
                                text="No skills added yet."
                                action={{ label: "Add skills", onClick: () => setSkillsOpen(true) }}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {skills.map((skill) => (
                                    <span
                                        key={skill.id}
                                        className={cn(
                                            "rounded-lg border px-2.5 py-1 text-sm font-medium",
                                            "border-neutral-200 bg-neutral-50 text-neutral-700",
                                            "dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
                                        )}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </Section>

                    <Section title="Resume" icon={FileText}>
                        {profile.hasResume ? (
                            <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 p-3.5 dark:border-neutral-800">
                                <div className="flex items-center gap-2.5">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm text-neutral-700 dark:text-neutral-300">Resume on file</span>
                                </div>
                                <Link
                                    href="/ai"
                                    className="inline-flex items-center gap-1 text-sm font-medium text-orange-500 hover:underline"
                                >
                                    AI review <ArrowRight className="h-3 w-3" />
                                </Link>
                            </div>
                        ) : (
                            <Empty text="No resume uploaded. It powers the AI resume review, cover letters and interview prep." />
                        )}
                    </Section>

                    {profile.socialLinks && profile.socialLinks.length > 0 && (
                        <Section title="Links" icon={Globe}>
                            <div className="space-y-2">
                                {profile.socialLinks.map((l) => (
                                    <a
                                        key={l.id}
                                        href={l.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-orange-500 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    >
                                        <span className="truncate">{l.platform}</span>
                                        <ExternalLink className="h-3 w-3 shrink-0 text-neutral-400" />
                                    </a>
                                ))}
                            </div>
                        </Section>
                    )}
                </div>
            </div>

            {/* ── Modals & sheets ── */}
            <ShareProfileModal
                isOpen={shareOpen}
                onClose={() => setShareOpen(false)}
                username={profile.username || ""}
                name={profile.name}
                image={profile.image}
            />
            <EditProfileModal
                isOpen={editOpen}
                onClose={() => setEditOpen(false)}
                user={profile}
                onUpdate={refreshProfileData}
            />
            <AddSkillsSheet
                open={skillsOpen}
                onOpenChange={setSkillsOpen}
                onSuccess={onSheetSuccess}
                existingSkills={skills}
            />
            <AddWorkExperienceSheet
                open={experienceOpen}
                onOpenChange={setExperienceOpen}
                onSuccess={onSheetSuccess}
            />
            <AddEducationSheet
                open={educationOpen}
                onOpenChange={setEducationOpen}
                onSuccess={onSheetSuccess}
            />
            <AddProjectSheet
                open={projectOpen}
                onOpenChange={setProjectOpen}
                onSuccess={onSheetSuccess}
            />
        </div>
    );
}
