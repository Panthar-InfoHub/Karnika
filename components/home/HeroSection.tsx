import React from "react";

const HeroSection = () => {
  return (
    <section className="relative h-[600px] overflow-hidden">
      {/* Background Image with Transition */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/007/563/124/non_2x/farm-background-with-barn-and-windmill-free-vector.jpg)` }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>
    </section>
  );
};

export default HeroSection;
