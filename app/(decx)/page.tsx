import Image from "next/image";
import Button from "@/components/Button";
import story from "@/public/story1.jpg";
import video from "@/public/video.jpg";
import graphics from "@/public/graphic.jpg";
import social from "@/public/social1.jpg";
import influencer from "@/public/influe1.jpg";
import eMagazine from "@/public/e-magazine.jpg";
import HowweareImage from "@/public/influence3.png";
import { FaCheck, FaStar } from "react-icons/fa";
export default function Home() {
  return (
    <>
      {/* Hero Section */}

      <section className="heroBackground bg-overlay min-h-screen">
        <div className="bg-overlay min-h-screen  flex items-center justify-center">
          <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8  ">
            <div className="flex flex-col md:flex-row gap-2 items-center justify-center ">
              <div className="flex flex-col gap-5 w-full md:w-2/3 justify-center items-center ">
                <h1 className="text-heading">
                  <span className="text-primary">Connecting</span>{" "}
                  <span className="text-secondary">Brands</span> with{" "}
                  <span className="text-secondary">Influencers</span> , One{" "}
                  <span className="text-primary">Story</span> at a Time{" "}
                </h1>
                <p className="text-paragraph">
                  DECx Marketing Agency bridges the gap between businesses and
                  creators, fostering growth through collaboration,
                  storytelling, and innovation..
                </p>
                <div className="flex gap-3 items-center justify-center md:justify-start">
                  <Button btnStyle="btn-primary">Get Started</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className=" ">
        <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8 ">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-start py-5">
            <div className="w-full md:w-1/2 relative shadow-md rounded-lg">
              <Image src={HowweareImage} alt="Hero image" />
            </div>
            <div className="flex flex-col gap-5 w-full md:w-1/2">
              <p className="text-primary text-md font-light italic font-mono">
                Who We Are?
              </p>
              <h1 className="text-3xl font-bold capitalize">
                empowering connections in the influencer landscape
              </h1>
              <p className=" text-textSecondary">
                At <span className="text-primary">DECx</span>, We connect
                influencers with brand owners, fostering authentic
                collaborations that drive success. Our platform empowers
                influencers to showcase their talent while helping brands
                discover the perfect voices to represent them.
              </p>
              <p className="text-center text-xl text-primary font-bold">
                Key Highlights
              </p>
              <div className="grid grid-cols-2 gap-2 items-center justify-center md:justify-start">
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Influencer Profile</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Prand Discovery</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Seamless Communication</p>
                </div>
                <div className="flex gap-2 items-center">
                  <FaCheck size={16} className="text-primary" />
                  <p>Flexible Collaboration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service section */}
      <section className="bg-bgSecondary border-t border-slate-800">
        <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8 ">
          <div className="flex flex-col gap-4 items-center justify-center shadow-sm py-5 md:py-12">
            <div className="md:py-6">
              <h2 className="text-subheading">Our Services</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={story}
                  className="w-full  object-cover flex-1 max-h-72"
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Storytelling & e-Magazine
                  </h3>
                  <p className="text-textSecondary">
                    Share your brand’s journey through engaging stories and
                    curated articles.
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={video}
                  className="w-full  object-cover flex-1 max-h-72 "
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Company Video Production
                  </h3>
                  <p className="text-textSecondary">
                    Professional video creation to amplify your brand’s message.
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={graphics}
                  className="w-full  object-cover flex-1 max-h-72"
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Graphics Design{" "}
                  </h3>
                  <p className="text-textSecondary">
                    Stunning visuals tailored to your brand’s identity.
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={social}
                  className="w-full  object-cover flex-1 max-h-72"
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Social Media Management
                  </h3>
                  <p className="text-textSecondary">
                    Let DECx manage your social profiles for consistent growth.
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={influencer}
                  className="w-full  object-cover flex-1 max-h-72"
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    Influencer Campaigns
                  </h3>
                  <p className="text-textSecondary">
                    Match with influencers to execute impactful campaigns.
                  </p>
                </div>
              </div>
              <div className="flex flex-col bg-slate-800  hover:shadow-primary  rounded-lg shadow w-full  overflow-hidden hover:scale-105 transform duration-300 ">
                <Image
                  alt="Story image"
                  src={eMagazine}
                  className="w-full  object-cover flex-1 max-h-72"
                  width={500}
                />
                <div className="flex flex-col p-6 gap-2">
                  <h3 className="text-xl font-semibold mb-2 text-secondary">
                    E-Magazine Creation
                  </h3>
                  <p className="text-textSecondary">
                    Publish compelling digital magazines to showcase your
                    success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-bgSecondary border-t border-slate-800">
        <div className="mx-auto  max-w-7xl py-6 px-6 lg:px-8  min-h-96 bg-overlay">
          <div className="flex flex-col gap-4 items-center justify-center shadow-sm py-5 md:py-12">
            <div className="">
              <h2 className="text-subheading">Success Stories</h2>
            </div>
            <div className="">
              <p className="text-md">Real businesses, real impact.</p>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-6 px-4">
              <div className="shadow-lg p-6 bg-slate-800 rounded-lg max-w-md">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                  </div>
                  <p className="text-textSecondary italic">
                    &quot;DECx helped us find the perfect influencer for our
                    campaign, and we saw a 200% increase in engagement!&quot;
                  </p>
                  <p className="mt-4 font-semibold">
                    - Marketing Lead, XYZ Corp
                  </p>
                </div>
              </div>
              <div className="shadow-lg p-6 bg-slate-800 rounded-lg max-w-md">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                  </div>
                  <p className="text-textSecondary italic">
                    &quot;The storytelling and e-magazine services gave our
                    brand a unique voice and boosted credibility.&quot;
                  </p>
                  <p className="mt-4 font-semibold">- CEO, Startup ABC</p>
                </div>
              </div>
              <div className="shadow-lg p-6 bg-slate-800 rounded-lg max-w-md">
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                    <FaStar className="text-primary" />
                  </div>
                  <p className="text-textSecondary italic">
                    &quot;The storytelling and e-magazine services gave our
                    brand a unique voice and boosted credibility.&quot;
                  </p>
                  <p className="mt-4 font-semibold">- CEO, Startup ABC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
