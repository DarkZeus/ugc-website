import type {Post} from "@/pages/feed/feed.types.ts";

export const fetchPosts = async (): Promise<Post[]> => {
    // This would be an API call in a real app
    return [
        {
            id: "1",
            user: {
                name: "Alex Rivera",
                username: "alexdesign",
                initials: "AR",
                isVerified: true
            },
            content: "Just launched our new product design system! It's been months in the making, but I'm thrilled with how it turned out. Check out the case study on my portfolio site.",
            mediaUrl: "https://picsum.photos/seed/picsum/600/400",
            timestamp: "2h ago",
            stats: {
                likes: 248,
                comments: 42,
                reposts: 18
            },
            topComments: [
                {
                    id: "1",
                    user: {
                        name: "Sarah Chen",
                        username: "sarahc",
                        initials: "SC"
                    },
                    content: "This looks amazing! Love the attention to detail.",
                    timestamp: "1h ago"
                }
            ]
        },
        {
            id: "2",
            user: {
                name: "Priya Sharma",
                username: "priyacode",
                initials: "PS",
                isVerified: true
            },
            content: "🚀 Just released v2.0 of my React component library with full TypeScript support and improved accessibility. Open source and ready for your projects!",
            timestamp: "4h ago",
            stats: {
                likes: 587,
                comments: 93,
                reposts: 146
            },
            topComments: [
                {
                    id: "1",
                    user: {
                        name: "Marco Dev",
                        username: "marco_dev",
                        initials: "MD"
                    },
                    content: "Been waiting for this! The TypeScript types are perfect 👌",
                    timestamp: "3h ago"
                }
            ]
        },
        {
            id: "3",
            user: {
                name: "Jordan Taylor",
                username: "jordanux",
                initials: "JT",
                isVerified: false
            },
            content: "User research session today revealed some fascinating insights about how people navigate complex dashboards. Key finding: users prefer progressive disclosure of features rather than seeing everything at once.",
            mediaUrl: "https://picsum.photos/seed/picsum/600/400",
            timestamp: "6h ago",
            stats: {
                likes: 156,
                comments: 37,
                reposts: 24
            },
            topComments: [
                {
                    id: "1",
                    user: {
                        name: "UX Collective",
                        username: "uxcollective",
                        initials: "UX"
                    },
                    content: "Great insight. We've noticed similar patterns in our research.",
                    timestamp: "5h ago"
                }
            ]
        },
        {
            id: "4",
            user: {
                name: "Dev Community",
                username: "devcom",
                initials: "DC",
                isVerified: true
            },
            content: "📊 Poll: What's your preferred state management solution for React apps in 2025?\n\n- TanStack Query & Zustand: 64%\n- Redux Toolkit: 19%\n- Context API: 12%\n- Jotai/Recoil: 5%\n\nInteresting to see how preferences have shifted over the years!",
            timestamp: "12h ago",
            stats: {
                likes: 892,
                comments: 241,
                reposts: 77
            },
            topComments: [
                {
                    id: "1",
                    user: {
                        name: "TypeScript Fan",
                        username: "ts_dev",
                        initials: "TD"
                    },
                    content: "Zustand's TypeScript integration is what won me over. So simple yet powerful!",
                    timestamp: "10h ago"
                }
            ]
        }
    ];
};

// Trending topics
export const trendingTopics = [
    { id: "1", name: "ReactDevSummit", postCount: "5.2K posts" },
    { id: "2", name: "TypeScriptUpdate", postCount: "3.8K posts" },
    { id: "3", name: "AccessibilityMatters", postCount: "2.9K posts" },
    { id: "4", name: "DesignSystems", postCount: "6.1K posts" },
    { id: "5", name: "AIForDevelopers", postCount: "8.7K posts" }
];

// Who to follow suggestions
export const suggestedUsers = [
    {
        id: "1",
        name: "Emma Johnson",
        username: "emmaj",
        bio: "Senior UI Engineer at Netflix",
        initials: "EJ"
    },
    {
        id: "2",
        name: "Kai Zhang",
        username: "kaiz",
        bio: "Design Systems Architect",
        initials: "KZ"
    },
    {
        id: "3",
        name: "Tech Weekly",
        username: "techweekly",
        bio: "Latest news in web development",
        initials: "TW"
    }
];
