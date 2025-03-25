import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ImageIcon,
    PlayCircleIcon,
    UploadIcon,
    XIcon,
    Loader2Icon
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute('/profile/add')({
    component: CreatePostPage,
})

// Types
type MediaType = "image" | "video";

type CreatePostForm = {
    title: string;
    description: string;
    mediaType: MediaType;
    mediaFile: File | null;
    previewUrl: string | null;
};

// Mock API function
const createPost = async (formData: FormData): Promise<{ success: boolean; id: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                id: `post-${Date.now()}`,
            });
        }, 1500);
    });
};

function CreatePostPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<MediaType>("image");
    const [form, setForm] = useState<CreatePostForm>({
        title: "",
        description: "",
        mediaType: "image",
        mediaFile: null,
        previewUrl: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const mutation = useMutation({
        mutationFn: (formData: FormData) => createPost(formData),
        onSuccess: () => {
            navigate({ to: "/profile" });
        },
    });

    const handleTabChange = (value: string) => {
        setActiveTab(value as MediaType);
        setForm(prev => ({
            ...prev,
            mediaType: value as MediaType,
            mediaFile: null,
            previewUrl: null
        }));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            // Validate file type
            const isImage = file.type.startsWith('image/');
            const isVideo = file.type.startsWith('video/');

            if ((form.mediaType === "image" && !isImage) || (form.mediaType === "video" && !isVideo)) {
                setErrors(prev => ({
                    ...prev,
                    mediaFile: `Selected file is not a valid ${form.mediaType}`,
                }));
                return;
            }

            // Create preview URL
            const previewUrl = URL.createObjectURL(file);
            setForm(prev => ({ ...prev, mediaFile: file, previewUrl }));

            // Clear error if present
            if (errors.mediaFile) {
                setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.mediaFile;
                    return newErrors;
                });
            }
        }
    };

    const removeFile = () => {
        if (form.previewUrl) {
            URL.revokeObjectURL(form.previewUrl);
        }
        setForm(prev => ({ ...prev, mediaFile: null, previewUrl: null }));
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!form.mediaFile) {
            newErrors.mediaFile = `Please upload a ${form.mediaType}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("description", form.description);
        formData.append("mediaType", form.mediaType);

        if (form.mediaFile) {
            formData.append("media", form.mediaFile);
        }

        mutation.mutate(formData);
    };

    return (
        <div className="container max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Share your work</CardTitle>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        {/* Media Type Selection */}
                        <div className="space-y-2">
                            <Label>Content Type</Label>
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                                <TabsList className="grid grid-cols-2">
                                    <TabsTrigger value="image" className="flex items-center gap-2">
                                        <ImageIcon className="h-4 w-4" />
                                        <span>Photo</span>
                                    </TabsTrigger>
                                    <TabsTrigger value="video" className="flex items-center gap-2">
                                        <PlayCircleIcon className="h-4 w-4" />
                                        <span>Video</span>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <Separator />

                        {/* Media Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="media-upload">{form.mediaType === "image" ? "Upload Photo" : "Upload Video"}</Label>

                            {!form.previewUrl ? (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                                    <input
                                        type="file"
                                        id="media-upload"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept={form.mediaType === "image" ? "image/*" : "video/*"}
                                        onChange={handleFileChange}
                                    />
                                    <UploadIcon className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                    <p>
                                        <span className="font-medium">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {form.mediaType === "image"
                                            ? "SVG, PNG, JPG or GIF (max. 5MB)"
                                            : "MP4, WebM or OGG (max. 30MB)"}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative border rounded-lg overflow-hidden">
                                    {form.mediaType === "image" ? (
                                        <img
                                            src={form.previewUrl}
                                            alt="Preview"
                                            className="w-full h-60 object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={form.previewUrl}
                                            controls
                                            className="w-full h-60 object-contain bg-black"
                                        />
                                    )}
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="destructive"
                                        className="absolute top-2 right-2"
                                        onClick={removeFile}
                                    >
                                        <XIcon className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            {errors.mediaFile && (
                                <p className="text-sm font-medium text-destructive mt-1">{errors.mediaFile}</p>
                            )}
                        </div>

                        {/* Post Information */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title*</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleTextChange}
                                    placeholder="Give your post a title"
                                    className={errors.title ? "border-destructive" : ""}
                                />
                                {errors.title && (
                                    <p className="text-sm font-medium text-destructive">{errors.title}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleTextChange}
                                    placeholder="Add a description of your work (optional)"
                                    rows={4}
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t p-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate({ to: "/profile" })}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <>
                                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                                    Publishing...
                                </>
                            ) : "Publish Post"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}