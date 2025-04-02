import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Home,
    Compass,
    Bell,
    MessageCircle,
    Bookmark,
    User,
    Users,
    MoreHorizontal,
} from "lucide-react";
import {useRouter} from "@tanstack/react-router";

type SidebarProps = {
    onCreatePost?: () => void;
    unreadNotifications?: number;
};

export const Sidebar = ({ onCreatePost, unreadNotifications = 0 }: SidebarProps) => {
    const router = useRouter();

    const isActive = (path: string) => {
        return router.state.location.pathname === path;
    };

    const navItems = [
        { icon: Home, label: "Home", path: "/feed", badge: 0 },
        { icon: Compass, label: "Explore", path: "/explore", badge: 0 },
        { icon: Bell, label: "Notifications", path: "/profile/notifications", badge: unreadNotifications },
        { icon: MessageCircle, label: "Messages", path: "/messages", badge: 0 },
        { icon: Bookmark, label: "Bookmarks", path: "/bookmarks", badge: 0 },
        { icon: User, label: "Profile", path: "/profile", badge: 0 },
    ];

    return (
        <div className="w-64 border-r flex flex-col h-full">
            <div className="p-4 border-b flex items-center space-x-2">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <Users className="h-5 w-5" />
                </div>
                <span className="font-semibold">DevConnect</span>
            </div>

            <nav className="mt-4 flex-1 px-3">
                {navItems.map((item) => (
                    <div
                        key={item.path}
                        className={`px-3 py-2 flex items-center text-sm font-medium rounded-md cursor-pointer ${
                            isActive(item.path) ? 'bg-gray-100' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => router.navigate({ to: item.path })}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.label}</span>
                        {item && item?.badge > 0 && (
                            <span className="ml-auto bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {item.badge}
              </span>
                        )}
                    </div>
                ))}

                <div className="mt-6">
                    <Button
                        className="w-full bg-blue-500 hover:bg-blue-600"
                        onClick={onCreatePost}
                    >
                        Create Post
                    </Button>
                </div>
            </nav>

            <div className="mt-auto p-4 border-t">
                <div className="flex items-center space-x-3">
                    <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-500">
                            ME
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">Mike Edwards</p>
                        <p className="text-xs text-gray-500">@mike_dev</p>
                    </div>
                    <MoreHorizontal className="h-4 w-4 ml-auto text-gray-500" />
                </div>
            </div>
        </div>
    );
};