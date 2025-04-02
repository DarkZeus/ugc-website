import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Heart,
    MessageCircle,
    Repeat2,
    Bell,
    User,
    Check,
    UserPlus,
    Star
} from "lucide-react";
import {createFileRoute} from "@tanstack/react-router";
import {Sidebar} from "@/components/Sidebar.tsx";


export const Route = createFileRoute('/profile/notifications')({
    component: NotificationsPage,
});

// Types for notifications
type NotificationType =
    | 'like'
    | 'comment'
    | 'follow'
    | 'mention'
    | 'repost'
    | 'reaction'
    | 'achievement';

type Notification = {
    id: string;
    type: NotificationType;
    isRead: boolean;
    timestamp: string;
    user: {
        id: string;
        name: string;
        username: string;
        avatarUrl?: string;
        initials: string;
        isVerified: boolean;
    };
    content?: {
        text?: string;
        postId?: string;
        postExcerpt?: string;
        achievementName?: string;
        achievementDescription?: string;
    };
    additionalUsers?: Array<{
        id: string;
        name: string;
        initials: string;
    }>;
};

// Mock data fetch function
const fetchNotifications = async (): Promise<Notification[]> => {
    // This would be an API call in a real app
    return [
        {
            id: "1",
            type: "like",
            isRead: false,
            timestamp: "2m ago",
            user: {
                id: "user1",
                name: "Sarah Chen",
                username: "sarahc",
                initials: "SC",
                isVerified: true
            },
            content: {
                postId: "post1",
                postExcerpt: "Just released my new open-source React hooks library!"
            },
            additionalUsers: [
                { id: "user2", name: "Alex Rivera", initials: "AR" },
                { id: "user3", name: "Jordan Lee", initials: "JL" }
            ]
        },
        {
            id: "2",
            type: "follow",
            isRead: false,
            timestamp: "45m ago",
            user: {
                id: "user4",
                name: "Emma Johnson",
                username: "emmaj",
                initials: "EJ",
                isVerified: false
            }
        },
        {
            id: "3",
            type: "comment",
            isRead: false,
            timestamp: "1h ago",
            user: {
                id: "user5",
                name: "Priya Sharma",
                username: "priyacode",
                initials: "PS",
                isVerified: true
            },
            content: {
                postId: "post2",
                postExcerpt: "Conference talk on 'Building Accessible Web Apps' went great today!",
                text: "Your slides were incredibly helpful! Would you mind sharing your presentation template?"
            }
        },
        {
            id: "4",
            type: "mention",
            isRead: true,
            timestamp: "3h ago",
            user: {
                id: "user6",
                name: "Kai Zhang",
                username: "kaiz",
                initials: "KZ",
                isVerified: false
            },
            content: {
                postId: "post3",
                text: "Check out @mike_dev's new article on TypeScript best practices!"
            }
        },
        {
            id: "5",
            type: "repost",
            isRead: true,
            timestamp: "5h ago",
            user: {
                id: "user7",
                name: "Marco Dev",
                username: "marco_dev",
                initials: "MD",
                isVerified: false
            },
            content: {
                postId: "post4",
                postExcerpt: "TypeScript tip of the day: Use discriminated unions for more precise type checking"
            }
        },
        {
            id: "6",
            type: "achievement",
            isRead: true,
            timestamp: "1d ago",
            user: {
                id: "user8",
                name: "DevConnect",
                username: "devconnect",
                initials: "DC",
                isVerified: true
            },
            content: {
                achievementName: "Popular Post",
                achievementDescription: "Your post reached 1,000+ views!"
            }
        },
        {
            id: "7",
            type: "reaction",
            isRead: true,
            timestamp: "2d ago",
            user: {
                id: "user9",
                name: "TypeScript Fan",
                username: "ts_dev",
                initials: "TF",
                isVerified: false
            },
            content: {
                postId: "post5",
                postExcerpt: "Current tech stack for our latest project"
            }
        }
    ];
};

// Get notification icon based on type
const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case 'like':
            return <Heart className="h-4 w-4 text-red-500" />;
        case 'comment':
            return <MessageCircle className="h-4 w-4 text-blue-500" />;
        case 'follow':
            return <UserPlus className="h-4 w-4 text-green-500" />;
        case 'mention':
            return <User className="h-4 w-4 text-purple-500" />;
        case 'repost':
            return <Repeat2 className="h-4 w-4 text-green-500" />;
        case 'reaction':
            return <Star className="h-4 w-4 text-yellow-500" />;
        case 'achievement':
            return <Star className="h-4 w-4 text-yellow-500" />;
        default:
            return <Bell className="h-4 w-4 text-gray-500" />;
    }
};

