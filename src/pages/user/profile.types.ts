import type {Post} from "@/pages/feed/feed.types.ts";

export type ProfileData = {
    user: {
        name: string;
        username: string;
        avatarUrl?: string;
        headerImageUrl?: string;
        initials: string;
        bio: string;
        location: string;
        website: string;
        joinDate: string;
        isVerified: boolean;
        workInfo: string;
        contact: string;
        stats: {
            posts: number;
            followers: number;
            following: number;
            likes: number;
        };
        github?: string;
        twitter?: string;
        badges: Array<{
            id: string;
            name: string;
            icon: string;
        }>;
    };
    posts: Post[];
};