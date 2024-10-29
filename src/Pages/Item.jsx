import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader, Loader2, MapPin, User, Calendar, Tag, Check, X } from "lucide-react";
import { PhotoProvider, PhotoView } from 'react-photo-view';
import {  useGetItemByIdQuery } from "@/slices/itemSlice";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import MapComponent from "@/components/map";
import 'react-photo-view/dist/react-photo-view.css';

const ImageGallery = ({ images, currentIndex, onImageSelect, imageLoading, setImageLoading }) => (
  <div className="grid gap-4">
    <div className="flex gap-2 overflow-x-auto pb-2">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={`flex-shrink-0 transition-all duration-200 ${
            currentIndex === index 
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'hover:opacity-80'
          }`}
        >
          <img
            src={image.url || '/api/placeholder/100/100'}
            alt={`Thumbnail ${index + 1}`}
            className="h-16 w-16 rounded-lg object-cover"
          />
        </button>
      ))}
    </div>

    <div className="relative rounded-lg overflow-hidden bg-gray-100">
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      )}
      <PhotoView src={images[currentIndex]?.url || '/api/placeholder/600/600'}>
        <AspectRatio ratio={1}>
          <img
            src={images[currentIndex]?.url || '/api/placeholder/600/600'}
            alt="Main product view"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
          />
        </AspectRatio>
      </PhotoView>
    </div>
  </div>
);

const ItemStatus = ({ status, returnedToOwner }) => (
  <div className="flex gap-2 items-center">
    <Badge variant={status === 'lost' ? 'destructive' : 'success'} className="text-sm">
      {status.toUpperCase()}
    </Badge>
    {returnedToOwner ? (
      <Badge variant="outline" className="gap-1">
        <Check className="w-3 h-3" /> Returned to Owner
      </Badge>
    ) : (
      <Badge variant="outline" className="gap-1">
        <X className="w-3 h-3" /> Not Yet Returned
      </Badge>
    )}
  </div>
);

const ItemPage = () => {
    const { itemId } = useParams();
    const { data, isLoading, error, refetchItem } = useGetItemByIdQuery(itemId);
    const item = data?.item || [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to Load Item",
        description: error?.data?.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!item) {
    return (
      <Card className="m-8">
        <CardContent className="p-8 text-center text-gray-500">
          Item not found or has been removed.
        </CardContent>
      </Card>
    );
  }

  return (
    <PhotoProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <ImageGallery
            images={item.images}
            currentIndex={currentImageIndex}
            onImageSelect={(index) => {
              setCurrentImageIndex(index);
              setImageLoading(true);
            }}
            imageLoading={imageLoading}
            setImageLoading={setImageLoading}
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{item.name}</h1>
              <ItemStatus status={item.status} returnedToOwner={item.returnedToOwner} />
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4">
                <Link
                  to={`/category/${item.category._id}`}
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Tag className="h-4 w-4" />
                  {item.category.name}
                </Link>
                <p className="text-gray-600">{item.description}</p>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Reported by: {item.reportedBy?.firstName} {item.reportedBy?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Date Reported: {new Date(item.dateReported).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span>Category: {item.category.name}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Last Known Location</span>
                </div>
                <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200">
                  <MapComponent
                    latitude={item.location.latitude}
                    longitude={item.location.longitude}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PhotoProvider>
  );
};

export default ItemPage;