// Render notification content
const renderNotificationContent = (notification: Notification) => {
    const { type, user, content, additionalUsers } = notification;

    switch (type) {
        case 'like':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    {additionalUsers && additionalUsers.length > 0 ? (
                        <>
                            <span> and </span>
                            <span className="font-semibold">
                {additionalUsers.length === 1 ?
                    additionalUsers[0].name :
                    `${additionalUsers.length} others`}
              </span>
                        </>
                    ) : null}
                    <span> liked your post</span>
                    {content?.postExcerpt && (
                        <p className="text-gray-500 mt-1 text-sm line-clamp-1">
                            "{content.postExcerpt}"
                        </p>
                    )}
                </div>
            );

        case 'follow':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> followed you</span>
                </div>
            );

        case 'comment':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> commented on your post</span>
                    {content?.postExcerpt && (
                        <p className="text-gray-500 mt-1 text-sm line-clamp-1">
                            "{content.postExcerpt}"
                        </p>
                    )}
                    {content?.text && (
                        <p className="bg-gray-50 p-2 rounded-md mt-2 text-sm">
                            {content.text}
                        </p>
                    )}
                </div>
            );

        case 'mention':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> mentioned you in a post</span>
                    {content?.text && (
                        <p className="bg-gray-50 p-2 rounded-md mt-2 text-sm">
                            {content.text}
                        </p>
                    )}
                </div>
            );

        case 'repost':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> reposted your post</span>
                    {content?.postExcerpt && (
                        <p className="text-gray-500 mt-1 text-sm line-clamp-1">
                            "{content.postExcerpt}"
                        </p>
                    )}
                </div>
            );

        case 'achievement':
            return (
                <div>
                    <span className="font-semibold">Achievement unlocked: {content?.achievementName}</span>
                    {content?.achievementDescription && (
                        <p className="text-gray-500 mt-1 text-sm">
                            {content.achievementDescription}
                        </p>
                    )}
                </div>
            );

        case 'reaction':
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> reacted to your post</span>
                    {content?.postExcerpt && (
                        <p className="text-gray-500 mt-1 text-sm line-clamp-1">
                            "{content.postExcerpt}"
                        </p>
                    )}
                </div>
            );

        default:
            return (
                <div>
                    <span className="font-semibold">{user.name}</span>
                    <span> interacted with your content</span>
                </div>
            );
    }
};

