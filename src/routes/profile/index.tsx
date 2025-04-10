import { createFileRoute } from "@tanstack/react-router";
import {UserProfilePage} from "@/pages/user/profile-page.tsx";

export const Route = createFileRoute('/profile/')({
    component: UserProfilePage,
})

