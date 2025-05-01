import React from 'react';
import Button from '../components/Button';
import { ArrowRight } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-30"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600 rounded-full filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-600 rounded-full filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
            Ready to Boost Your <span className="bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">Content Performance</span>?
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who have improved their CTR and engagement with data-driven thumbnail optimization.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button size="lg" className="px-8">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="group flex items-center">
              <span>Schedule a Demo</span>
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 md:p-8 max-w-3xl mx-auto border border-slate-700">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img 
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" 
                alt="Testimonial" 
                className="w-12 h-12 rounded-full object-cover border-2 border-violet-500" 
              />
              <div className="text-left">
                <p className="text-white font-medium">Sophia Chen</p>
                <p className="text-slate-400 text-sm">Content Creator, 845K Followers</p>
              </div>
            </div>
            <p className="text-slate-300 italic text-lg">
              &quot;Since using CrowdLens, my average video CTR has gone from 4.2% to 7.8%. That is almost double the clicks with the same amount of impressions!&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;