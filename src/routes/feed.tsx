import {createFileRoute} from "@tanstack/react-router";
import {FeedPage} from "@/pages/feed/feed-page.tsx";

export const Route = createFileRoute('/feed')({
    component: FeedPage,
});

