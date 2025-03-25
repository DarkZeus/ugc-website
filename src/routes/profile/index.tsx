import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
    GridIcon,
    PlayCircleIcon,
    ImageIcon,
    UserIcon,
    CameraIcon,
    BookmarkIcon,
    MessageCircleIcon,
    Share2Icon,
    ListIcon,
    CalendarIcon
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/profile/')({
    component: ProfilePage,
})

// Types
type MediaType = "image" | "video";

type MediaItem = {
    id: string;
    type: MediaType;
    url: string;
    thumbnail?: string;
    title: string;
    description?: string;
    likes: number;
    comments: number;
    createdAt: string;
};

type ProfileData = {
    id: string;
    username: string;
    name: string;
    avatar: string;
    bio: string;
    location: string;
    specialties: string[];
    followers: number;
    following: number;
    mediaCount: number;
    media: MediaItem[];
};

// Mock API function
const fetchProfileData = async (): Promise<ProfileData> => {
    // In a real app, this would be an API call
    return {
        id: "user123",
        username: "empusaau",
        name: "Empusa",
        avatar: "/avatar.jpg",
        bio: "Professional photographer and videographer specializing in documentary and street photography. Available for collaborations and projects.",
        location: "New York, NY",
        specialties: ["Photography", "Videography", "Documentary", "Street"],
        followers: 2547,
        following: 348,
        mediaCount: 142,
        media: Array(20).fill(null).map((_, i) => ({
            id: `media-${i}`,
            type: i % 3 === 0 ? "video" : "image",
            url: `https://picsum.photos/seed/${i}/275/275`,
            thumbnail: i % 3 === 0 ? `https://picsum.photos/seed/${i}/275/275` : undefined,
            title: `Project ${i + 1}`,
            description: i % 2 === 0 ? "A creative project exploring urban landscapes and human interaction." : undefined,
            likes: Math.floor(Math.random() * 200) + 50,
            comments: Math.floor(Math.random() * 30) + 5,
            createdAt: new Date(Date.now() - (i * 86400000)).toISOString(),
        })),
    };
};

// Components
function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"grid" | "photos" | "videos">("grid");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const { data: profile, isLoading, error } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfileData,
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading profile...</div>;
    }

    if (error || !profile) {
        return <div className="flex items-center justify-center h-screen">Error loading profile data</div>;
    }

    const filteredMedia = activeTab === "grid"
        ? profile.media
        : profile.media.filter(item =>
            activeTab === "photos" ? item.type === "image" : item.type === "video"
        );

    return (
        <div className="container mx-auto py-6 max-w-4xl">
            <ProfileHeader profile={profile} />
            <Separator className="my-6" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <ProfileTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    photoCount={profile.media.filter(m => m.type === "image").length}
                    videoCount={profile.media.filter(m => m.type === "video").length}
                />
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            {viewMode === "grid" ? (
                <MediaGrid media={filteredMedia} />
            ) : (
                <MediaList media={filteredMedia} />
            )}
        </div>
    );
}

const ProfileHeader = ({ profile }: { profile: ProfileData }) => (
    <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback><UserIcon className="h-12 w-12" /></AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                    <p className="text-muted-foreground">@{profile.username}</p>
                </div>
                <div className="flex gap-2">
                    <Button>Follow</Button>
                    <Button variant="outline">Message</Button>
                </div>
            </div>

            <div className="flex gap-4 text-sm">
                <div><strong>{profile.mediaCount}</strong> posts</div>
                <div><strong>{profile.followers.toLocaleString()}</strong> followers</div>
                <div><strong>{profile.following.toLocaleString()}</strong> following</div>
            </div>

            <p className="text-sm">{profile.bio}</p>

            <div className="flex gap-2 flex-wrap">
                {profile.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary">{specialty}</Badge>
                ))}
            </div>

            <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span>📍</span> {profile.location}
            </p>
        </div>
    </div>
);

const ProfileTabs = ({
                         activeTab,
                         setActiveTab,
                         photoCount,
                         videoCount
                     }: {
    activeTab: "grid" | "photos" | "videos";
    setActiveTab: (tab: "grid" | "photos" | "videos") => void;
    photoCount: number;
    videoCount: number;
}) => (
    <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3">
            <TabsTrigger value="grid" className="flex items-center gap-2">
                <GridIcon className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="photos" className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Photos</span>
                <span className="text-xs text-muted-foreground">({photoCount})</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
                <PlayCircleIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Videos</span>
                <span className="text-xs text-muted-foreground">({videoCount})</span>
            </TabsTrigger>
        </TabsList>
    </Tabs>
);

const ViewToggle = ({
                        viewMode,
                        setViewMode
                    }: {
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
}) => (
    <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
        <ToggleGroupItem value="grid" aria-label="Grid view">
            <GridIcon className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="list" aria-label="List view">
            <ListIcon className="h-4 w-4" />
        </ToggleGroupItem>
    </ToggleGroup>
);

const MediaGrid = ({ media }: { media: MediaItem[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map(item => (
            <MediaCard key={item.id} item={item} />
        ))}
    </div>
);

const MediaList = ({ media }: { media: MediaItem[] }) => (
    <div className="flex flex-col gap-4">
        {media.map(item => (
            <MediaListItem key={item.id} item={item} />
        ))}
    </div>
);

const MediaCard = ({ item }: { item: MediaItem }) => (
    <Card className="overflow-hidden group">
        <CardContent className="p-0 relative">
            <div className="aspect-square relative overflow-hidden">
                <img
                    src={item.thumbnail || item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {item.type === "video" && (
                    <div className="absolute top-2 right-2">
                        <PlayCircleIcon className="h-6 w-6 text-white drop-shadow-md" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity text-white">
                        <h3 className="font-medium text-sm truncate">{item.title}</h3>
                        <div className="flex gap-3 text-xs mt-1">
                            <span className="flex items-center gap-1">
                                <CameraIcon className="h-3 w-3" /> {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircleIcon className="h-3 w-3" /> {item.comments}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/30 text-white hover:bg-black/50 hover:text-white">
                    <BookmarkIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/30 text-white hover:bg-black/50 hover:text-white">
                    <Share2Icon className="h-4 w-4" />
                </Button>
            </div>
        </CardContent>
    </Card>
);

const MediaListItem = ({ item }: { item: MediaItem }) => (
    <Card className="overflow-hidden group">
        <CardContent className="p-3">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:w-48 h-48 shrink-0">
                    <img
                        src={item.thumbnail || item.url}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-md"
                    />
                    {item.type === "video" && (
                        <div className="absolute top-2 right-2">
                            <PlayCircleIcon className="h-6 w-6 text-white drop-shadow-md" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <BookmarkIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Share2Icon className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {item.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                    )}

                    <div className="mt-auto pt-4 flex items-center justify-between">
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <CameraIcon className="h-4 w-4" /> {item.likes}
                            </span>
                            <span className="flex items-center gap-1">
                                <MessageCircleIcon className="h-4 w-4" /> {item.comments}
                            </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                            <CalendarIcon className="h-3 w-3 mr-1" />
                            {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);