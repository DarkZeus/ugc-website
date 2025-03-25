import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, subDays } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Sparkles,
    TrendingUp,
    Eye,
    MessageCircle,
    ThumbsUp,
    Share2,
    BarChart3,
    LineChart as LineChartIcon,
    Users,
    Rocket,
    Calendar,
    Clock,
    ArrowUpRight,
    Star,
    AlertCircle,
    Save,
} from "lucide-react";

export const Route = createFileRoute('/profile/dashboard')({
    component: DashboardPage,
});

// Types
type PostAnalytics = {
    id: string;
    title: string;
    type: "image" | "video";
    thumbnail: string;
    createdAt: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagementRate: number;
    trending: boolean;
};

type DailyMetric = {
    date: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
};

type SourceMetric = {
    name: string;
    value: number;
    color: string;
};

type DashboardData = {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalPosts: number;
    totalFollowers: number;
    followerGrowth: number;
    averageEngagementRate: number;
    viewsGrowth: number;
    topPerformingPost: PostAnalytics;
    recentPosts: PostAnalytics[];
    dailyMetrics: DailyMetric[];
    trafficSources: SourceMetric[];
    audienceAge: SourceMetric[];
    recommendedActions: string[];
};

// Mock API function
const fetchDashboardData = async (): Promise<DashboardData> => {
    // In a real app, this would be an API call
    // Generate some data for the past 14 days
    const dailyMetrics = Array(14)
        .fill(null)
        .map((_, i) => {
            const date = subDays(new Date(), 13 - i);
            const dateStr = format(date, "MMM dd");
            const viewBase = 500 + Math.floor(Math.random() * 1000);

            return {
                date: dateStr,
                views: viewBase,
                likes: Math.floor(viewBase * (0.1 + Math.random() * 0.15)),
                comments: Math.floor(viewBase * (0.02 + Math.random() * 0.05)),
                shares: Math.floor(viewBase * (0.01 + Math.random() * 0.03)),
            };
        });

    // Calculate totals
    const totalViews = dailyMetrics.reduce((sum, day) => sum + day.views, 0);
    const totalLikes = dailyMetrics.reduce((sum, day) => sum + day.likes, 0);
    const totalComments = dailyMetrics.reduce((sum, day) => sum + day.comments, 0);
    const totalShares = dailyMetrics.reduce((sum, day) => sum + day.shares, 0);

    // Generate posts with analytics
    const generatePost = (id: number, trending = false): PostAnalytics => {
        const views = 500 + Math.floor(Math.random() * 4500);
        const likes = Math.floor(views * (0.1 + Math.random() * 0.2));
        const comments = Math.floor(views * (0.02 + Math.random() * 0.06));
        const shares = Math.floor(views * (0.01 + Math.random() * 0.04));
        const saves = Math.floor(views * (0.005 + Math.random() * 0.03));
        const engagementRate = Math.round(((likes + comments + shares + saves) / views) * 1000) / 10;

        const daysAgo = Math.floor(Math.random() * 30);
        const createdAt = format(subDays(new Date(), daysAgo), "yyyy-MM-dd");

        return {
            id: `post-${id}`,
            title: `Project ${id}`,
            type: Math.random() > 0.3 ? "image" : "video",
            thumbnail: `https://picsum.photos/seed/${id}/200/200`,
            createdAt,
            views,
            likes,
            comments,
            shares,
            saves,
            engagementRate,
            trending,
        };
    };

    const recentPosts = Array(10)
        .fill(null)
        .map((_, i) => generatePost(i + 1, i === 0));

    // Sort by views to get top performing
    const sortedPosts = [...recentPosts].sort((a, b) => b.views - a.views);
    const topPerformingPost = sortedPosts[0];

    // Generate traffic sources data
    const trafficSources = [
        { name: "Discover", value: 45, color: "#8884d8" },
        { name: "Search", value: 25, color: "#82ca9d" },
        { name: "Profile", value: 15, color: "#ffc658" },
        { name: "Direct", value: 10, color: "#ff8042" },
        { name: "External", value: 5, color: "#0088fe" },
    ];

    // Generate audience age data
    const audienceAge = [
        { name: "18-24", value: 35, color: "#8884d8" },
        { name: "25-34", value: 40, color: "#82ca9d" },
        { name: "35-44", value: 15, color: "#ffc658" },
        { name: "45+", value: 10, color: "#ff8042" },
    ];

    return {
        totalViews,
        totalLikes,
        totalComments,
        totalShares,
        totalPosts: recentPosts.length,
        totalFollowers: 2547 + Math.floor(Math.random() * 100),
        followerGrowth: 5 + Math.floor(Math.random() * 10),
        averageEngagementRate: Math.round(
            recentPosts.reduce((sum, post) => sum + post.engagementRate, 0) / recentPosts.length * 10
        ) / 10,
        viewsGrowth: 12 + Math.floor(Math.random() * 18),
        topPerformingPost,
        recentPosts,
        dailyMetrics,
        trafficSources,
        audienceAge,
        recommendedActions: [
            "Post more frequently during peak hours (5-7 PM)",
            "Engage with comments within first hour of posting",
            "Try carousel posts for higher engagement",
            "Collaborate with creators in similar niche",
        ],
    };
};

