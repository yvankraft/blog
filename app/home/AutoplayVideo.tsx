"use client";

import { useEffect, useRef } from "react";

export default function AutoplayVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Détecte si la vidéo est visible à au moins 60% sur l'écran
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {}); // Évite les crashs si le navigateur bloque
        } else {
          video.pause();
        }
      },
      { threshold: 0.6 },
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      playsInline
      controls
      className="w-full h-full object-cover" // object-cover remplit le cadre comme TikTok
    />
  );
}
