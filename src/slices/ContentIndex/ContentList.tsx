"use client";
import { Content, asImageSrc, isFilled } from '@prismicio/client'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { SiReaddotcv } from 'react-icons/si';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IoMdReturnLeft } from 'react-icons/io';
//import { div } from 'three/examples/jsm/nodes/Nodes.js';

gsap.registerPlugin(ScrollTrigger)

type ContentListProps = {
  items: Content.BlogPostDocument[] | Content.ProjectDocument[]
  contentType: Content.ContentIndexSlice["primary"]["content_type"];
  fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
  viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
}

export default function ContentList({items, 
  contentType, 
  fallbackItemImage, 
  viewMoreText = "Read More"}: ContentListProps) {
    const component = useRef(null);
    const itemsRef = useRef<Array<HTMLLIElement | null>>([]);
    const [currentItem, setCurrentItem] = useState<null | number>(null)
    
    const lastMousePos = useRef({ x: 0, y: 0 });
    const revealRef = useRef(null);
    
    const [hovering, setHovering] = useState(false);
   

    const urlPrefix = contentType === "Blog" ? "/blog" : "/projects";

    useEffect(() => {
      // Animate list-items in with a stagger
      let ctx = gsap.context(() => {
        itemsRef.current.forEach((item, index) => {
          gsap.fromTo(
            item,
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 2,
              ease: "elastic.out(1,0.3)",
              stagger: 0.2,
              scrollTrigger: {
                trigger: item,
                start: "top bottom-=100px",
                end: "bottom center",
                toggleActions: "play none none none",
              },
            },
          );
        });
  
        return () => ctx.revert(); // cleanup!
      }, component);
    }, []);

    useEffect(() => {
      // Mouse move event listener
      const handleMouseMove = (e: MouseEvent) => {
        const mousePos = { x: e.clientX, y: e.clientY + window.scrollY };
        // Calculate speed and direction
        const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2));
  
        let ctx = gsap.context(() => {
          // Animate the image holder
          if (currentItem !== null) {
            const maxY = window.scrollY + window.innerHeight - 350;
            const maxX = window.innerWidth - 250;
  
            gsap.to(revealRef.current, {
              x: gsap.utils.clamp(0, maxX, mousePos.x - 110),
              y: gsap.utils.clamp(0, maxY, mousePos.y - 160),
              rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1), // Apply rotation based on speed and direction
              ease: "back.out(2)",
              duration: 1.3,
            });
            gsap.to(revealRef.current, {
              opacity: hovering ? 1 : 0,
              visibility: "visible",
              ease: "power3.out",
              duration: 0.4,
            });
          }
          lastMousePos.current = mousePos;
          return () => ctx.revert(); // cleanup!
        }, component);
      };
      window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [hovering, currentItem]);

  
  const contentImages = items.map((item)=>{
    const image = isFilled.image(item.data.hover_image) ? item.data.hover_image : fallbackItemImage;
    return asImageSrc(image,{
      fit: "crop",
      w: 220,
      h: 320,
      exp: -10
    })
  })
  
  useEffect(()=>{
    contentImages.forEach((url)=>{
      if(!url) return;
      const img = new Image();
      img.src = url;
    })
  }, [contentImages]);

  const onMouseEnter = (index: number)=>{
    setCurrentItem(index);
  }
    const onMouseLeave = ()=>{
      setCurrentItem(null);
    }


    
  return (
    <div ref={component}>
      <ul
      className="grid border-b-4 border-b-slate-800"
      onMouseLeave={onMouseLeave}>
        {items.map((item, index )=>(
            <>
            {isFilled.keyText(item.data.title) && (
          <li 
          key={index} 
          className="list-item opacity-0"
          onMouseEnter={()=> onMouseEnter(index)}
          ref={(el)=>(itemsRef.current[index] = el)}
          >
            
            <Link href={urlPrefix + "/" + item.uid} 
            className="flex flex-col justify-between border-t 
            border-t-slate-400 py-10 text-slate-200 md:flex-row"
            aria-label={item.data.title}>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">{item.data.title}</span>
                <div className="flex gap-3 text-yellow-400 text-lg
                font-bold">
                  {item.tags.map((tag, index) =>(
                    <span key={index}>{tag}</span>
                  ))}
                </div>
              </div>
              <span className="ml-auto flex items-center gap-2
              text-xl font-medium md:ml-0">{viewMoreText}<SiReaddotcv></SiReaddotcv></span>
            </Link>
          </li>
          )}
          </>
          ))}

      {/* Hover Element */}
      <div className="hover-reveal pointer-events-none absolute left-0 top-0 
      -z-10 h-[320px] w-[220px] rounded-lg bg-cover bg-center opacity-0 
      transition-[background] duration-300"
      style={{
        backgroundImage: currentItem !== null  ? `url(${contentImages[currentItem]})`: " ",
      }}
      ref={revealRef}
      ></div>
      </ul>
    </div>
  )
}
