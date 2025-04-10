import {Card, CardContent, CardDescription, CardFooter, CardHeader} from "@/components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Link} from "@tanstack/react-router";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Heart, MessageCircle, MoreHorizontal, Repeat2, Send, Share2} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import type {Post, PostComment} from "@/pages/feed/feed.types.ts";

export function PostCard({post}: {post: Post}) {
    return (
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

                {post.topComments && post?.topComments.length > 0 && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg w-full">
                        {post?.topComments.map((comment: PostComment) => (
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
    );
}