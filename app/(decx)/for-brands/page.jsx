"use client";
import React from "react";
import { FiBarChart2, FiFilter, FiBriefcase, FiZap } from "react-icons/fi";
import FAQItem from "@/components/FAQItem"; // Adjust path if needed

const ForBrandsPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 1. Hero Section */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find the Perfect Influencers. <br />
            <span className="text-indigo-400">Drive Real Growth.</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
            Our data-driven platform connects you with vetted creators to launch
            authentic campaigns that deliver measurable ROI. Stop guessing,
            start growing.
          </p>
          <div className="mt-10">
            <a
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Start Your First Campaign
            </a>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              A Simple Path to Success
            </h2>
            <p className="mt-4 text-slate-400">
              Launch your next successful campaign in just three simple steps.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Create Your Campaign Brief
              </h3>
              <p className="text-slate-400">
                Outline your goals, target audience, and content requirements on
                our intuitive platform.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Discover & Hire Creators
              </h3>
              <p className="text-slate-400">
                Use our smart filters and data insights to find and invite the
                perfect influencers for your brand.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Manage & Track Results
              </h3>
              <p className="text-slate-400">
                Communicate, approve content, and track real-time campaign
                performance from a single dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features for Brands */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Everything You Need to Scale
            </h2>
            <p className="mt-4 text-slate-400">
              Our powerful features are designed to save you time and maximize
              your marketing budget.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiFilter className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">Vetted Creator Network</h4>
              <p className="text-sm text-slate-400">
                Access thousands of pre-vetted influencers with verified
                engagement and audience data.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiBarChart2 className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">
                Advanced Analytics & ROI
              </h4>
              <p className="text-sm text-slate-400">
                Track key metrics like reach, engagement, and conversions to
                prove campaign value.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiZap className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">AI-Powered Matching</h4>
              <p className="text-sm text-slate-400">
                Our algorithm suggests the best-fit creators for your campaign
                based on 50+ data points.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiBriefcase className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">All-in-One Management</h4>
              <p className="text-sm text-slate-400">
                Handle contracts, content approvals, and payments securely
                within one platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <FAQItem question="How do you vet your influencers?">
            Every creator on DECx undergoes a rigorous vetting process. We
            analyze their audience demographics, historical engagement rates,
            and content quality to ensure they are authentic and professional.
            We have a zero-tolerance policy for fraudulent activity.
          </FAQItem>
          <FAQItem question="What kind of campaigns can I run?">
            You can run a wide variety of campaigns, from simple product seeding
            and sponsored posts (Instagram, TikTok, YouTube) to long-term brand
            ambassador programs. Our platform is flexible to support your
            specific marketing objectives.
          </FAQItem>
          <FAQItem question="How does pricing work?">
            DECx operates on a flexible model. You can choose a subscription
            plan for ongoing access to our platform and creator network, or opt
            for a per-campaign service fee. Contact our sales team for a
            customized quote.
          </FAQItem>
        </div>
      </section>

      {/* 5. Final Call to Action */}
      <section className="bg-indigo-600">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready to Launch a Campaign That Converts?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto">
            Join hundreds of leading brands who trust DECx to build impactful
            influencer partnerships.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="bg-white text-indigo-600 font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ForBrandsPage;
