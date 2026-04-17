'use client';

import { motion } from 'framer-motion';
import { useSupabaseRealtime } from '../lib/hooks/useSupabaseRealtime';
import { useMemo } from 'react';

interface BackgroundSliderProps {
  images: string[];
}

export function BackgroundSlider({ images }: BackgroundSliderProps) {
  const { students } = useSupabaseRealtime();

  const combinedImages = useMemo(() => {
    // Extract non-null photo URLs from realtime students
    const studentPhotos = students
      .map(s => s.photo_url)
      .filter((url): url is string => Boolean(url));
    
    // Combine newest students with directors, limit to ~45 so dom doesn't crash if heavily populated
    return [...studentPhotos, ...images].slice(0, 45);
  }, [students, images]);

  if (!combinedImages || combinedImages.length === 0) {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80" />
      </div>
    );
  }

  // Pre-defined pattern to mix squares, vertical rectangles, and horizontal rectangles
  const layoutPattern = [
    { span: 'col-span-2 row-span-2' }, // Large square
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-1 row-span-2' }, // Vertical rectangle
    { span: 'col-span-2 row-span-1' }, // Horizontal rectangle
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-2 row-span-2' }, // Large square
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-1 row-span-2' }, // Vertical rectangle
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-2 row-span-1' }, // Horizontal rectangle
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-2 row-span-2' }, // Large square
    { span: 'col-span-1 row-span-1' }, // Small square
    { span: 'col-span-1 row-span-1' }, // Small square
  ];

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none bg-zinc-950 overflow-hidden flex items-center justify-center">
        {/* Container slightly rotated and enlarged to cover the edges beautifully */}
        <motion.div 
          className="absolute w-[120vw] h-[120vh] opacity-60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ 
            rotate: [ -1, 1, -1 ],
            scale: [ 1.02, 1.05, 1.02 ]
          }}
          transition={{ 
            duration: 40, 
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          {/* Dense grid ensures all 15 items pack perfectly together without holes */}
          <div className="grid grid-cols-3 md:grid-cols-5 auto-rows-[minmax(150px,1fr)] gap-3 md:gap-4 w-full h-full p-4 md:p-8 grid-flow-dense">
          {combinedImages.map((imgSrc, i) => {
             // Assign a span from the pattern to keep the masonry look, cycling if needed
             const spanClass = layoutPattern[i % layoutPattern.length].span;
             
             return (
               <motion.div
                 key={`${imgSrc}-${i}`}
                 className={`relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${spanClass}`}
                 initial={{ opacity: 1, y: 0 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ 
                   duration: 1.5, 
                   delay: i * 0.15,
                   ease: "easeOut"
                 }}
               >
                 <img 
                   src={imgSrc} 
                   alt="Collage piece"
                   className="w-full h-full object-cover" 
                 />
                 {/* Inner gradient overlay for artistic effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10" />
               </motion.div>
             )
          })}
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 backdrop-blur-[1px]" />
      </div>
    </>
  );
}
