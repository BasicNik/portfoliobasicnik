"use client";
import { useEffect, useRef } from "react";

import { Content, KeyTextField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { gsap } from 'gsap';
import Bounded from "@/components/Bounded";
import Shapes from "./Shapes";
/**
 * Props for `Hero`.
 */
export type HeroProps = SliceComponentProps<Content.HeroSlice>;

/**
 * Component for "Hero" Slices.
 */
const Hero = ({ slice }: HeroProps): JSX.Element => {

  const component = useRef(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl =gsap.timeline();
      
      tl.fromTo(".name-animation",
      {x:-100,
        opacity: 0, 
        rotate: -15,},
      {x:0, 
        opacity: 1,
        rotate: 0,
        ease: "elastic.out(1,0.3)",
        duration: 2,
        transformOrigin: "left top",
        delay: 0.8,
        stagger: {
          each: 0.1,
          from: "random",
        }
      }
    );

        tl.fromTo(".job-title",
        {
          y: 20,
          opacity: 0,
          scale: 1.2,
        },{
          opacity: 1,
          y: 0,
          duration: 1,
          scale: 1,
          delay: -0.5,
          ease: "back.out(1.7)",
        }
        )



    }, component);
    return () => ctx.revert();
  }, []);

  const renderLetters = (name:KeyTextField, key:string) =>{
    if (!name) return;
    return name.split("").map((letter, index) => (
      <span key={index} className={`name-animation name-animation-${key} inline-block opacity-0`}>
        {letter}
      </span>
    ))
  }

  return (
    <Bounded
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      ref={component}
    >
      <div className="grid min-h-[70vh] grid-cols-1 md:grid-cols-2 items-center ">
        <div className="cursor-pointer"><Shapes/></div>
        <div className="col-start-1 md:row-start-1"> 
          <h1 className="mb-8 text-[clamp(3rem,20vmin,20rem)] 
          font-black leading-tight tracking-tight" 
          aria-label={slice.primary.first_name + " " + slice.primary.last_name}>
          <span className="block text-slate-300">
            {renderLetters(slice.primary.first_name, "first")}</span>
          <span className="-mt-[.2em] block text-slate-400">
            {renderLetters(slice.primary.last_name, "second")}</span>
          </h1>
          
          <span className="job-title block bg-gradient-to-tr via-pink-400 to-red-300 from-violet-500
          bg-clip-text text-2xl font-bold uppercase tracking-widest text-transparent
          opacity-0 md:text-4xl">{slice.primary.tag_line}
          </span>
          
        </div>
      </div>
    </Bounded>
  );
};

export default Hero;
