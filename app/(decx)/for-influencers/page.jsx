"use client";
import React from "react";
import { FiStar, FiHeart, FiDollarSign, FiZap } from "react-icons/fi";
import FAQItem from "@/components/FAQItem"; // Adjust path if needed

const ForCreatorsPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 1. Hero Section */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Monetize Your Influence. <br />
            <span className="text-indigo-400">Partner with Great Brands.</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
            Join the DECx network to connect with top-tier brands, secure
            fair-paying partnerships, and focus on what you do best: creating
            amazing content.
          </p>
          <div className="mt-10">
            <a
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Join For Free
            </a>
          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Your Path to Partnership
            </h2>
            <p className="mt-4 text-slate-400">
              Landing your next brand deal is easier than ever.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Build Your Profile
              </h3>
              <p className="text-slate-400">
                Create a stunning media kit that showcases your stats,
                portfolio, and rates in minutes.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Discover & Apply
              </h3>
              <p className="text-slate-400">
                Browse campaigns from leading brands or get invited directly to
                exclusive partnerships.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Collaborate & Create
              </h3>
              <p className="text-slate-400">
                Communicate with brands, submit content for approval, and manage
                all your deliverables.
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-800 border-2 border-indigo-500 mb-4 mx-auto font-bold text-2xl text-indigo-400">
                4
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Get Paid Securely
              </h3>
              <p className="text-slate-400">
                We handle the invoicing and ensure you get paid on time, every
                time, for your hard work.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features for Creators */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">
              Designed for Creators Like You
            </h2>
            <p className="mt-4 text-slate-400">
              We provide the tools you need to grow your business and build
              lasting brand relationships.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiStar className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">Access Premium Brands</h4>
              <p className="text-sm text-slate-400">
                Connect with a curated list of exciting brands actively looking
                for creators.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiDollarSign className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">
                Fair & Transparent Rates
              </h4>
              <p className="text-sm text-slate-400">
                Set your own rates and negotiate terms. We champion fair pay for
                your creative work.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiHeart className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">Creative Freedom</h4>
              <p className="text-sm text-slate-400">
                We connect you with brands that respect your authentic voice and
                creative process.
              </p>
            </div>
            <div className="bg-slate-800 p-6 rounded-xl">
              <FiZap className="h-8 w-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-lg mb-1">Streamlined Workflow</h4>
              <p className="text-sm text-slate-400">
                Spend less time on admin and more time creating with our
                all-in-one platform.
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
              Your Questions, Answered
            </h2>
          </div>
          <FAQItem question="Is it free for creators to join DECx?">
            Yes! Creating a profile and browsing campaigns on DECx is completely
            free for creators. We only take a small, transparent service fee
            from the brand's payment upon successful completion of a campaign.
          </FAQItem>
          <FAQItem question="How do I get paid?">
            All payments are handled securely through our platform. Once your
            content is approved and the campaign terms are met, we process your
            payment directly to your connected bank account or PayPal. No more
            chasing invoices!
          </FAQItem>
          <FAQItem question="Can I set my own rates?">
            Absolutely. Your profile includes a section to list your standard
            rates for different types of content. You also have the ability to
            negotiate custom quotes for each campaign you apply for, giving you
            full control over your pricing.
          </FAQItem>
        </div>
      </section>

      {/* 5. Final Call to Action */}
      <section className="bg-indigo-600">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">
            Ready to Land Your Next Big Partnership?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto">
            Create your profile in minutes and start connecting with brands that
            value your voice.
          </p>
          <div className="mt-8">
            <a
              href="/signup"
              className="bg-white text-indigo-600 font-semibold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Create Your Free Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ForCreatorsPage;
