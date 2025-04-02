import type {Post} from "@/pages/feed.types.ts";

export const createPost = async (postData: { content: string; mediaUrl?: string }): Promise<Post> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return a new post with the provided content
    return {
        id: `new-${Date.now()}`,
        user: {
            name: "Mike Edwards",
            username: "mike_dev",
            initials: "ME",
            isVerified: false
        },
        content: postData.content,
        mediaUrl: postData.mediaUrl,
        timestamp: "Just now",
        stats: {
            likes: 0,
            comments: 0,
            reposts: 0
        },
        topComments: []
    };
};