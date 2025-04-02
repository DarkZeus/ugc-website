export type PostComment = {
    id: string;
    user: {
        name: string;
        username: string;
        avatarUrl?: string;
        initials: string;
    };
    content: string;
    timestamp: string;
};

export type Post = {
    id: string;
    user: {
        name: string;
        username: string;
        avatarUrl?: string;
        initials: string;
        isVerified: boolean;
    };
    content: string;
    mediaUrl?: string;
    timestamp: string;
    stats: {
        likes: number;
        comments: number;
        reposts: number;
    };
    topComments: PostComment[];
};
