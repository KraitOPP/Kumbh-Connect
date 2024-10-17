import { useEffect, useState } from "react";
import { useGetItemByIdMutation } from "@/slices/itemSlice";
import { Loader, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import 'react-photo-view/dist/react-photo-view.css';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import MapComponent from "@/components/map";
import { AspectRatio } from "@/components/ui/aspect-ratio"


export default function ItemPage() {
    const [getItemById, { isLoading }] = useGetItemByIdMutation();
    const [item, setItem] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

    const { itemId } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await getItemById(itemId).unwrap();
                if (res.success) {
                    setItem(res.item);
                } else {
                    toast({
                        title: "Failed to Load Item",
                        description: res.message,
                        variant: "destructive",
                    });
                }
            } catch (error) {
                toast({
                    title: "Failed to Load Item",
                    description: error?.data?.message || "An unexpected error occurred.",
                    variant: "destructive",
                });
            }
        };

        fetchItem();
    }, [itemId, getItemById]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center">
                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
        );
    }

    if (!item) {
        return <p>Item not found.</p>;
    }

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setImageLoading(true);
    };

    return (
        <div className="m-5 flex justify-center items-center flex-col gap-5">
            <PhotoProvider>
                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-6">
                    <div className="grid gap-3 items-start">
                        <div className="grid gap-3 items-start">
                            <div className="flex gap-4 items-start">
                                {item.images.map((image, index) => (
                                    <button
                                        key={index}
                                        className="border hover:border-gray-900 rounded-lg overflow-hidden transition-colors dark:hover:border-gray-50"
                                        onClick={() => handleThumbnailClick(index)}
                                    >
                                        <img
                                            src={image.url || 'https://g-uociy3gwwd9.vusercontent.net/placeholder.svg'}
                                            alt={`Item Image ${index + 1}`}
                                            width={100}
                                            height={100}
                                            className="aspect-square object-cover"
                                        />
                                        <span className="sr-only">View Image {index + 1}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="grid gap-4 md:gap-10">
                                {imageLoading && (
                                    <div className="flex justify-center items-center">
                                        <Loader className="animate-spin h-8 w-8 text-gray-500" />
                                    </div>
                                )}
                                <div className="w-full">
                                    <PhotoView src={item.images[currentImageIndex]?.url || 'https://g-uociy3gwwd9.vusercontent.net/placeholder.svg'}>
                                        <AspectRatio >
                                            <img
                                                src={item.images[currentImageIndex]?.url || 'https://g-uociy3gwwd9.vusercontent.net/placeholder.svg'}
                                                alt="Product Image"
                                                width={600}
                                                height={600}
                                                className={`aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800 ${imageLoading ? 'hidden' : ''}`}
                                                onLoad={() => setImageLoading(false)}
                                                onError={() => setImageLoading(false)}
                                            />
                                        </AspectRatio>

                                    </PhotoView>
                                </div>
                            </div>
                        </div>
                        <h1 className="font-bold text-3xl lg:text-4xl">{item.name}</h1>
                        <div className="text-3xl ml-auto">
                            {item.category.name || 'Category Not Available'}
                        </div>
                        <h2 className="text-xl">Item Status : <b>{item.status.toUpperCase()}</b></h2>

                    </div>
                    <div className="grid gap-4 md:gap-10 items-start">
                        <Tabs defaultValue="description" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="description">Description</TabsTrigger>
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="status">Status</TabsTrigger>
                            </TabsList>
                            <TabsContent value="description">
                                <p className="text-gray-500 dark:text-gray-400">{item.description}</p>
                            </TabsContent>
                            <TabsContent value="details">
                                <ul className="text-gray-500 dark:text-gray-400">
                                    <li><strong>Reported by:</strong> {item.reportedBy?.firstName} {item.reportedBy?.lastName}</li>
                                    <li><strong>Date Reported:</strong> {new Date(item.dateReported).toLocaleDateString()}</li>
                                    <li><strong>Category:</strong> {item.category.name}</li>
                                </ul>
                            </TabsContent>
                            <TabsContent value="status">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Status: {item.status === 'lost' ? 'Lost' : 'Found'}
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Returned to Owner: {item.returnedToOwner ? 'Yes' : 'No'}
                                </p>
                                <div className="w-full h-64 md:h-96">
                                    <MapComponent latitude={item.location.latitude} longitude={item.location.longitude} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                </div>
            </PhotoProvider>
        </div>
    );
}
