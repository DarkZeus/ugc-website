import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardFooter
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Heart,
    MessageCircle,
    Repeat2,
    Send,
    ArrowLeft,
    Bookmark,
    BookmarkPlus,
    Shield
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar.tsx";
import {createFileRoute} from "@tanstack/react-router";

// Types for comments and posts
type User = {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    initials: string;
    isVerified: boolean;
};

type Comment = {
    id: string;
    user: User;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
    replies?: Comment[];
    postId: string;
};

type Post = {
    id: string;
    user: User;
    content: string;
    mediaUrl?: string;
    timestamp: string;
    stats: {
        likes: number;
        comments: number;
        reposts: number;
    };
    isLiked: boolean;
    isReposted: boolean;
    isBookmarked: boolean;
    comments: Comment[];
};


export const Route = createFileRoute('/posts/$postId')({
    component: PostDetailPage,
});

// Mock data fetch function for a single post
const fetchPost = async (postId: string): Promise<Post> => {
    // This would be an API call in a real app
    return {
        id: postId,
        user: {
            id: "user456",
            name: "Ryan Chen",
            username: "ryanchen",
            initials: "RC",
            isVerified: true
        },
        content: "Just released my new open-source React hooks library! It includes performance-optimized state management solutions and accessibility-enhanced interaction hooks. Check it out at github.com/ryanchendev/react-power-hooks. #React #OpenSource #WebDev",
        mediaUrl: `https://picsum.photos/seed/${postId}/600/400`,
        timestamp: "3h ago",
        stats: {
            likes: 243,
            comments: 42,
            reposts: 78
        },
        isLiked: false,
        isReposted: false,
        isBookmarked: false,
        comments: [
            {
                id: "comment1",
                user: {
                    id: "user789",
                    name: "Sarah Chen",
                    username: "sarahc",
                    initials: "SC",
                    isVerified: false
                },
                content: "This looks amazing! I've been looking for a library like this. The accessibility hooks will be super helpful for a project I'm working on right now.",
                timestamp: "2h ago",
                likes: 18,
                isLiked: false,
                postId,
            },
            {
                id: "comment2",
                user: {
                    id: "user101",
                    name: "Marco Dev",
                    username: "marco_dev",
                    initials: "MD",
                    isVerified: true
                },
                content: "Just checked it out - the code is so clean and well-documented. Great job! Question: are you planning to add any form validation hooks in the future?",
                timestamp: "1h ago",
                likes: 9,
                isLiked: false,
                postId,
            },
            {
                id: "comment3",
                user: {
                    id: "user102",
                    name: "Emma Johnson",
                    username: "emmaj",
                    initials: "EJ",
                    isVerified: false
                },
                content: "I've been using this library for a few hours now and it's already saving me so much time. The useDebouncedSearch hook is particularly useful. Thanks for making this open source!",
                timestamp: "45m ago",
                likes: 7,
                isLiked: false,
                replies: [
                    {
                        id: "reply1",
                        user: {
                            id: "user456",
                            name: "Ryan Chen",
                            username: "ryanchen",
                            initials: "RC",
                            isVerified: true
                        },
                        content: "Thanks Emma! I'm glad you're finding it useful. The search hook was one of the first ones I built, so it's great to hear it's working well for you.",
                        timestamp: "30m ago",
                        likes: 4,
                        isLiked: false,
                        postId: '',
                    }
                ],
                postId: '',
            }
        ]
    };
};

// Mock function to add a comment
const addComment = async (postId: string, commentText: string): Promise<Comment> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return a new comment
    return {
        id: `comment-${Date.now()}`,
        postId,
        user: {
            id: "currentUser",
            name: "Mike Edwards",
            username: "mike_dev",
            initials: "ME",
            isVerified: false
        },
        content: commentText,
        timestamp: "Just now",
        likes: 0,
        isLiked: false
    };
};

