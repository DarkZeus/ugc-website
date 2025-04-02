import {createFileRoute} from "@tanstack/react-router";
import {SocialFeedPage} from "@/pages/social-feed-page.tsx";

export const Route = createFileRoute('/feed')({
    component: SocialFeedPage,
});

