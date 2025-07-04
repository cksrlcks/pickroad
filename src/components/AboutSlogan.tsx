"use client";

import { useGSAP } from "@gsap/react";
import { RefObject, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Logo from "@/assets/img/logo.svg";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const SLOGAN_SCENES = [
  {
    title: "Don’t let your links fade away.",
    background_color: "#000000",
    font_color: "#1CD82C",
    theme: "dark",
  },
  {
    title: "No words needed.",
    background_color: "#000000",
    font_color: "#1CD82C",
    theme: "dark",
  },
  {
    title: "Your picks explain everything.",
    background_color: "#f8f9fa",
    font_color: "#000000",
    theme: "light",
  },
];

const TEXT_STAGGER = 0.1;
const TEXT_DURATION = 1;
const TEXT_SHOW_DELAY = 0.5;
const TEXT_SLIDING_DISTANCE = 80;
const HEADING_SLIDING_DISTANCE = 100;
const TITLE_DURATION = 0.8;
const SCENE_REPEAT_DELAY = 2;
const TITLE_EXIT_DISTANCE_RATIO = 0.1;
const SPAN_DELAY = 0.4;
const TITLE_START_OFFSET = "-=1.4";
const SCENE_SHOW_OFFSET = "-=0.6";
const ANIMATION_EASE = "power2.out";

const addScene = (
  tl: RefObject<gsap.core.Timeline | null>,
  index: number,
  total: number,
) => {
  const sceneClass = `.scene-${index + 1}`;
  const title = `${sceneClass} .title`;
  const spans = `${sceneClass} span`;

  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (!isFirst) {
    tl.current!.to(sceneClass, { opacity: 1, duration: 0 }, SCENE_SHOW_OFFSET);
  }

  tl.current!.from(
    title,
    {
      y: HEADING_SLIDING_DISTANCE,
      duration: TITLE_DURATION,
    },
    isFirst ? undefined : TITLE_START_OFFSET,
  )
    .from(
      spans,
      {
        y: TEXT_SLIDING_DISTANCE,
        duration: TEXT_DURATION,
        ease: ANIMATION_EASE,
        stagger: TEXT_STAGGER,
        delay: !isFirst ? SPAN_DELAY : 0,
      },
      "<",
    )
    .to(
      spans,
      {
        opacity: 1,
        duration: 0,
        stagger: TEXT_STAGGER,
        delay: TEXT_DURATION * TEXT_SHOW_DELAY,
      },
      "<",
    );

  if (!isLast) {
    tl.current!.to(title, {
      y: -HEADING_SLIDING_DISTANCE * TITLE_EXIT_DISTANCE_RATIO,
      ease: ANIMATION_EASE,
      duration: TITLE_DURATION,
      delay: SCENE_REPEAT_DELAY,
    });
  }
};

type AboutSloganProps = {
  className?: string;
};

export default function AboutSlogan({ className }: AboutSloganProps) {
  const container = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPTimeline>(null);

  useGSAP(
    () => {
      tl.current = gsap.timeline({
        repeat: -1,
        repeatDelay: SCENE_REPEAT_DELAY,
      });

      SLOGAN_SCENES.forEach((_, index) => {
        addScene(tl, index, SLOGAN_SCENES.length);
      });
    },

    { scope: container },
  );

  return (
    <section
      className={cn(
        "relative mb-10 aspect-video overflow-hidden backface-hidden",
        className,
      )}
      ref={container}
    >
      {SLOGAN_SCENES.map((scene, index) => (
        <div
          key={index}
          className={`scene scene-${index + 1} absolute top-0 left-0 h-full w-full p-8 lg:p-12 ${index > 0 ? "opacity-0" : ""}`}
          style={{
            backgroundColor: scene.background_color,
            color: scene.font_color,
          }}
        >
          <h3 className="title flex max-w-[90%] flex-wrap gap-[0.2em] text-[8vw] leading-[100%] font-bold tracking-tight min-[848px]:text-7xl">
            {scene.title.split(" ").map((word, idx) => (
              <span key={`word-${idx}`} className="opacity-0">
                {word}
              </span>
            ))}
          </h3>
          <Image
            src={Logo}
            alt="Pick Road"
            className={cn(
              "absolute bottom-8 left-8 h-4 w-auto md:h-auto",
              scene.theme === "dark" && "invert",
            )}
          />
        </div>
      ))}
    </section>
  );
}
