"use client";
import React from "react";
import Image from "next/image";
import {
  FiTarget,
  FiBarChart2,
  FiBriefcase,
  FiZap,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

// --- Reusable Sub-Components (for a clean structure) ---

const FeatureCard = ({ icon: Icon, title, children }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-600/20 mb-4">
      <Icon className="h-6 w-6 text-indigo-400" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{children}</p>
  </div>
);

const TestimonialCard = ({ quote, name, role, company }) => (
  <div className="bg-slate-800 p-8 rounded-xl border border-slate-700/50">
    <FaQuoteLeft className="text-indigo-500 text-3xl mb-4" />
    <p className="text-slate-300 mb-6 italic">&quot;{quote}&quot;</p>
    <div className="flex items-center">
      <div>
        <p className="font-semibold text-white">{name}</p>
        <p className="text-sm text-indigo-400">
          {role}, {company}
        </p>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 1. Hero Section */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800/50"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/path-to-abstract-bg.svg')] bg-cover"></div>
        <div className="container mx-auto px-4 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-indigo-400">DECx:</span> The Nexus of Brands
            and Creators.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-300">
            We bridge the gap between ambitious businesses and &quot;authentic
            digital creators&quot;, crafting partnerships that drive real
            results and build lasting brand equity.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/for-brands"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              For Brands
            </a>
            <a
              href="/for-influencers"
              className="w-full sm:w-auto bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600 text-slate-200 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
            >
              For Creators
            </a>
          </div>
        </div>
      </section>

      {/* 2. Our Mission Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
            <p className="mt-4 text-slate-400">
              At DECx, our mission is to eliminate the guesswork in influencer
              marketing. We foster genuine connections that benefit both brands
              and creators, ensuring every campaign is authentic, impactful, and
              measurable.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={FiTarget} title="Targeted Partnerships">
              We connect you with the &quot;right influencers&quot; whose
              audience aligns perfectly with your brand values and customer
              profile.
            </FeatureCard>
            <FeatureCard icon={FiBarChart2} title="Data-Driven Campaigns">
              Every strategy is built on a foundation of data, ensuring optimal
              performance, transparent reporting, and measurable ROI.
            </FeatureCard>
            <FeatureCard icon={FiBriefcase} title="Comprehensive Management">
              From negotiation and content approval to payment and analytics, we
              handle the entire campaign lifecycle so you can focus on your
              business.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* 3. Why DECx? Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              Why Choose DECx?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-slate-400">
              We&apos;re more than a platform; we&apos;re your strategic partner
              in growth.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <FiCheckCircle className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">Authenticity First</h4>
                  <p className="text-slate-400">
                    Our vetting process ensures creators are not only a brand
                    fit but also have genuine engagement and influence.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiZap className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">
                    Streamlined Workflow
                  </h4>
                  <p className="text-slate-400">
                    Our platform simplifies discovery, communication, and
                    campaign management, saving you time and resources.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FiUsers className="h-8 w-8 text-indigo-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-lg">
                    Diverse Creator Network
                  </h4>
                  <p className="text-slate-400">
                    From micro-influencers to industry leaders, access a curated
                    network across dozens of niches to find your perfect match.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden bg-slate-800">
              <Image
                src="/marketing.jpg"
                alt="Creators and brands collaborating"
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted By / Social Proof Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-semibold text-slate-400">
            Trusted by Innovative Brands & Creators
          </h2>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center opacity-60">
            <div className="flex justify-center">
              <Image
                src="/path-to-logo-1.svg"
                alt="Client Logo 1"
                width={140}
                height={40}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/path-to-logo-2.svg"
                alt="Client Logo 2"
                width={140}
                height={40}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/path-to-logo-3.svg"
                alt="Client Logo 3"
                width={140}
                height={40}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/path-to-logo-4.svg"
                alt="Client Logo 4"
                width={140}
                height={40}
              />
            </div>
            <div className="flex justify-center">
              <Image
                src="/path-to-logo-5.svg"
                alt="Client Logo 5"
                width={140}
                height={40}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              What Our Partners Say
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TestimonialCard
              quote="DECx revolutionized how we approach influencer marketing. The data insights and quality of creators are unmatched. Our campaign ROI has increased by 200%."
              name="Sarah Johnson"
              role="CMO"
              company="FutureGadget Inc."
            />
            <TestimonialCard
              quote="As a creator, finding brands that align with my values is tough. DECx makes it seamless. I've landed my best partnerships through their platform."
              name="Alex Martinez"
              role="Lifestyle Creator"
              company="@AlexGoes"
            />
          </div>
        </div>
      </section>

      {/* 6. Final Call to Action Section */}
      <section className="bg-indigo-600">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Ready to Amplify Your Reach?</h2>
          <p className="mt-3 max-w-2xl mx-auto">
            Whether you&apos;re a brand seeking influence or a creator ready to
            partner, your journey starts here.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="/signup"
              className="w-full sm:w-auto bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Start a Campaign
            </a>
            <a
              href="/signup"
              className="w-full sm:w-auto border border-white/50 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:bg-white/10"
            >
              Join as a Creator
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
