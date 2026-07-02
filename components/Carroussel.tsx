"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import Image2 from "@/public/Image6.png";
import Image3 from "@/public/Image3.png";

const images = [Image2, Image3];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  function nextSlide() {
    setCurrent((prev) => (prev + 1) % images.length);
  }

  function prevSlide() {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <div className="relative w-full  h-[170px] sm:h-[250px] md:h-[350px] lg:h-[550px] overflow-hidden">
      <div
        className="flex h-full  transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((image, index) => (
          <div key={index} className="relative min-w-full  h-full">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-fill"
            />
          </div>
        ))}
      </div>
      <input
        onClick={prevSlide}
        name="grupo_escolhas"
        type="radio"
        id="radio-1"
        className="hidden"
      />

      <label
        htmlFor="radio-1"
        className={`absolute bottom-1 left-1/2 
  -translate-x-10 w-3 h-3 rounded-full cursor-pointer
  ${current === 0 ? "bg-white" : "bg-transparent border-2  border-white"}`}
      />
      <input
        onClick={nextSlide}
        name="grupo_escolhas"
        type="radio"
        id="radio-2"
        className="hidden"
      />
      <label
        htmlFor="radio-2"
        className={`absolute bottom-1 left-1/2 
  translate-x-2 w-3 h-3 rounded-full cursor-pointer
  ${current === 1 ? "bg-white" : "bg-transparent border-2  border-white"}`}
      />
    </div>
  );
}
