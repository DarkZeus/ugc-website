import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Bookmark, User, Hash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type QuickResult = {
    id: string;
    type: 'user' | 'tag' | 'post';
    title: string;
    subtitle?: string;
    image?: string;
};

export const SearchModal = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([
        'photography', 'design', 'illustration'
    ]);

    // Mock quick results based on query
    const quickResults: QuickResult[] = query ? [
        {
            id: '1',
            type: 'user',
            title: `${query}_creator`,
            subtitle: 'Alex Morgan',
            image: 'https://picsum.photos/seed/user1/40/40'
        },
        {
            id: '2',
            type: 'tag',
            title: `#${query}`,
            subtitle: '1.2k posts'
        },
        {
            id: '3',
            type: 'post',
            title: `Latest ${query} work`,
            subtitle: 'by CreativeStudios',
            image: 'https://picsum.photos/seed/post1/40/40'
        }
    ] : [];

    // Focus input when modal opens
    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    // Reset state when modal closes
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setQuery('');
        }
    };

    // Handle search submission
    const handleSearch = () => {
        if (query.trim()) {
            // Add to recent searches
            if (!recentSearches.includes(query)) {
                setRecentSearches(prev => [query, ...prev].slice(0, 5));
            }

            // In a real app, you'd navigate to search results
            console.log('Searching for:', query);
            setOpen(false);
        }
    };

    // Icon for result type
    const getIcon = (type: 'user' | 'tag' | 'post') => {
        switch (type) {
            case 'user': return <User className="h-4 w-4 text-blue-500" />;
            case 'tag': return <Hash className="h-4 w-4 text-purple-500" />;
            case 'post': return <Bookmark className="h-4 w-4 text-amber-500" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    aria-label="Search"
                >
                    <Search className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0">
                <div className="flex items-center border-b p-4">
                    <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
                    <Input
                        ref={inputRef}
                        className="flex-1 border-0 shadow-none focus-visible:ring-0 p-0"
                        placeholder="Search people, posts, tags..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {query && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7"
                            onClick={() => setQuery('')}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="p-4 max-h-[70vh] overflow-auto">
                    {query ? (
                        <>
                            {/* Quick results as user types */}
                            {quickResults.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Quick Results</h3>
                                    <div className="space-y-2">
                                        {quickResults.map(result => (
                                            <div
                                                key={result.id}
                                                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                                                onClick={() => {
                                                    console.log(`Navigating to ${result.type}: ${result.title}`);
                                                    setOpen(false);
                                                }}
                                            >
                                                {result.image ? (
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={result.image} alt={result.title} />
                                                        <AvatarFallback>{result.title[0]}</AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                        {getIcon(result.type)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm truncate">{result.title}</p>
                                                    {result.subtitle && (
                                                        <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <Button
                                            variant="outline"
                                            className="text-sm"
                                            onClick={handleSearch}
                                        >
                                            View all results
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Recent searches */}
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-sm font-medium">Recent Searches</h3>
                                        {recentSearches.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 text-xs"
                                                onClick={() => setRecentSearches([])}
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {recentSearches.map((search, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="cursor-pointer"
                                                onClick={() => setQuery(search)}
                                            >
                                                {search}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};