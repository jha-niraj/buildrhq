import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfileByUsername } from "@/actions/(main)/user/profile.action";
import { PublicProfileClient } from "./_components/public-profile-client";
import { publicProfileUrl } from "@/lib/urls";

interface PageProps {
    params: Promise<{
        username: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;
    const result = await getProfileByUsername(username);

    if (!result.success || !result.user) {
        return {
            title: "Profile Not Found | ShiprHQ",
            description: "This profile could not be found.",
        };
    }

    const user = result.user;
    const title = `${user.name || user.username} | ShiprHQ`;
    const description =
        user.userProfile?.tagline ||
        user.bio ||
        `Check out ${user.name || user.username}'s profile on ShiprHQ`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "profile",
            images: user.image ? [{ url: user.image }] : [],
            // Was a hardcoded absolute URL on the wrong host, pointing at `/u/{username}`
            // — a route that does not exist — so every link preview resolved to a 404.
            // Phrased without naming the old host so a future rebrand sweep cannot
            // rewrite this note into describing a mistake that was never made.
            url: publicProfileUrl(user.username!),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: user.image ? [user.image] : [],
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;
    const result = await getProfileByUsername(username);

    if (!result.success || !result.user) {
        notFound();
    }

    return (
        <PublicProfileClient
            user={result.user}
            isOwnProfile={result.isOwnProfile || false}
            isFollowing={result.isFollowing || false}
        />
    );
}