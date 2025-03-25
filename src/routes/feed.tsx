import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { createFileRoute } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
    Heart,
    MessageCircle,
    Bookmark,
    Share2,
    MoreHorizontal,
    Play,
    UserPlus,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute('/feed')({
    component: FeedPage,
});

// Types
type MediaType = "image" | "video";

type PostAuthor = {
    id: string;
    username: string;
    name: string;
    avatar: string;
    verified: boolean;
    isFollowing: boolean;
};

type PostComment = {
    id: string;
    author: PostAuthor;
    text: string;
    likes: number;
    createdAt: string;
};

type Post = {
    id: string;
    author: PostAuthor;
    caption: string;
    mediaType: MediaType;
    mediaUrl: string;
    likes: number;
    comments: number;
    hasLiked: boolean;
    hasSaved: boolean;
    createdAt: string;
    location?: string;
    tags?: string[];
    topComments?: PostComment[];
};

// Mock API function to fetch feed posts
const fetchFeedPosts = async (
    { pageParam = 1 }
): Promise<{ posts: Post[]; nextPage: number | null }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const limit = 10;
    const totalPosts = 100; // Simulate a large number of posts
    const startIndex = (pageParam - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalPosts);

    // Generate fake posts
    const posts: Post[] = [];

    for (let i = startIndex; i < endIndex; i++) {
        const authorId = i % 15; // Cycle through 15 different authors
        const isVideo = i % 5 === 0; // Every 5th post is a video
        const randomLikes = 50 + Math.floor(Math.random() * 950);
        const randomComments = 5 + Math.floor(Math.random() * 95);
        const randomHoursAgo = 1 + Math.floor(Math.random() * 72);
        const hasRandomTags = i % 3 === 0;
        const hasRandomLocation = i % 4 === 0;

        posts.push({
            id: `post-${i}`,
            author: {
                id: `user-${authorId}`,
                username: `creator${authorId}`,
                name: `Creator ${authorId}`,
                avatar: `https://picsum.photos/seed/avatar${authorId}/200/200`,
                verified: authorId % 3 === 0,
                isFollowing: true,
            },
            caption:
                i % 3 === 0
                    ? "Just finished this new piece! What do you think? #creativework #process #artistlife"
                    : i % 3 === 1
                        ? "Exploring new techniques and pushing boundaries with this project. Always learning, always growing."
                        : "Behind the scenes look at my latest work in progress. Can't wait to share the final result!",
            mediaType: isVideo ? "video" : "image",
            mediaUrl: `https://picsum.photos/seed/post${i}/600/600`,
            likes: randomLikes,
            comments: randomComments,
            hasLiked: i % 4 === 0,
            hasSaved: i % 7 === 0,
            createdAt: new Date(Date.now() - randomHoursAgo * 3600000).toISOString(),
            location: hasRandomLocation ? "New York, NY" : undefined,
            tags: hasRandomTags ? ["design", "creative", "artwork"] : undefined,
            topComments: i % 2 === 0 ? [
                {
                    id: `comment-${i}-1`,
                    author: {
                        id: `user-${(authorId + 1) % 15}`,
                        username: `user${(authorId + 1) % 15}`,
                        name: `User ${(authorId + 1) % 15}`,
                        avatar: `https://picsum.photos/seed/avatar${(authorId + 1) % 15}/200/200`,
                        verified: ((authorId + 1) % 15) % 5 === 0,
                        isFollowing: ((authorId + 1) % 15) % 2 === 0,
                    },
                    text: "This is absolutely stunning work! Love the details.",
                    likes: 5 + Math.floor(Math.random() * 25),
                    createdAt: new Date(Date.now() - (randomHoursAgo - 1) * 3600000).toISOString(),
                }
            ] : undefined,
        });
    }

    const nextPage = endIndex < totalPosts ? pageParam + 1 : null;

    return {
        posts,
        nextPage
    };
};

