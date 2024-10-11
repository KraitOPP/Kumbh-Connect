import React from 'react'
import { Card, CardContent, CardDescription, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'


export default function CategoryCard({ category }) {
  return (
    <Card className=" hover:cursor-pointer text-stone-600 hover:shadow-2xl hover:text-black hover:bg-slate-100 flex flex-col justify-center items-center max-w-xs md:max-w-sm lg:max-w-md rounded-lg overflow-hidden shadow-lg">
      <div className="mt-2 flex justify-center items-center w-full h-20 md:h-25">
          <img
            src={category?.image}
            alt={category.name}
            className="w-12 h-12 md:h-20 object-cover"
            style={{
              objectFit: 'contain',
              aspectRatio: '16/9',
            }}
          />
      </div>
      <CardContent className="p-4 md:p-4  space-y-1  flex flex-col justify-between">
        <div>
          <CardTitle className="text-lg md:text-xl font-bold">{category.name}</CardTitle>
        </div>
      </CardContent>
    </Card>
  );
}
