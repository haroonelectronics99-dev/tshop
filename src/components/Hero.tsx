import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c472f29?q=80&w=2070&auto=format&fit=crop',
    title: 'Royal Sherwanis',
    subtitle: 'Exquisite hand-embroidered sherwanis for your special day.',
    cta: 'View Wedding Collection'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?q=80&w=2080&auto=format&fit=crop',
    title: 'Modern Prince Coats',
    subtitle: 'A fusion of tradition and contemporary style.',
    cta: 'Shop Prince Coats'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1934&auto=format&fit=crop',
    title: 'Premium Shalwar Kameez',
    subtitle: 'Finest fabrics tailored to perfection.',
    cta: 'Explore Collection'
  }
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-stone-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay */}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl">
          <motion.h1 
            key={`title-${current}`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-oswald text-5xl md:text-7xl lg:text-8xl text-white font-bold tracking-widest uppercase mb-6 drop-shadow-lg"
          >
            {slides[current].title}
          </motion.h1>
          
          <motion.p 
            key={`sub-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-playfair text-xl md:text-2xl text-stone-200 italic mb-10 tracking-wide"
          >
            {slides[current].subtitle}
          </motion.p>

          <motion.div
            key={`cta-${current}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-2 bg-yellow-600 text-white px-8 py-4 rounded-full uppercase tracking-widest text-sm font-medium hover:bg-yellow-700 transition-all hover:scale-105 shadow-lg shadow-yellow-600/20"
            >
              {slides[current].cta} <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === current ? 'bg-yellow-600 scale-125' : 'bg-white/50 hover:bg-white'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
