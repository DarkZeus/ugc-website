import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Sidebar} from "@/components/Sidebar.tsx";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
    Heart,
    Image as ImageIcon, Loader2,
    MessageCircle,
    MoreHorizontal,
    Repeat2,
    Search,
    Send,
    Share2,
    Smile, X
} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Link} from "@tanstack/react-router";
import {Badge} from "@/components/ui/badge.tsx";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {fetchPosts, suggestedUsers, trendingTopics} from "@/services/feed.service.ts";
import {createPost} from "@/services/post.service.ts";
import type {Post, PostComment} from "@/pages/feed.types.ts";

export function SocialFeedPage() {
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [newPostContent, setNewPostContent] = useState("");
    const [isImageAttached, setIsImageAttached] = useState(false);

    const queryClient = useQueryClient();

    const {data: posts = []} = useQuery({
        queryKey: ["posts"],
        queryFn: fetchPosts
    });

    const createPostMutation = useMutation({
        mutationFn: createPost,
        onSuccess: (newPost) => {
            // Update posts in the cache
            queryClient.setQueryData(["posts"], (oldData: Post[] = []) => {
                return [newPost, ...oldData];
            });

            // Reset form and close dialog
            setNewPostContent("");
            setIsImageAttached(false);
            setIsCreatePostOpen(false);
        }
    });

    return (
        <div className="flex h-screen bg-white">
            {/* Left Sidebar */}
            <Sidebar
                onCreatePost={() => setIsCreatePostOpen(true)}
                unreadNotifications={8}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="border-b p-4">
                    <Tabs defaultValue="foryou">
                        <TabsList className="bg-transparent">
                            <TabsTrigger value="foryou"
                                         className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none data-[state=active]:shadow-none">
                                For You
                            </TabsTrigger>
                            <TabsTrigger value="following"
                                         className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none data-[state=active]:shadow-none">
                                Following
                            </TabsTrigger>
                            <TabsTrigger value="trending"
                                         className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none data-[state=active]:shadow-none">
                                Trending
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="p-4 border-b">
                    <div className="flex items-start space-x-3">
                        <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-500">
                                ME
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Input
                                placeholder="What's happening?"
                                className="border-0 p-2 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center space-x-3">
                                    <Button variant="ghost" size="sm" className="text-blue-500">
                                        <ImageIcon className="h-5 w-5"/>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-blue-500">
                                        <Smile className="h-5 w-5"/>
                                    </Button>
                                </div>
                                <Button size="sm" className="bg-blue-500 hover:bg-blue-600">
                                    Post
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="space-y-4 p-4">
                        {posts.map((post) => (
                            <Card key={post.id} className="border shadow-sm hover:shadow-md transition-shadow">
                                <Link to='/posts/$postId' params={{postId: post.id}} key={post.id}>
                                    <CardHeader className="p-4 pb-0 flex flex-row items-start space-x-3">
                                        <Avatar>
                                            {post.user.avatarUrl ? (
                                                <AvatarImage src={post.user.avatarUrl} alt={post.user.name}/>
                                            ) : (
                                                <AvatarFallback
                                                    className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                                                    {post.user.initials}
                                                </AvatarFallback>
                                            )}
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center">
                                                <span className="font-semibold">{post.user.name}</span>
                                                {post.user.isVerified && (
                                                    <Badge className="ml-1 bg-blue-500 p-0.5 rounded-full">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                                             stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                                                             strokeLinejoin="round">
                                                            <path d="M20 6L9 17l-5-5"/>
                                                        </svg>
                                                    </Badge>
                                                )}
                                                <span
                                                    className="ml-2 text-gray-500 text-sm">@{post.user.username}</span>
                                                <span className="text-gray-500 text-xs ml-2">• {post.timestamp}</span>
                                            </div>
                                            <CardDescription
                                                className="mt-1 whitespace-pre-line text-base text-gray-900">
                                                {post.content}
                                            </CardDescription>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-gray-400">
                                            <MoreHorizontal className="h-4 w-4"/>
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="p-4">
                                        {post.mediaUrl && (
                                            <div className="mt-3 overflow-hidden rounded-lg">
                                                <img src={post.mediaUrl} alt="Post media"
                                                     className="w-full object-cover"/>
                                            </div>
                                        )}
                                    </CardContent>
                                </Link>
                                <CardFooter className="p-4 pt-0 flex flex-col">
                                    <div className="flex items-center justify-between w-full">
                                        <Button variant="ghost" size="sm"
                                                className="text-gray-500 hover:text-blue-500 space-x-1">
                                            <Heart className="h-4 w-4"/>
                                            <span>{post.stats.likes}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm"
                                                className="text-gray-500 hover:text-blue-500 space-x-1">
                                            <MessageCircle className="h-4 w-4"/>
                                            <span>{post.stats.comments}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm"
                                                className="text-gray-500 hover:text-green-500 space-x-1">
                                            <Repeat2 className="h-4 w-4"/>
                                            <span>{post.stats.reposts}</span>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                                            <Share2 className="h-4 w-4"/>
                                        </Button>
                                    </div>

                                    {post.topComments.length > 0 && (
                                        <div className="mt-4 bg-gray-50 p-3 rounded-lg w-full">
                                            {post.topComments.map((comment: PostComment) => (
                                                <div key={comment.id} className="flex items-start space-x-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                                            {comment.user.initials}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="flex items-center">
                                                                <span
                                                                    className="text-sm font-medium">{comment.user.name}</span>
                                                            <span
                                                                className="text-xs text-gray-500 ml-1">@{comment.user.username}</span>
                                                            <span
                                                                className="text-xs text-gray-500 ml-1">• {comment.timestamp}</span>
                                                        </div>
                                                        <p className="text-sm">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="mt-3 flex items-center space-x-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="bg-purple-100 text-purple-500 text-xs">
                                                        ME
                                                    </AvatarFallback>
                                                </Avatar>
                                                <Input
                                                    placeholder="Add a comment..."
                                                    className="h-8 text-sm bg-white"
                                                />
                                                <Button size="icon" className="h-7 w-7 bg-blue-500 hover:bg-blue-600">
                                                    <Send className="h-3 w-3"/>
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l p-4 hidden lg:block">
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                        <Input
                            placeholder="Search"
                            className="pl-9 bg-gray-100 border-0"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-3">Trending topics</h3>
                    <div className="space-y-3">
                        {trendingTopics.map((topic) => (
                            <div key={topic.id} className="group cursor-pointer">
                                <p className="font-semibold group-hover:text-blue-500">#{topic.name}</p>
                                <p className="text-sm text-gray-500">{topic.postCount}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-lg mb-3">Who to follow</h3>
                    <div className="space-y-4">
                        {suggestedUsers.map((user) => (
                            <div key={user.id} className="flex items-center space-x-3">
                                <Avatar>
                                    <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
                                        {user.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">{user.name}</p>
                                    <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                                </div>
                                <Button variant="outline" size="sm" className="text-sm">
                                    Follow
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Create Post Dialog */}
            <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create a new post</DialogTitle>
                    </DialogHeader>

                    <div className="flex items-start space-x-3 mt-4">
                        <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-500">
                                ME
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="What's on your mind?"
                                className="min-h-24 border-0 focus-visible:ring-0 text-base p-0 resize-none"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />

                            {isImageAttached && (
                                <div className="mt-3 border rounded-lg p-2 relative">
                                    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                                        <ImageIcon className="h-8 w-8 text-gray-400"/>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 absolute top-3 right-3 bg-gray-800/50 hover:bg-gray-800/70 text-white rounded-full"
                                        onClick={() => setIsImageAttached(false)}
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t mt-4">
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500"
                                onClick={() => setIsImageAttached(!isImageAttached)}
                            >
                                <ImageIcon className="h-5 w-5"/>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-blue-500">
                                <Smile className="h-5 w-5"/>
                            </Button>
                        </div>

                        <DialogFooter className="sm:justify-end">
                            <Button
                                variant="ghost"
                                onClick={() => setIsCreatePostOpen(false)}
                                disabled={createPostMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600"
                                disabled={!newPostContent.trim() || createPostMutation.isPending}
                                onClick={() => {
                                    createPostMutation.mutate({
                                        content: newPostContent,
                                        mediaUrl: isImageAttached ? "/api/placeholder/600/300" : undefined
                                    });
                                }}
                            >
                                {createPostMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Posting...
                                    </>
                                ) : (
                                    "Post"
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}