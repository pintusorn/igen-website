'use client'
import Image from 'next/image'


import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { useEffect, useState } from 'react'

const images = [
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
]

export default function ImageCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: 'snap',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, 6000)
    return () => clearInterval(interval)
  }, [instanceRef])

  return (
    <div className="relative mt-4">
      {/* Carousel */}
      <div ref={sliderRef} className="keen-slider h-[500px] rounded-md overflow-hidden transition-transform duration-5000">
        {images.map((src, index) => (
          <div key={index} className="keen-slider__slide flex items-center justify-center">
            <Image src={src} alt={`slide-${index}`} className="w-full h-full object-contain mx-auto" />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => instanceRef.current?.moveToIdx(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? 'bg-red-600' : 'bg-white opacity-60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
