"use client";

import React, { useEffect, useState } from 'react';
import Button from '../components/Button';
import { ChevronRight, Youtube, Trophy, BarChart } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-32 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center py-1 px-3 mb-6 bg-violet-900/30 border border-violet-700/50 rounded-full text-violet-400 text-sm font-medium">
              <span className="flex h-2 w-2 rounded-full bg-violet-400 mr-2"></span>
              Powered by UpRock DePIN Network
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="block text-4xl">Optimize Your Content with</span>
              <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                Decentralized Feedback
              </span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-xl">
              Get real-world feedback on your thumbnails and posters from actual viewers. Make data-driven decisions to increase your click-through rates.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
              <Button size="lg">
                Get Started Free
              </Button>
              <Button variant="outline" size="lg" className="group flex items-center">
                <span>Watch Demo</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            <div className="flex items-center text-sm text-slate-400">
              <span className="flex items-center mr-6">
                <Youtube className="h-4 w-4 mr-1 text-red-500" />
                For YouTubers
              </span>
              <span className="flex items-center mr-6">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                1000+ Content Creators
              </span>
              <span className="flex items-center">
                <BarChart className="h-4 w-4 mr-1 text-emerald-500" />
                27% CTR Improvement
              </span>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 blur-3xl opacity-30 rounded-full"></div>
            <div className="relative bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                {/* Thumbnail example 1 */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">72% Vote</div>
                  </div>
                  <img 
                    src="https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg" 
                    alt="Thumbnail example" 
                    className="rounded-lg w-full h-40 object-cover shadow-lg" 
                  />
                </div>
                
                {/* Thumbnail example 2 */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-70 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">28% Vote</div>
                  </div>
                  <img 
                    src="https://images.pexels.com/photos/5409751/pexels-photo-5409751.jpeg" 
                    alt="Thumbnail example" 
                    className="rounded-lg w-full h-40 object-cover shadow-lg" 
                  />
                </div>
                
                {/* Example statistics */}
                <div className="col-span-2 mt-4 flex space-x-4">
                  <div className="bg-slate-900 rounded-lg p-4 flex-1">
                    <div className="text-violet-400 text-sm font-medium mb-1">Click-Through Rate</div>
                    <div className="text-2xl font-bold">+18.5%</div>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 flex-1">
                    <div className="text-cyan-400 text-sm font-medium mb-1">Viewer Response</div>
                    <div className="text-2xl font-bold">2,893</div>
                  </div>
                </div>
                
                {/* User interface mockup */}
                <div className="col-span-2 mt-4 bg-slate-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-medium text-white">Live Feedback</div>
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <div className="text-emerald-500 text-xs">Recording</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-1">
                        <div className="h-3 w-12 bg-violet-500 rounded-sm"></div>
                        <div className="text-xs text-slate-400">Option A</div>
                      </div>
                      <div className="flex items-center space-x-1 mt-2">
                        <div className="h-3 w-5 bg-cyan-500 rounded-sm"></div>
                        <div className="text-xs text-slate-400">Option B</div>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;