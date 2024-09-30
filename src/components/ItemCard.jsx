import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ItemCard({ item }) {
  return (
    <Card className="w-full max-w-xs md:max-w-sm lg:max-w-md rounded-lg overflow-hidden shadow-lg">
      <div className="w-full h-48 md:h-56 lg:h-64">
        <Link to={`/item/${item._id}`}>
          <img
            src={item?.images[0]?.url}
            alt="Card Image"
            className="w-full h-full object-cover"
            style={{
              objectFit: 'cover',
              aspectRatio: '16/9',
            }}
          />
        </Link>
      </div>
      <CardContent className="p-4 md:p-6 space-y-4 min-h-48 flex flex-col justify-between">
        <div>
          <CardTitle className="text-lg md:text-xl font-bold">{item.name}</CardTitle>
          <CardDescription className="text-gray-500">
            {item.description.length > 100 ? `${item.description.slice(0, 100)}...` : item.description}
          </CardDescription>
        </div>
        <div className="flex justify-between items-center">
          <Link to={`/item/${item._id}`}>
            <Button>Learn More</Button>
          </Link>
          <div className="text-gray-500 text-sm flex items-center">
            <Calendar className="mr-1" />
            {new Date(item.dateReported).toDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
