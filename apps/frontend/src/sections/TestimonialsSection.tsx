"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Card from '../components/Card';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
  platform: string;
  stats: {
    label: string;
    value: string;
  };
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials: Testimonial[] = [
    {
      name: "Alex Rivera",
      role: "Tech YouTuber, 1.2M Subscribers",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300",
      comment: "CrowdLens has been a game-changer for my channel. Before using it, I was just guessing which thumbnails would work. Now I have actual data from real people who match my target audience. My CTR has increased by 27% in just three months!",
      rating: 5,
      platform: "YouTube",
      stats: {
        label: "CTR Improvement",
        value: "+27%"
      }
    },
    {
      name: "Sophia Chen",
      role: "Content Creator, 845K Followers",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300",
      comment: "As a creator who's been struggling with the algorithm changes, CrowdLens helped me understand what my audience actually wants to click on. The demographic breakdown was particularly useful—I discovered my thumbnails were attracting the wrong age group!",
      rating: 5,
      platform: "YouTube & Instagram",
      stats: {
        label: "Audience Growth",
        value: "+18%"
      }
    },
    {
      name: "Marcus Johnson",
      role: "Educational Content Creator, 650K Subscribers",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300",
      comment: "The decentralized feedback network is what sets CrowdLens apart. The feedback comes from real people, not bots or click farms. For educational content like mine, knowing which thumbnails actually communicate the topic clearly has been invaluable.",
      rating: 5,
      platform: "YouTube",
      stats: {
        label: "Video Views",
        value: "+42%"
      }
    }
  ];

  const handlePrev = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <section id="testimonials" className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="What Content Creators Are Saying"
          subtitle="Join thousands of creators who have improved their engagement with CrowdLens."
          centered
          light
        />

        <div className="relative max-w-4xl mx-auto mt-12">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <Card className="flex flex-col md:flex-row gap-6 md:gap-8">
                    <div className="flex flex-col items-center md:items-start md:w-1/3">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name} 
                        className="w-20 h-20 rounded-full object-cover border-2 border-violet-500 mb-4" 
                      />
                      <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                      <p className="text-slate-400 text-sm mb-2">{testimonial.role}</p>
                      <div className="flex items-center text-yellow-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4" 
                            fill={i < testimonial.rating ? "currentColor" : "none"} 
                          />
                        ))}
                      </div>
                      <div className="bg-slate-900 rounded-lg p-3 w-full">
                        <p className="text-xs text-slate-400 mb-1">{testimonial.platform}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-slate-400">{testimonial.stats.label}</p>
                          <p className="text-emerald-400 font-semibold">{testimonial.stats.value}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <div className="relative">
                        <div className="text-violet-500 text-5xl font-serif absolute -top-6 -left-3 opacity-30">&quot;</div>
                        <p className="text-slate-300 italic relative z-10 text-lg leading-relaxed">
                          {testimonial.comment}
                        </p>
                        <div className="text-violet-500 text-5xl font-serif absolute -bottom-10 -right-3 opacity-30">&quot;</div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? 'bg-violet-500 w-6' : 'bg-slate-600'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-slate-800 rounded-full p-2 text-white hover:bg-violet-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 hidden md:block"
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>

          <button
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-slate-800 rounded-full p-2 text-white hover:bg-violet-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 hidden md:block"
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;