function DashboardPage() {
    const [timeRange, setTimeRange] = useState<string>("14days");
    const [chartType, setChartType] = useState<string>("bar");

    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardData", timeRange],
        queryFn: fetchDashboardData,
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
    }

    if (error || !data) {
        return <div className="flex items-center justify-center h-screen">Error loading dashboard data</div>;
    }

    return (
        <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Content Dashboard</h1>
                    <p className="text-muted-foreground">Track and analyze your content performance</p>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Time Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="14days">Last 14 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">Export Data</Button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Views</p>
                                <h3 className="text-2xl font-bold">{data.totalViews.toLocaleString()}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Eye className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500 font-medium">{data.viewsGrowth}%</span>
                            <span className="text-muted-foreground ml-1">vs. previous period</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Engagement Rate</p>
                                <h3 className="text-2xl font-bold">{data.averageEngagementRate}%</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                            <span className="text-muted-foreground">Avg. across {data.totalPosts} posts</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Followers</p>
                                <h3 className="text-2xl font-bold">{data.totalFollowers.toLocaleString()}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Users className="h-5 w-5 text-green-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm">
                            <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                            <span className="text-green-500 font-medium">{data.followerGrowth}%</span>
                            <span className="text-muted-foreground ml-1">growth rate</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm">Total Interactions</p>
                                <h3 className="text-2xl font-bold">{(data.totalLikes + data.totalComments + data.totalShares).toLocaleString()}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                                <ThumbsUp className="h-5 w-5 text-amber-600" />
                            </div>
                        </div>
                        <div className="flex items-center mt-4 text-sm gap-2">
                            <div className="flex items-center">
                                <ThumbsUp className="h-3 w-3 mr-1" />
                                <span>{data.totalLikes.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                                <MessageCircle className="h-3 w-3 mr-1" />
                                <span>{data.totalComments.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center">
                                <Share2 className="h-3 w-3 mr-1" />
                                <span>{data.totalShares.toLocaleString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Performance Over Time */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle>Performance Over Time</CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={chartType === "bar" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setChartType("bar")}
                                >
                                    <BarChart3 className="h-4 w-4 mr-1" />
                                    Bar
                                </Button>
                                <Button
                                    variant={chartType === "line" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setChartType("line")}
                                >
                                    <LineChartIcon className="h-4 w-4 mr-1" />
                                    Line
                                </Button>
                            </div>
                        </div>
                        <CardDescription>View metrics over the selected time period</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === "bar" ? (
                                    <BarChart data={data.dailyMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="views" fill="#8884d8" name="Views" />
                                        <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                                        <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                                    </BarChart>
                                ) : (
                                    <LineChart data={data.dailyMetrics}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="views" stroke="#8884d8" name="Views" />
                                        <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
                                        <Line type="monotone" dataKey="comments" stroke="#ffc658" name="Comments" />
                                    </LineChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Audience Insights */}
                <Card>
                    <CardHeader>
                        <CardTitle>Audience Insights</CardTitle>
                        <CardDescription>Understand your audience better</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="sources">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
                                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                            </TabsList>

                            <TabsContent value="sources" className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.trafficSources}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.trafficSources.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </TabsContent>

                            <TabsContent value="demographics" className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.audienceAge}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data.audienceAge.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Top Performing Post */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Post</CardTitle>
                        <CardDescription>Your most successful content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="relative aspect-square rounded-md overflow-hidden">
                                <img
                                    src={data.topPerformingPost.thumbnail}
                                    alt={data.topPerformingPost.title}
                                    className="w-full h-full object-cover"
                                />
                                {data.topPerformingPost.type === "video" && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="white"
                                                className="w-6 h-6"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2">
                                    <Badge className="bg-amber-500 hover:bg-amber-600">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Top Post
                                    </Badge>
                                </div>
                            </div>

                            <h3 className="font-medium text-lg">{data.topPerformingPost.title}</h3>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.views.toLocaleString()} views</span>
                                    </div>
                                    <div className="flex items-center">
                                        <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.likes.toLocaleString()} likes</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Save className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.saves.toLocaleString()} saves</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center">
                                        <MessageCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.comments.toLocaleString()} comments</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Share2 className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.shares.toLocaleString()} shares</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Star className="h-4 w-4 mr-1 text-muted-foreground" />
                                        <span>{data.topPerformingPost.engagementRate}% engagement</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>Posted on {format(new Date(data.topPerformingPost.createdAt), "MMMM d, yyyy")}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Posts Performance */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Posts Performance</CardTitle>
                        <CardDescription>Overview of your latest content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[385px] pr-4">
                            <div className="space-y-4">
                                {data.recentPosts.map((post) => (
                                    <div key={post.id} className="flex items-start gap-3 pb-4 border-b">
                                        <div className="relative h-16 w-16 rounded overflow-hidden shrink-0">
                                            <img
                                                src={post.thumbnail}
                                                alt={post.title}
                                                className="h-full w-full object-cover"
                                            />
                                            {post.trending && (
                                                <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 flex items-center justify-center">
                                                    <Rocket className="h-3 w-3 text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-medium text-sm truncate">{post.title}</h4>
                                                <div className="flex items-center text-xs text-muted-foreground shrink-0">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{format(new Date(post.createdAt), "MMM d")}</span>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                                                <div className="flex items-center">
                                                    <Eye className="h-3 w-3 mr-1 text-muted-foreground" />
                                                    <span>{post.views.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <ThumbsUp className="h-3 w-3 mr-1 text-muted-foreground" />
                                                    <span>{post.likes.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MessageCircle className="h-3 w-3 mr-1 text-muted-foreground" />
                                                    <span>{post.comments.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Star className="h-3 w-3 mr-1 text-muted-foreground" />
                                                    <span>{post.engagementRate}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            {/* Recommendations Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Sparkles className="mr-2 h-5 w-5 text-amber-500" />
                        Recommendations to Improve Engagement
                    </CardTitle>
                    <CardDescription>Actionable insights based on your content performance</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.recommendedActions.map((action, i) => (
                            <div key={i} className="flex gap-3 items-start">
                                <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <AlertCircle className="h-4 w-4 text-blue-600" />
                                </div>
                                <p>{action}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}