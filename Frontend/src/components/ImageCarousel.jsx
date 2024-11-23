import React from 'react';
import { motion } from 'framer-motion';
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from "./ui/card";

export const ImageCarousel = ({ images }) => {
    const plugin = React.useRef(
      Autoplay({ 
        delay: 3000, 
        stopOnInteraction: true,
        loop: true 
      })
    );
  
    return (
      <Card className="w-full max-w-5xl mx-auto p-4 bg-white/80 backdrop-blur-sm">
        <Carousel 
          className="w-full"
          plugins={[plugin.current]}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {images.map((image, index) => (
              <CarouselItem 
                key={index} 
                className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
              >
                <motion.div
                  className="relative h-72 overflow-hidden rounded-xl"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={image}
                    alt={`Mahakumbh Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-sm font-medium">Mahakumbh 2025</p>
                      <p className="text-xs opacity-80">Image {index + 1}</p>
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute -left-12 top-1/2 -translate-y-1/2">
            <CarouselPrevious className="h-12 w-12 border-2 border-primary/50 bg-white/80 hover:bg-white" />
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2">
            <CarouselNext className="h-12 w-12 border-2 border-primary/50 bg-white/80 hover:bg-white" />
          </div>
        </Carousel>
      </Card>
    );
  };