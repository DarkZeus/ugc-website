import type {ProfileData} from "@/pages/user/profile.types.ts";
import type {Post} from "@/pages/feed/feed.types.ts";

export const fetchProfileData = async (): Promise<ProfileData> => {
    // This would be an API call in a real app
    const user = {
        name: "Ryan Chen",
        username: "ryanchen",
        initials: "RC",
        headerImageUrl: "https://picsum.photos/seed/avatar/1200/300",
        avatarUrl: "https://picsum.photos/seed/avatar/400/400",
        bio: "Senior Frontend Engineer | TypeScript enthusiast | Building user-friendly interfaces with React & modern web tech | Open source contributor",
        location: "San Francisco, CA",
        website: "ryanchen.dev",
        joinDate: "Joined March 2019",
        isVerified: true,
        workInfo: "Frontend Lead at TechSolutions Inc.",
        contact: "ryan@techsolutions.com",
        stats: {
            posts: 482,
            followers: 8754,
            following: 325,
            likes: 2103
        },
        github: "github.com/ryanchendev",
        twitter: "twitter.com/ryanchendev",
        badges: [
            {
                id: "1",
                name: "Certified React Developer",
                icon: "🏆"
            },
            {
                id: "2",
                name: "Open Source Contributor",
                icon: "⭐"
            },
            {
                id: "3",
                name: "TypeScript Expert",
                icon: "🔷"
            }
        ]
    };

    // Create posts that match the Post type structure
    const posts: Post[] = [
        {
            id: "1",
            user: {
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                initials: user.initials,
                isVerified: user.isVerified
            },
            content: "Just released my new open-source React hooks library! Check it out at github.com/ryanchendev/react-power-hooks. It includes performance-optimized state management solutions and accessibility-enhanced interaction hooks. #React #OpenSource #WebDev",
            timestamp: "2h ago",
            stats: {
                likes: 243,
                comments: 42,
                reposts: 78
            }
        },
        {
            id: "2",
            user: {
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                initials: user.initials,
                isVerified: user.isVerified
            },
            content: "Conference talk on 'Building Accessible Web Apps' went great today! Thanks to everyone who attended. Slides are now available on my website.",
            mediaUrl: "https://picsum.photos/seed/picsum/600/400",
            timestamp: "1d ago",
            stats: {
                likes: 512,
                comments: 64,
                reposts: 112
            }
        },
        {
            id: "3",
            user: {
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                initials: user.initials,
                isVerified: user.isVerified
            },
            content: "TypeScript tip of the day: Use discriminated unions for more precise type checking in your React components.\n\n```typescript\ntype Props = \n  | { variant: 'primary'; color: string }\n  | { variant: 'secondary'; backgroundColor: string };\n```\n\nThis prevents invalid prop combinations! #TypeScript #WebDevTips",
            timestamp: "2d ago",
            stats: {
                likes: 378,
                comments: 52,
                reposts: 91
            }
        },
        {
            id: "4",
            user: {
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
                initials: user.initials,
                isVerified: user.isVerified
            },
            content: "Current tech stack for our latest project:\n\n• React 18 with Suspense\n• TypeScript (strict mode)\n• TanStack Query v5\n• Zustand for state\n• Shadcn/UI + Tailwind\n• Vitest + Testing Library\n• Deployed on Vercel\n\nLoving this combo for developer experience and performance!",
            timestamp: "3d ago",
            stats: {
                likes: 427,
                comments: 87,
                reposts: 103
            }
        }
    ];

    return {
        user,
        posts
    };
};
