import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-t from-blue-50 to-red-50 flex flex-col items-center justify-center text-center overflow-hidden px-4">

      {/* Text Section */}
      <div>
        {/* Headline */}
        <h1
          className="
        text-4xl md:text-5xl lg:text-6xl
        font-semibold
        leading-tight
        tracking-tight
        bg-gradient-to-r from-blue-400 via-red-400 to-gray-400
        bg-clip-text
        text-transparent
        animate-fade-up
        delay-200
      "
        >
          Elevate Your <br />
          Trading Experience
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 max-w-xl mt-4 text-base md:text-lg animate-fade-up delay-400">
          An online trading journal to get the pulse of your trade for its healthy growth.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate("/dashboard")}
          className="
    mt-6
    bg-gradient-to-r from-blue-200 to-gray-200
    text-gray-700
    font-medium
    px-8
    py-3
    rounded-full
    shadow-lg
    transform
    transition-transform
    duration-300
    ease-out
    hover:scale-105
    hover:shadow-[0_5px_10px_rgba(0,0,0,0.1)]
    active:scale-95
    animate-fade-up
    delay-600
  "
        >
          Go To Dashboard
        </button>
      </div>

      {/* Image + Floating Cards */}
      <div className="relative mt-14 animate-fade-up delay-1000 flex items-center justify-center w-full max-w-4xl">

        {/* Center Image */}
        <img
          src="/tradeLanding.png"
          alt="Trading Visual"
          className="w-full max-w-2xl object-contain drop-shadow-2xl"
        />

        {/* Left Floating Card */}
        <div className="absolute left-0 ml-[140px] md:left-1 top-1/2 -translate-y-1/2
      bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-white text-sm shadow-lg animate-fade-up delay-1200">
          <p className="text-gray-300 text-xs">Trading Journal</p>
          <p className="font-semibold">Observe Your P & L</p>
        </div>

        {/* Right Floating Card */}
        <div className="absolute right-0 md:right-20 top-1/3
      bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 text-white text-sm shadow-lg animate-fade-up delay-1400">
          <p className="text-gray-300 text-xs">Trading Pairs</p>
          <p className="font-semibold">Daily Trade Snapshot</p>
          <div className="h-1 w-full bg-white/20 rounded mt-2">
            <div className="h-full w-[96%] bg-white rounded"></div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default LandingPage;