function PostDetailPage() {
    // const postId = "post123"; // This would come from route params in a real app
    const { postId } = Route.useParams();
    const [newComment, setNewComment] = useState("");
    const queryClient = useQueryClient();

    const {data: post, isLoading} = useQuery({
        queryKey: ["post", postId],
        queryFn: () => fetchPost(postId)
    });

    const addCommentMutation = useMutation({
        mutationFn: (comment: string) => addComment(postId, comment),
        onSuccess: (newComment) => {
            // Update post in the cache with the new comment
            queryClient.setQueryData(["post", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    stats: {
                        ...oldData.stats,
                        comments: oldData.stats.comments + 1
                    },
                    comments: [newComment, ...oldData.comments]
                };
            });

            // Reset comment input
            setNewComment("");
        }
    });

    const toggleLikeMutation = useMutation({
        mutationFn: () => {
            // This would be an API call in a real app
            return Promise.resolve();
        },
        onMutate: () => {
            // Optimistically update the UI
            queryClient.setQueryData(["post", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    isLiked: !oldData.isLiked,
                    stats: {
                        ...oldData.stats,
                        likes: oldData.isLiked
                            ? oldData.stats.likes - 1
                            : oldData.stats.likes + 1
                    }
                };
            });
        }
    });

    const toggleRepostMutation = useMutation({
        mutationFn: () => {
            return Promise.resolve();
        },
        onMutate: () => {
            queryClient.setQueryData(["post", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    isReposted: !oldData.isReposted,
                    stats: {
                        ...oldData.stats,
                        reposts: oldData.isReposted
                            ? oldData.stats.reposts - 1
                            : oldData.stats.reposts + 1
                    }
                };
            });
        }
    });

    const toggleBookmarkMutation = useMutation({
        mutationFn: () => {
            return Promise.resolve();
        },
        onMutate: () => {
            queryClient.setQueryData(["post", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;

                return {
                    ...oldData,
                    isBookmarked: !oldData.isBookmarked
                };
            });
        }
    });

    const likeCommentMutation = useMutation({
        mutationFn: (commentId: string) => {
            return Promise.resolve(commentId);
        },
        onMutate: (commentId) => {
            queryClient.setQueryData(["post", postId], (oldData: Post | undefined) => {
                if (!oldData) return oldData;

                const updateComments = (comments: Comment[]): Comment[] => {
                    return comments.map(comment => {
                        if (comment.id === commentId) {
                            return {
                                ...comment,
                                isLiked: !comment.isLiked,
                                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
                            };
                        } else if (comment.replies) {
                            return {
                                ...comment,
                                replies: updateComments(comment.replies)
                            };
                        }
                        return comment;
                    });
                };

                return {
                    ...oldData,
                    comments: updateComments(oldData.comments)
                };
            });
        }
    });

    if (isLoading || !post) {
        return (
            <div className="flex h-screen bg-white">
                <Sidebar unreadNotifications={3}/>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse">Loading post...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white">
            <Sidebar unreadNotifications={3}/>

            <div className="flex-1 flex flex-col border-r">
                <div className="p-4 border-b flex items-center">
                    <Button variant="ghost" size="icon" className="mr-4">
                        <ArrowLeft className="h-5 w-5"/>
                    </Button>
                    <h1 className="text-xl font-bold">Post</h1>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4">
                        <div className="mb-6">
                            <div className="flex items-start space-x-3">
                                <Avatar className="h-12 w-12">
                                    {post.user.avatarUrl ? (
                                        <AvatarImage src={post.user.avatarUrl} alt={post.user.name}/>
                                    ) : (
                                        <AvatarFallback
                                            className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                                            {post.user.initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>

                                <div className="flex-1">
                                    <div className="flex items-center">
                                        <span className="font-semibold">{post.user.name}</span>
                                        {post.user.isVerified && (
                                            <span className="ml-1 text-blue-500">
                        <Shield className="h-4 w-4"/>
                      </span>
                                        )}
                                        <span className="ml-2 text-gray-500 text-sm">@{post.user.username}</span>
                                    </div>

                                    <div className="mt-1 whitespace-pre-line text-lg">
                                        {post.content}
                                    </div>

                                    {post.mediaUrl && (
                                        <div className="mt-3 rounded-lg overflow-hidden border">
                                            <img
                                                src={post.mediaUrl}
                                                alt="Post media"
                                                className="w-full"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center mt-3 text-gray-500 text-sm">
                                        <span>{post.timestamp}</span>
                                    </div>

                                    <div className="flex items-center justify-between mt-4 py-3 border-y">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{post.stats.comments}</span>
                                            <span className="text-gray-500">Comments</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{post.stats.reposts}</span>
                                            <span className="text-gray-500">Reposts</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">{post.stats.likes}</span>
                                            <span className="text-gray-500">Likes</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button variant="ghost" size="icon">
                                                <BookmarkPlus className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                                            onClick={() => {
                                            }}
                                        >
                                            <MessageCircle className="h-5 w-5 mr-1"/>
                                            <span>Comment</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`hover:bg-green-50 ${
                                                post.isReposted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                                            }`}
                                            onClick={() => toggleRepostMutation.mutate()}
                                        >
                                            <Repeat2 className="h-5 w-5 mr-1"/>
                                            <span>{post.isReposted ? 'Reposted' : 'Repost'}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`hover:bg-red-50 ${
                                                post.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                                            }`}
                                            onClick={() => toggleLikeMutation.mutate()}
                                        >
                                            <Heart className="h-5 w-5 mr-1"/>
                                            <span>{post.isLiked ? 'Liked' : 'Like'}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`hover:bg-blue-50 ${
                                                post.isBookmarked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                                            }`}
                                            onClick={() => toggleBookmarkMutation.mutate()}
                                        >
                                            {post.isBookmarked ? (
                                                <Bookmark className="h-5 w-5 mr-1"/>
                                            ) : (
                                                <BookmarkPlus className="h-5 w-5 mr-1"/>
                                            )}
                                            <span>{post.isBookmarked ? 'Saved' : 'Save'}</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex items-start space-x-3">
                                <Avatar>
                                    <AvatarFallback className="bg-purple-100 text-purple-500">
                                        ME
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex w-full">
                                        <Input
                                            placeholder="Add a comment..."
                                            className="flex-1 border-0 shadow-none bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <Button
                                            size="sm"
                                            className="ml-2 bg-blue-500 hover:bg-blue-600"
                                            disabled={!newComment.trim() || addCommentMutation.isPending}
                                            onClick={() => addCommentMutation.mutate(newComment)}
                                        >
                                            <Send className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {post.comments.map((comment) => (
                                <div key={comment.id} className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <Avatar>
                                            {comment.user.avatarUrl ? (
                                                <AvatarImage src={comment.user.avatarUrl} alt={comment.user.name}/>
                                            ) : (
                                                <AvatarFallback
                                                    className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
                                                    {comment.user.initials}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <span className="font-semibold">{comment.user.name}</span>
                                                {comment.user.isVerified && (
                                                    <span className="ml-1 text-blue-500">
                            <Shield className="h-4 w-4"/>
                          </span>
                                                )}
                                                <span
                                                    className="ml-2 text-gray-500 text-sm">@{comment.user.username}</span>
                                                <span className="ml-2 text-gray-500 text-xs">•</span>
                                                <span className="ml-2 text-gray-500 text-xs">{comment.timestamp}</span>
                                            </div>
                                            <div className="mt-1">
                                                {comment.content}
                                            </div>
                                            <div className="mt-2 flex items-center space-x-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`p-0 h-auto ${comment.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                                                    onClick={() => likeCommentMutation.mutate(comment.id)}
                                                >
                                                    <Heart className="h-4 w-4 mr-1"/>
                                                    <span className="text-xs">{comment.likes || ''}</span>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-500">
                                                    <MessageCircle className="h-4 w-4 mr-1"/>
                                                    <span className="text-xs">Reply</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {comment.replies?.map((reply) => (
                                        <div key={reply.id} className="flex items-start space-x-3 ml-12 mt-3">
                                            <Avatar className="h-8 w-8">
                                                {reply.user.avatarUrl ? (
                                                    <AvatarImage src={reply.user.avatarUrl} alt={reply.user.name}/>
                                                ) : (
                                                    <AvatarFallback
                                                        className="text-sm bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                                                        {reply.user.initials}
                                                    </AvatarFallback>
                                                )}
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <span className="font-semibold">{reply.user.name}</span>
                                                    {reply.user.isVerified && (
                                                        <span className="ml-1 text-blue-500">
                              <Shield className="h-3 w-3"/>
                            </span>
                                                    )}
                                                    <span
                                                        className="ml-2 text-gray-500 text-sm">@{reply.user.username}</span>
                                                    <span className="ml-2 text-gray-500 text-xs">•</span>
                                                    <span
                                                        className="ml-2 text-gray-500 text-xs">{reply.timestamp}</span>
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    {reply.content}
                                                </div>
                                                <div className="mt-2 flex items-center space-x-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className={`p-0 h-auto ${reply.isLiked ? 'text-red-500' : 'text-gray-500'}`}
                                                        onClick={() => likeCommentMutation.mutate(reply.id)}
                                                    >
                                                        <Heart className="h-3 w-3 mr-1"/>
                                                        <span className="text-xs">{reply.likes || ''}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
            </div>

            <div className="w-80 hidden lg:block p-4">
                <Card className="mb-6">
                    <CardHeader className="pb-2">
                        <h3 className="text-lg font-semibold">About the author</h3>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-3 mb-3">
                            <Avatar>
                                {post.user.avatarUrl ? (
                                    <AvatarImage src={post.user.avatarUrl} alt={post.user.name}/>
                                ) : (
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                                        {post.user.initials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <div className="flex items-center">
                                    <span className="font-semibold">{post.user.name}</span>
                                    {post.user.isVerified && (
                                        <span className="ml-1 text-blue-500">
                      <Shield className="h-4 w-4"/>
                    </span>
                                    )}
                                </div>
                                <span className="text-gray-500 text-sm">@{post.user.username}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">
                            Senior Frontend Engineer | TypeScript enthusiast | Building user-friendly interfaces with
                            React & modern web tech
                        </p>

                        <div className="flex space-x-2 mb-4">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">React</Badge>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">TypeScript</Badge>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">UI/UX</Badge>
                        </div>

                        <Button variant="outline" className="w-full">
                            Follow
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <h3 className="text-lg font-semibold">Related posts</h3>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md"></div>
                            <div>
                                <p className="font-medium text-sm">Building accessible components with React and
                                    TypeScript</p>
                                <p className="text-gray-500 text-xs mt-1">Posted by Ryan Chen • 2d ago</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md"></div>
                            <div>
                                <p className="font-medium text-sm">Performance optimization patterns for React hooks</p>
                                <p className="text-gray-500 text-xs mt-1">Posted by Sarah Chen • 5d ago</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md"></div>
                            <div>
                                <p className="font-medium text-sm">Custom form hooks that will simplify your React
                                    code</p>
                                <p className="text-gray-500 text-xs mt-1">Posted by Marco Dev • 1w ago</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="border-t pt-3 justify-center">
                        <Button variant="link" className="text-blue-500">
                            Show more
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}