// PostCard Component
const PostCard = ({ post }: { post: Post }) => {
    const [liked, setLiked] = useState(post.hasLiked);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [saved, setSaved] = useState(post.hasSaved);

    const handleLike = () => {
        if (liked) {
            setLikesCount(prev => prev - 1);
        } else {
            setLikesCount(prev => prev + 1);
        }
        setLiked(prev => !prev);
    };

    const handleSave = () => {
        setSaved(prev => !prev);
    };

    return (
        <div className="mb-6 bg-card rounded-lg overflow-hidden border">
            {/* Post Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center">
                            <span className="font-semibold text-sm">{post.author.username}</span>
                            {post.author.verified && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <Badge variant="outline" className="ml-1 h-4 w-4 p-0 flex items-center justify-center bg-blue-500 border-blue-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                                                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                                                </svg>
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Verified Account</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        {post.location && (
                            <p className="text-xs text-muted-foreground">{post.location}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {!post.author.isFollowing && (
                        <Button size="sm" className="h-8">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Follow
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Mute</DropdownMenuItem>
                            <DropdownMenuItem>Hide</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Report</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Post Media */}
            <div className="relative">
                <img
                    src={post.mediaUrl}
                    alt={`Post by ${post.author.username}`}
                    className="w-full"
                />
                {post.mediaType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full bg-black/30 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" fill="white" />
                        </div>
                    </div>
                )}
            </div>

            {/* Post Actions */}
            <div className="p-4">
                <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-9 w-9 ${liked ? "text-red-500" : ""}`}
                            onClick={handleLike}
                        >
                            <Heart className={`h-6 w-6 ${liked ? "fill-red-500" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9">
                            <Share2 className="h-6 w-6" />
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-9 w-9 ${saved ? "text-yellow-500" : ""}`}
                        onClick={handleSave}
                    >
                        <Bookmark className={`h-6 w-6 ${saved ? "fill-yellow-500" : ""}`} />
                    </Button>
                </div>

                {/* Likes */}
                <div className="font-semibold text-sm mb-1">{likesCount.toLocaleString()} likes</div>

                {/* Caption */}
                <div className="text-sm mb-1">
                    <span className="font-semibold">{post.author.username}</span>{" "}
                    {post.caption}
                    {post.tags && (
                        <div className="mt-1">
                            {post.tags.map(tag => (
                                <span key={tag} className="mr-1 text-blue-600">#{tag}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Comments */}
                {post.comments > 0 && (
                    <div className="text-sm text-muted-foreground mb-1">
                        {post.topComments && post.topComments.length > 0 ? (
                            <div className="space-y-1 mt-2">
                                {post.topComments.map(comment => (
                                    <div key={comment.id} className="flex gap-1">
                                        <span className="font-semibold">{comment.author.username}</span>
                                        <span>{comment.text}</span>
                                    </div>
                                ))}
                                {post.comments > post.topComments.length && (
                                    <Button variant="link" className="p-0 h-auto">
                                        View all {post.comments} comments
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Button variant="link" className="p-0 h-auto">
                                View all {post.comments} comments
                            </Button>
                        )}
                    </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(post.createdAt))} ago
                </div>
            </div>
        </div>
    );
};

// Feed Page Component
function FeedPage() {
    const [activeTab, setActiveTab] = useState("following");

    // Query to fetch feed posts with useInfiniteQuery
    const {
        data,
        isLoading,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ["feedPosts", activeTab],
        queryFn: fetchFeedPosts,
        getNextPageParam: (lastPage) => lastPage.nextPage,
        initialPageParam: 1
    });

    // Setup intersection observer for infinite scrolling
    const { ref, inView } = useInView();

    // Load more posts when reaching the bottom
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Get all posts from all pages
    const allPosts = data?.pages.flatMap(page => page.posts) || [];

    return (
        <div className="container mx-auto py-6 px-4 max-w-2xl">
            <div className="mb-6">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-2 w-full">
                        <TabsTrigger value="following">Following</TabsTrigger>
                        <TabsTrigger value="featured">Featured</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {isLoading ? (
                <div className="space-y-6">
                    {Array(3).fill(null).map((_, i) => (
                        <div key={i} className="bg-card rounded-lg overflow-hidden border">
                            <div className="flex items-center gap-2 p-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div>
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16 mt-1" />
                                </div>
                            </div>
                            <Skeleton className="h-[400px] w-full" />
                            <div className="p-4">
                                <div className="flex justify-between mb-4">
                                    <div className="flex gap-2">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-4 w-full mb-1" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    {allPosts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}

                    {/* Loading indicator and intersection observer target */}
                    <div ref={ref} className="py-4 flex justify-center">
                        {isFetchingNextPage && (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Loading more posts...</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}