function NotificationsPage() {
    const {data: notifications = []} = useQuery({
        queryKey: ["notifications"],
        queryFn: fetchNotifications
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    // Use the getNotificationIcon function to display icons in the notification items
    const renderNotificationTypeIcon = (type: NotificationType) => {
        return (
            <div className="p-1.5 rounded-full bg-gray-100 absolute -left-1 -top-1">
                {getNotificationIcon(type)}
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Left Sidebar */}
            <Sidebar unreadNotifications={unreadCount} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <div className="border-b p-4 flex items-center justify-between">
                    <h1 className="text-xl font-bold">Notifications</h1>
                    <Button variant="ghost" size="sm" className="text-blue-500">
                        <Check className="h-4 w-4 mr-2"/>
                        Mark all as read
                    </Button>
                </div>

                <Tabs defaultValue="all" className="flex-1">
                    <div className="border-b">
                        <TabsList className="p-0 bg-transparent">
                            <TabsTrigger
                                value="all"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3"
                            >
                                All
                            </TabsTrigger>
                            <TabsTrigger
                                value="mentions"
                                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 py-3"
                            >
                                Mentions
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="all" className="p-0 m-0">
                        <ScrollArea className="h-[calc(100vh-130px)]">
                            <div className="divide-y">
                                {notifications.map((notification) => (
                                    <Card
                                        key={notification.id}
                                        className={`rounded-none border-x-0 border-t-0 last:border-b-0 ${
                                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                                        }`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex space-x-3">
                                                <div className="relative">
                                                    <div className="relative">
                                                        <Avatar>
                                                            {notification.user.avatarUrl ? (
                                                                <AvatarImage src={notification.user.avatarUrl}
                                                                             alt={notification.user.name}/>
                                                            ) : (
                                                                <AvatarFallback
                                                                    className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                                                    {notification.user.initials}
                                                                </AvatarFallback>
                                                            )}
                                                        </Avatar>
                                                        {renderNotificationTypeIcon(notification.type)}
                                                    </div>
                                                    {renderNotificationTypeIcon(notification.type)}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="flex items-start">
                                                        <div className="flex-1 min-w-0">
                                                            {renderNotificationContent(notification)}
                                                        </div>

                                                        <div className="flex items-center ml-4">
                                                            <span
                                                                className="text-xs text-gray-500">{notification.timestamp}</span>
                                                            {!notification.isRead && (
                                                                <div
                                                                    className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {notification.type === 'like' && notification.additionalUsers && notification.additionalUsers.length > 0 && (
                                                <div className="mt-2 ml-12">
                                                    <div className="flex -space-x-2">
                                                        <Avatar className="border-2 border-white h-6 w-6">
                                                            <AvatarFallback
                                                                className="text-xs bg-gradient-to-br from-red-400 to-pink-500 text-white">
                                                                {notification.additionalUsers[0].initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        {notification.additionalUsers.length > 1 && (
                                                            <Avatar className="border-2 border-white h-6 w-6">
                                                                <AvatarFallback
                                                                    className="text-xs bg-gradient-to-br from-green-400 to-blue-500 text-white">
                                                                    {notification.additionalUsers[1].initials}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        )}
                                                        {notification.additionalUsers.length > 2 && (
                                                            <div
                                                                className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                                                                +{notification.additionalUsers.length - 2}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {notification.type === 'follow' && (
                                                <div className="mt-2 ml-12">
                                                    <Button variant="outline" size="sm">
                                                        Follow back
                                                    </Button>
                                                </div>
                                            )}

                                            {notification.type === 'achievement' && (
                                                <div className="mt-2 ml-12">
                                                    <Badge
                                                        className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                                                        <Star className="h-3 w-3 mr-1 text-yellow-500"/>
                                                        {notification.content?.achievementName}
                                                    </Badge>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="mentions" className="p-0 m-0">
                        <ScrollArea className="h-[calc(100vh-130px)]">
                            <div className="divide-y">
                                {notifications
                                    .filter(n => n.type === 'mention')
                                    .map((notification) => (
                                        <Card
                                            key={notification.id}
                                            className={`rounded-none border-x-0 border-t-0 last:border-b-0 ${
                                                notification.isRead ? 'bg-white' : 'bg-blue-50'
                                            }`}
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex space-x-3">
                                                    <Avatar>
                                                        {notification.user.avatarUrl ? (
                                                            <AvatarImage src={notification.user.avatarUrl}
                                                                         alt={notification.user.name}/>
                                                        ) : (
                                                            <AvatarFallback
                                                                className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                                                {notification.user.initials}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>

                                                    <div className="flex-1">
                                                        <div className="flex items-start">
                                                            <div className="flex-1 min-w-0">
                                                                {renderNotificationContent(notification)}
                                                            </div>

                                                            <div className="flex items-center ml-4">
                                                                <span
                                                                    className="text-xs text-gray-500">{notification.timestamp}</span>
                                                                {!notification.isRead && (
                                                                    <div
                                                                        className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                {notifications.filter(n => n.type === 'mention').length === 0 && (
                                    <div className="flex flex-col items-center justify-center p-12 text-center">
                                        <Bell className="h-16 w-16 text-gray-300 mb-4"/>
                                        <h3 className="text-lg font-medium">No mentions yet</h3>
                                        <p className="text-gray-500 mt-1">
                                            When someone mentions you in a post, you'll see it here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l p-4 hidden lg:block">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-bold text-lg mb-3">Notification settings</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Email notifications</span>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Push notifications</span>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">Filter preferences</span>
                            <Button variant="outline" size="sm">Configure</Button>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Pro Tip</h3>
                    <p className="text-sm text-gray-700">
                        Customize which notifications you receive by updating your notification preferences in the
                        settings panel.
                    </p>
                    <Button variant="link" className="text-blue-500 p-0 h-auto mt-2 text-sm">
                        Learn more
                    </Button>
                </div>
            </div>
        </div>
    );
}
