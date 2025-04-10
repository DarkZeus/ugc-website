import {useQuery} from "@tanstack/react-query";
import {fetchProfileData} from "@/services/profile.service.ts";
import {Sidebar} from "@/components/Sidebar.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Briefcase, CalendarDays, Github, Heart, LinkIcon, Mail, MapPin, Shield, Twitter} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {PostCard} from "@/components/posts/post-card.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";

export function UserProfilePage() {
    const {data: profileData} = useQuery({
        queryKey: ["profileData"],
        queryFn: fetchProfileData,
        initialData: {
            user: {
                name: "Ryan Chen",
                username: "ryanchen",
                initials: "RC",
                headerImageUrl: "https://picsum.photos/seed/avatar/1200/300",
                bio: "Senior Frontend Engineer | TypeScript enthusiast",
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
                badges: []
            },
            posts: []
        }
    });

    const {user, posts} = profileData;

    return (
        <div className="flex h-screen bg-white">
            {/* Left Sidebar */}
            <Sidebar unreadNotifications={8} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                    {user.headerImageUrl && (
                        <img
                            src={user.headerImageUrl}
                            alt="Profile header"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>

                {/* Profile Info */}
                <div className="px-6 pb-4 border-b relative">
                    <div className="flex justify-between items-start">
                        <div className="flex-shrink-0">
                            <Avatar className="h-24 w-24 border-4 border-white ring-4 ring-white bg-white">
                                {user.avatarUrl ? (
                                    <AvatarImage src={user.avatarUrl} alt={user.name}/>
                                ) : (
                                    <AvatarFallback
                                        className="text-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                                        {user.initials}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </div>
                        <div className="flex space-x-2 mt-10">
                            <Button variant="outline" className="border-gray-300">
                                <Mail className="h-4 w-4 mr-2"/>
                                Message
                            </Button>
                            <Button className="bg-blue-500 hover:bg-blue-600">
                                Follow
                            </Button>
                        </div>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold">{user.name}</h1>
                            {user.isVerified && (
                                <span className="ml-1 text-blue-500 bg-blue-100 p-1 rounded-full inline-flex">
                  <Shield className="h-4 w-4"/>
                </span>
                            )}
                        </div>
                        <p className="text-gray-500">@{user.username}</p>

                        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-3 gap-y-1">
                            {user.workInfo && (
                                <div className="flex items-center mr-4">
                                    <Briefcase className="h-4 w-4 mr-1"/>
                                    <span>{user.workInfo}</span>
                                </div>
                            )}
                            {user.location && (
                                <div className="flex items-center mr-4">
                                    <MapPin className="h-4 w-4 mr-1"/>
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.website && (
                                <div className="flex items-center mr-4">
                                    <LinkIcon className="h-4 w-4 mr-1"/>
                                    <a href={`https://${user.website}`} className="text-blue-500 hover:underline">
                                        {user.website}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center">
                                <CalendarDays className="h-4 w-4 mr-1"/>
                                <span>{user.joinDate}</span>
                            </div>
                        </div>

                        <p className="mt-3 text-gray-800">{user.bio}</p>

                        {user.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {user.badges.map(badge => (
                                    <span
                                        key={badge.id}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800"
                                    >
                    <span className="mr-1">{badge.icon}</span>
                                        {badge.name}
                  </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center space-x-6 mt-4">
                            <div>
                                <span className="font-bold">{user.stats.posts.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">Posts</span>
                            </div>
                            <div>
                                <span className="font-bold">{user.stats.followers.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">Followers</span>
                            </div>
                            <div>
                                <span className="font-bold">{user.stats.following.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">Following</span>
                            </div>
                            <div>
                                <span className="font-bold">{user.stats.likes.toLocaleString()}</span>
                                <span className="text-gray-500 ml-1">Likes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="posts" className="flex-1 flex flex-col">
                    <div className="border-b">
                        <TabsList className="bg-transparent border-b-0 rounded-none h-12">
                            <TabsTrigger
                                value="posts"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12"
                            >
                                Posts
                            </TabsTrigger>
                            <TabsTrigger
                                value="media"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12"
                            >
                                Media
                            </TabsTrigger>
                            <TabsTrigger
                                value="likes"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none h-12"
                            >
                                Likes
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="posts" className="flex-1 p-0 m-0">
                        <ScrollArea className="h-full">
                            <div className="divide-y">
                                {posts.map((post) => (
                                    <div className="p-4">
                                        <PostCard key={post.id} post={post} />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="media" className="flex-1 p-4 m-0">
                        <div className="grid grid-cols-3 gap-2">
                            {posts
                                .filter(post => post.mediaUrl)
                                .map((post) => (
                                    <div key={post.id} className="aspect-square overflow-hidden rounded-md border">
                                        <img
                                            src={post.mediaUrl}
                                            alt="Media"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="likes" className="flex-1 p-6 m-0">
                        <div className="text-center text-gray-500">
                            <Heart className="h-12 w-12 mx-auto mb-2 text-gray-300"/>
                            <p className="text-lg">Content that {user.name} has liked will appear here</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l p-4 hidden lg:block">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-base mb-3">About</h3>
                    <div className="space-y-2">
                        {user.github && (
                            <div className="flex items-center">
                                <Github className="h-4 w-4 mr-2 text-gray-500"/>
                                <a href={`https://${user.github}`} className="text-blue-500 hover:underline text-sm">
                                    {user.github}
                                </a>
                            </div>
                        )}
                        {user.twitter && (
                            <div className="flex items-center">
                                <Twitter className="h-4 w-4 mr-2 text-gray-500"/>
                                <a href={`https://${user.twitter}`} className="text-blue-500 hover:underline text-sm">
                                    {user.twitter}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-500"/>
                            <span className="text-sm">{user.contact}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-base mb-3">Featured Projects</h3>
                    <div className="space-y-3">
                        <Card className="overflow-hidden">
                            <img src="https://picsum.photos/seed/avatar/320/120" alt="Project thumbnail"
                                 className="w-full h-24 object-cover"/>
                            <CardContent className="p-3">
                                <h4 className="font-medium">React Power Hooks</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    A collection of performance-optimized React hooks for modern web applications
                                </p>
                                <div className="flex items-center mt-2">
                                    <div className="flex text-yellow-400 text-xs">
                                        ★★★★★
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">542 stars</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden">
                            <img src="https://picsum.photos/seed/avatar/320/120" alt="Project thumbnail"
                                 className="w-full h-24 object-cover"/>
                            <CardContent className="p-3">
                                <h4 className="font-medium">TypeScript Academy</h4>
                                <p className="text-xs text-gray-500 mt-1">
                                    Open source learning resource for mastering TypeScript in modern frontend
                                    development
                                </p>
                                <div className="flex items-center mt-2">
                                    <div className="flex text-yellow-400 text-xs">
                                        ★★★★★
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">328 stars</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}