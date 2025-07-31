"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaLinkedin,
  FaFacebook,
  FaTiktok,
  FaInstagram,
  FaTelegram,
} from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isDashboardRoute) {
    return null; // Do not render the header if on a dashboard route
  }
  return (
    <footer className="bg-background text-textPrimary py-10 px-6 border-t border-slate-800">
      <div className="max-w-7xl mx-auto ">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div>
            <Link className="flex flex-shrink-0 items-start" href="/">
              <div>
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={500}
                  height={500}
                  className="w-24 h-12"
                />
              </div>
            </Link>
            <p className="mt-3 text-greay-400">
              Connect with top influencers and grow your brand with ease.
            </p>
            {/* Social Icons */}
            <div className="flex space-x-4 mt-4">
              <Link href="https://www.linkedin.com/company/decx-marketing-agancy">
                <FaLinkedin className="text-blue-500 cursor-pointer text-xl" />
              </Link>
              <Link href="https://web.facebook.com/DECxMarketingAgency">
                <FaFacebook className="text-blue-600 cursor-pointer text-xl" />
              </Link>
              <Link href="https://www.instagram.com/dexc.marketing">
                <FaInstagram className="text-pink-500 cursor-pointer text-xl" />
              </Link>
              <Link href="https://www.tiktok.com/@decx_marketing_agency">
                <FaTiktok className="text-black cursor-pointer text-xl" />
              </Link>
              <Link href="https://t.me/decxmarketing">
                <FaTelegram className="text-blue-400 cursor-pointer text-xl" />
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-textSecondary">
              <li>
                <Link href="/find-influencer">Find Influencers</Link>
              </li>
              <li>
                <Link href="#">Brand Advertising</Link>
              </li>
              <li>
                <Link href="#">Social Media Marketing</Link>
              </li>
              <li>
                <Link href="#">Content Creation</Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <ul className="space-y-2 text-textSecondary">
              <li>
                <Link href="/about">Our Story</Link>
              </li>

              <li>
                <Link href="/e-magazine">E Magazine</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <p className="text-textSecondary">
              Email: contact@decxmarketing.com
            </p>
            <p className="text-textSecondary">Phone: +251949540860</p>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="text-center text-textPrimary text-sm mt-8 flex justify-center items-center">
        &copy; {new Date().getFullYear()}{" "}
        <Link
          className="flex-shrink-0 items-center justify-center text-center inline"
          href="/"
        >
          <div className="inline-flex">
            <Image
              src="/logo.jpg"
              alt="Logo"
              width={500}
              height={500}
              className="w-14 h-8 inline-flex"
            />
          </div>
        </Link>{" "}
        Marketing Agency. All rights reserved. Powered by Debo Engineering.
      </div>
    </footer>
  );
}
