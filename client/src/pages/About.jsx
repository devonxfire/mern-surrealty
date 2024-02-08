import React from "react";
import aboutHero from "../assets/about-hero.jpg";

export default function About() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${aboutHero})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "100vh",
          position: "relative",
          padding: "0 2rem",
        }}
      >
        <div className="bg-black opacity-80 absolute inset-0"></div>

        <div className="text-slate-500 max-w-4xl mx-auto pt-20 relative">
          <h1 className="text-white text-3xl sm:text-5xl font-bold text-center sm:text-right pt-6">
            Redefining <span className="text-red-600">Luxury</span> Real Estate.
          </h1>
          <p className="text-white text-xs mt-8 sm:mt-16  font-light leading-6">
            Welcome to Surrealty Estates, a revolutionary platform that
            seamlessly connects dream homes with aspiring homeowners. This
            digital oasis focuses on the luxurious housing market while
            maintaining inclusivity for all, offering a sophisticated experience
            for both sellers and buyers. <br />
            <br />
            <span className="text-red-600 font-bold">
              User-Centric Onboarding:
            </span>{" "}
            We provide a user-centric sign-up experience, allowing users to
            register as either a distinguished agent or an eager buyer. The
            platform ensures a seamless onboarding journey, catering to the
            unique needs of each participant. <br />
            <br />
            <span className="text-red-600 font-bold">Agent Paradise: </span> For
            agents, Surrealty Estates is a paradise for presenting their unique
            listings. The user-friendly interface allows for easy uploading of
            high-quality images, detailed property descriptions, and virtual
            tours. Advanced tools, including analytics, empower agents to
            strategically position their listings, expanding their reach and
            closing deals more efficiently.
            <br />
            <br />
            <span className="text-red-600 font-bold">
              Luxury at Your Fingertips:{" "}
            </span>
            While emphasizing the luxurious housing market, we remain inclusive,
            welcoming users from all walks of life. The platform offers an
            immersive experience for buyers, with advanced search filters and a
            curated collection of exquisite properties.
            <br />
            <br />
            <span className="text-red-600 font-bold">
              Community and Trust:
            </span>{" "}
            Beyond transactions, we foster a sense of community. Users can share
            experiences, provide reviews, and seek advice, building trust and
            transparency. This collaborative environment ensures that every
            interaction on the platform is backed by a sense of community and
            shared aspirations. In conclusion, Surrealty Estates stands as a
            beacon of innovation in the real estate industry. By combining
            luxury with accessibility, it has redefined the real estate
            experience for both agents and users. As dreams find their perfect
            address and homes become more than just properties, Surrealty
            Estates continues to shape the future of real estate, one luxurious
            connection at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
