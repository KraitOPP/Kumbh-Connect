import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

const getStatusColor = (status) => {
  switch (status) {
    case 'lost': return 'bg-red-100 text-red-800';
    case 'found': return 'bg-yellow-100 text-yellow-800';
    case 'returned': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ItemCard = ({ item }) => {
  if (!item) return null;

  const statusColor = getStatusColor(item.status);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={item?.images?.[0]?.url || '/api/placeholder/400/300'}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="absolute top-4 right-4 space-x-2 flex">
          {item.status && (
            <div className={`${statusColor} px-3 py-1 rounded-full shadow-sm flex items-center space-x-1 text-sm`}>
              <Tag className="w-4 h-4" />
              <span className="capitalize">{item.status}</span>
            </div>
          )}

          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(item.dateReported).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 flex flex-col flex-1">
        <div className="space-y-2 flex-1">
          <CardTitle className="text-xl font-semibold tracking-tight">
            {item.name}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 line-clamp-2">
            {item.description}
          </CardDescription>
        </div>

        <div className="pt-6">
          <Button 
            className="w-full group/button" 
            variant="outline"
            onClick={() => window.location.href = `/item/${item._id}`}
          >
            <span className="mr-2">View Details</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;