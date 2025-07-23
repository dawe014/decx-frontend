"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

// Image Imports
import story from "@/public/story1.jpg";
import video from "@/public/video.jpg";
import graphics from "@/public/graphic.jpg";
import social from "@/public/social1.jpg";
import influencer from "@/public/influe1.jpg";
import eMagazine from "@/public/e-magazine.jpg";

// Animation Variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeInOut" },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const ServiceCard = ({ service }) => (
  <motion.div
    variants={fadeIn}
    className="group relative h-96 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 shadow-lg"
  >
    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/70 to-transparent z-10"></div>
    <div className="relative h-full w-full">
      <Image
        alt={service.title}
        src={service.image}
        className="object-cover transition-all duration-700 group-hover:scale-105"
        placeholder="blur"
        fill
      />
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
      <div className="w-14 h-14 rounded-xl bg-slate-800/80 backdrop-blur-sm flex items-center justify-center text-3xl mb-4 transition-all duration-300 group-hover:bg-indigo-600 group-hover:scale-110">
        <span role="img" aria-label="icon">
          {service.icon}
        </span>
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
      <p className="text-slate-300 text-sm">{service.description}</p>
    </div>
  </motion.div>
);

const FeatureCard = ({ feature }) => (
  <motion.div
    variants={fadeIn}
    className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-800 transition-all hover:-translate-y-1 hover:border-indigo-500/50"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-700/30 flex items-center justify-center text-3xl mb-5">
      <span role="img" aria-label="icon">
        {feature.icon}
      </span>
    </div>
    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
    <p className="text-slate-400 text-sm">{feature.desc}</p>
  </motion.div>
);

const AudienceCard = ({ audience }) => (
  <motion.div
    variants={fadeIn}
    className="bg-gradient-to-br from-slate-800/50 to-slate-900/70 p-8 rounded-2xl border border-slate-800 transition-all hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/50"
  >
    <div className="flex items-center gap-4 mb-6">
      <div
        className={`w-12 h-12 rounded-lg ${audience.color} flex items-center justify-center text-3xl`}
      >
        <span role="img" aria-label="icon">
          {audience.icon}
        </span>
      </div>
      <h4 className="text-2xl font-bold">{audience.title}</h4>
    </div>
    <ul className="space-y-3">
      {audience.points.map((point, i) => (
        <li key={i} className="flex items-start gap-3 text-slate-300">
          <FiCheck className={`flex-shrink-0 mt-1 ${audience.checkColor}`} />
          <span>{point}</span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ServicesPage = () => {
  const services = [
    {
      title: "Storytelling & Branding",
      description: "Share your brand's journey through engaging narratives.",
      image: story,
      icon: "📖",
    },
    {
      title: "Video Production",
      description: "Professional video creation to amplify your message.",
      image: video,
      icon: "🎥",
    },
    {
      title: "Graphics Design",
      description: "Stunning visuals tailored to your brand's identity.",
      image: graphics,
      icon: "🎨",
    },
    {
      title: "Social Media Management",
      description:
        "Let DECX manage your social profiles for consistent growth.",
      image: social,
      icon: "📱",
    },
    {
      title: "Influencer Marketing",
      description: "Connect with influencers for impactful campaigns.",
      image: influencer,
      icon: "🌟",
    },
    {
      title: "E-Magazine Publishing",
      description:
        "Publish compelling digital magazines to showcase your success.",
      image: eMagazine,
      icon: "📚",
    },
  ];

  const features = [
    {
      title: "Tailored Strategies",
      desc: "Custom social media plans aligned with your business goals to maximize engagement and growth.",
      icon: "📊",
    },
    {
      title: "Multi-Platform Expertise",
      desc: "Proven experience managing content across TikTok, Facebook, Instagram, LinkedIn, and more.",
      icon: "🌐",
    },
    {
      title: "Data-Driven Insights",
      desc: "Advanced analytics to track performance and optimize campaigns for measurable results.",
      icon: "📈",
    },
    {
      title: "Creative Excellence",
      desc: "Eye-catching visuals and engaging content that resonates with your target audience.",
      icon: "🎨",
    },
    {
      title: "Affordable Packages",
      desc: "Premium-quality services with competitive pricing to fit your budget.",
      icon: "💲",
    },
    {
      title: "End-to-End Support",
      desc: "We handle everything from content creation and scheduling to community management.",
      icon: "🛠️",
    },
  ];

  const audiences = [
    {
      title: "For Influencers",
      icon: "👑",
      color: "bg-indigo-500/20",
      checkColor: "text-indigo-400",
      points: [
        "Create a detailed profile with location, niche, and follower stats.",
        "Apply to projects or receive direct invitations from brands.",
        "Collaborate with top-tier brands and boost your career.",
      ],
    },
    {
      title: "For Businesses",
      icon: "🏢",
      color: "bg-purple-500/20",
      checkColor: "text-purple-400",
      points: [
        "Post campaigns with clear budgets, timelines, and criteria.",
        "Access a curated pool of influencers tailored to your needs.",
        "Outsource social media management to focus on your core business.",
      ],
    },
  ];

  return (
    <div className="bg-slate-950 text-white">
      <Head>
        <title>DECX | Marketing Services</title>
        <meta
          name="description"
          content="Elevate your brand with DECX's expert marketing services."
        />
      </Head>

      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-950 opacity-80 z-0"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse,white,transparent_70%)] opacity-30"></div>
        <div className="container mx-auto max-w-7xl px-6 lg:px-8 text-center relative z-10">
          <motion.h1
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400"
          >
            Our Services
          </motion.h1>
          <motion.p
            variants={fadeIn}
            initial="initial"
            animate="animate"
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            Explore our comprehensive marketing solutions designed to elevate
            your brand's digital presence through innovation and strategy.
          </motion.p>
        </div>
      </section>

      {/* Overview Section */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="py-20 relative"
      >
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Strategic Marketing Solutions
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
              We bridge the gap between businesses and digital creators through
              targeted influencer partnerships, data-driven campaigns, and
              comprehensive brand management.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {audiences.map((audience) => (
              <AudienceCard key={audience.title} audience={audience} />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Services Grid Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="container mx-auto max-w-7xl px-6 lg:px-8"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block mb-4 text-indigo-400 font-medium tracking-wider">
              OUR EXPERTISE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Comprehensive Marketing Services
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-950">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="container mx-auto max-w-7xl px-6 lg:px-8"
        >
          <motion.div variants={fadeIn} className="text-center mb-16">
            <span className="inline-block mb-4 text-indigo-400 font-medium tracking-wider">
              OUR ADVANTAGE
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">
              Why{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                DECX
              </span>{" "}
              Stands Out
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
              We transform your digital presence with innovative strategies and
              measurable results.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] opacity-20"></div>
        <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-slate-900 to-indigo-900/30 rounded-3xl p-8 md:p-12 border border-slate-800 text-center"
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Elevate Your Brand?
            </h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Let's discuss how DECX can transform your digital presence with
              our tailored marketing solutions.
            </p>
            <a
              href="/contact-us"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 transform hover:-translate-y-0.5"
            >
              Contact Our Team <FiArrowRight className="ml-2" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
