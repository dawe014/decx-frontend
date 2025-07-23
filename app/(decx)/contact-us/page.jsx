"use client";
import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import {
  FiSend,
  FiLoader,
  FiCheckCircle,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ContactInfo = () => (
  <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700 h-full">
    <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
    <p className="text-slate-400 mb-8">
      Have a question or a project in mind? Reach out directly or use the form.
      We're here to help!
    </p>
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="bg-indigo-600/20 p-3 rounded-lg text-indigo-400">
          <FaPhone />
        </div>
        <div>
          <h3 className="font-semibold text-white">Phone</h3>
          <a
            href="tel:+1234567890"
            className="text-slate-300 hover:text-indigo-400 transition-colors"
          >
            +1 (234) 567-890
          </a>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="bg-indigo-600/20 p-3 rounded-lg text-indigo-400">
          <FaEnvelope />
        </div>
        <div>
          <h3 className="font-semibold text-white">Email</h3>
          <a
            href="mailto:contact@decx.com"
            className="text-slate-300 hover:text-indigo-400 transition-colors"
          >
            contact@decx.com
          </a>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <div className="bg-indigo-600/20 p-3 rounded-lg text-indigo-400">
          <FaMapMarkerAlt />
        </div>
        <div>
          <h3 className="font-semibold text-white">Address</h3>
          <p className="text-slate-300">
            123 Marketing Lane, <br /> Addis Ababa, Ethiopia
          </p>
        </div>
      </div>
    </div>
  </div>
);

const FormInput = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  required = false,
  placeholder,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-slate-300 mb-1.5"
    >
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <input
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
    />
  </div>
);

const Notification = ({ status, message, onDismiss }) => (
  <AnimatePresence>
    {status && (
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
        className={`fixed top-24 right-5 p-4 rounded-lg flex items-center shadow-lg z-50 border ${
          status === "success"
            ? "bg-green-900/50 text-green-300 border-green-500/30"
            : "bg-red-900/50 text-red-300 border-red-500/30"
        }`}
      >
        {status === "success" ? (
          <FiCheckCircle className="mr-3" />
        ) : (
          <FiAlertTriangle className="mr-3" />
        )}
        <span>{message}</span>
        <button
          onClick={onDismiss}
          className="ml-4 text-xl opacity-70 hover:opacity-100"
        >
          <FiX />
        </button>
      </motion.div>
    )}
  </AnimatePresence>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong.");
      }

      setStatus("success");
      setMessage(result.message || "Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "An unknown error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <Notification
        status={status}
        message={message}
        onDismiss={() => setStatus(null)}
      />
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            We'd love to hear from you! Whether you have a question, a proposal,
            or just want to say hello, feel free to reach out.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
            <h2 className="text-3xl font-bold text-white mb-6">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormInput
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <FormInput
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <FormInput
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership Opportunity">
                    Partnership Opportunity
                  </option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-300 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2.5 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <FiLoader className="animate-spin" />
                  ) : (
                    <FiSend />
                  )}
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
            <div className="mt-8 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6481793750866!2d38.76161637400497!3d9.00497899105494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85966d4a7039%3A0x73d32896f53a47d5!2sBole%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1688000000000!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
              />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
