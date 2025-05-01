"use client";

import React, { useState } from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import Card from '../components/Card';

interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  features: string[];
  cta: string;
  popular?: boolean;
}

const PricingSection: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      description: "Perfect for new content creators just getting started.",
      price: {
        monthly: "$19",
        yearly: "$15",
      },
      features: [
        "10 thumbnail tests per month",
        "Up to 100 feedback responses per test",
        "Basic analytics dashboard",
        "Email support",
        "1 project"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      description: "For serious creators looking to grow their audience.",
      price: {
        monthly: "$49",
        yearly: "$39",
      },
      features: [
        "30 thumbnail tests per month",
        "Up to 500 feedback responses per test",
        "Advanced analytics & demographics",
        "Priority support",
        "3 projects",
        "Custom audience targeting"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Agency",
      description: "For teams managing multiple content creators.",
      price: {
        monthly: "$99",
        yearly: "$79",
      },
      features: [
        "100 thumbnail tests per month",
        "Unlimited feedback responses",
        "Full analytics suite with exports",
        "Dedicated support manager",
        "Unlimited projects",
        "Team collaboration tools",
        "API access"
      ],
      cta: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-950 relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-slate-900 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that works best for your content creation needs."
          centered
          light
        />

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800 p-1 rounded-full flex items-center">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly
                  ? 'bg-violet-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly <span className="text-xs opacity-75">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full transition-transform duration-300 hover:transform hover:-translate-y-2 ${
                plan.popular
                  ? 'border-violet-500 relative z-10 transform scale-105 md:scale-110'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-xs font-bold py-1 px-4 rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-slate-400 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-end">
                    <span className="text-4xl font-bold text-white">
                      {isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    <span className="text-slate-400 ml-2">/ month</span>
                  </div>
                  {isYearly && (
                    <p className="text-emerald-400 text-sm mt-1">
                      Billed yearly (20% off)
                    </p>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-3 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  fullWidth
                  className={plan.popular ? 'py-3' : ''}
                >
                  {plan.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ entry point */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Not sure which plan is right for you?{' '}
            <a href="#faq" className="text-violet-400 hover:text-violet-300 inline-flex items-center">
              Check our FAQ
              <HelpCircle className="ml-1 h-4 w-4" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;