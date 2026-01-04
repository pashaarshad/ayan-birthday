"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

// Types
type CelebrationStage = "dark" | "lights" | "decorated" | "cake" | "celebrate";

interface Balloon {
  id: number;
  left: string;
  delay: number;
  color: string;
  size: number;
}

interface Star {
  id: number;
  left: string;
  top: string;
  delay: number;
  size: "small" | "large" | "";
}

interface Confetti {
  id: number;
  left: string;
  delay: number;
  color: string;
  shape: "square" | "circle" | "ribbon";
}

// ============================================
// 🎂 CUSTOMIZE BIRTHDAY DETAILS HERE 🎂
// ============================================
const BIRTHDAY_PERSON = {
  name: "Ayan",
  // Add your own photo URLs here!
  photos: [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=400&fit=crop", // Party lights
    "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop", // Balloons
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=400&h=400&fit=crop", // Confetti
  ],
  wishMessage: `May this special day bring you endless joy, 
    laughter, and all the happiness your heart can hold! 
    
    You deserve all the wonderful things life has to offer. 
    
    Wishing you a year filled with love, success, and beautiful memories! 
    
    🎉✨🎂 Happy Birthday! 🎂✨🎉`,
};

// Cake image - a beautiful birthday cake
const CAKE_IMAGE = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop";

// Bulb colors for the hanging lights
const BULB_COLORS = ["red", "yellow", "green", "blue", "purple", "pink", "orange", "cyan", "red", "yellow", "green", "blue"];

// Balloon colors
const BALLOON_COLORS = ["b-red", "b-blue", "b-green", "b-yellow", "b-purple", "b-pink", "b-orange"];

// Confetti colors
const CONFETTI_COLORS = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#c44cff", "#ff6b9d", "#ff9f43", "#22d3ee"];

export default function BirthdayCelebration() {
  const [stage, setStage] = useState<CelebrationStage>("dark");
  const [bulbsLit, setBulbsLit] = useState<boolean[]>(new Array(12).fill(false));
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [showCake, setShowCake] = useState(false);
  const [showBirthdayText, setShowBirthdayText] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showWish, setShowWish] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("https://www.soundjay.com/misc/sounds/magic-chime-01.mp3");
      audioRef.current.loop = false;
    }
  }, []);

  // Play magical sound effect
  const playMagicSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => { });
    }
  };

  // Light up bulbs one by one
  const turnOnLights = useCallback(() => {
    playMagicSound();
    setStage("lights");
    BULB_COLORS.forEach((_, index) => {
      setTimeout(() => {
        setBulbsLit((prev) => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, index * 200);
    });
  }, []);

  // Create balloons and stars for decoration
  const decorate = useCallback(() => {
    playMagicSound();
    setStage("decorated");

    // Create balloons
    const newBalloons: Balloon[] = [];
    for (let i = 0; i < 25; i++) {
      newBalloons.push({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        delay: Math.random() * 3,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        size: Math.random() * 0.5 + 0.7,
      });
    }
    setBalloons(newBalloons);

    // Create stars
    const newStars: Star[] = [];
    for (let i = 0; i < 40; i++) {
      newStars.push({
        id: i,
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 70 + 10}%`,
        delay: Math.random() * 2,
        size: ["small", "large", ""][Math.floor(Math.random() * 3)] as "small" | "large" | "",
      });
    }
    setStars(newStars);

    // Create confetti burst
    launchConfetti();
  }, []);

  // Launch confetti explosion
  const launchConfetti = () => {
    const newConfetti: Confetti[] = [];
    for (let i = 0; i < 150; i++) {
      newConfetti.push({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: ["square", "circle", "ribbon"][Math.floor(Math.random() * 3)] as "square" | "circle" | "ribbon",
      });
    }
    setConfetti(newConfetti);

    // Clear confetti after animation
    setTimeout(() => setConfetti([]), 6000);
  };

  // Bring the cake and show birthday text
  const bringCake = useCallback(() => {
    playMagicSound();
    setStage("cake");
    setShowCake(true);

    setTimeout(() => {
      setShowBirthdayText(true);
      launchConfetti();
    }, 1200);
  }, []);

  // Final celebration with gallery and wish
  const celebrate = useCallback(() => {
    playMagicSound();
    setShowBirthdayText(false);
    setShowCake(false);

    setTimeout(() => {
      setShowGallery(true);
    }, 500);

    setTimeout(() => {
      setShowGallery(false);
      setShowWish(true);
      setShowFireworks(true);
      launchConfetti();
    }, 10000);
  }, []);

  // Photo slideshow
  useEffect(() => {
    if (showGallery) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => (prev + 1) % BIRTHDAY_PERSON.photos.length);
        launchConfetti();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [showGallery]);

  // Continuous celebration effects
  useEffect(() => {
    if (showFireworks) {
      const interval = setInterval(() => {
        launchConfetti();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [showFireworks]);

  // Reset everything
  const resetCelebration = () => {
    setStage("dark");
    setBulbsLit(new Array(12).fill(false));
    setBalloons([]);
    setStars([]);
    setConfetti([]);
    setShowCake(false);
    setShowBirthdayText(false);
    setShowGallery(false);
    setShowWish(false);
    setShowFireworks(false);
    setCurrentPhoto(0);
  };

  // Get container class based on stage
  const getContainerClass = () => {
    switch (stage) {
      case "dark": return "celebration-container dark";
      case "lights": return "celebration-container lights-on";
      case "decorated": return "celebration-container decorated";
      case "cake": return "celebration-container cake-time";
      default: return "celebration-container cake-time";
    }
  };

  return (
    <div className={getContainerClass()}>
      {/* Stage Progress Indicator */}
      <div className="stage-indicator">
        {["dark", "lights", "decorated", "cake", "celebrate"].map((s, i) => (
          <div
            key={s}
            className={`stage-dot ${["dark", "lights", "decorated", "cake", "celebrate"].indexOf(stage) >= i
                ? "active"
                : ""
              }`}
            title={s.charAt(0).toUpperCase() + s.slice(1)}
          />
        ))}
      </div>

      {/* Hanging Party Bulbs */}
      <div className="bulbs-container">
        {BULB_COLORS.map((color, index) => (
          <div
            key={index}
            className={`bulb-wrapper ${stage !== "dark" ? "visible" : ""}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="bulb-wire" />
            <div
              className={`bulb ${color} ${bulbsLit[index] ? "lit" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* Floating Balloons */}
      <div className="balloons-container">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className={`balloon ${balloon.color} ${stage !== "dark" && stage !== "lights" ? "floating" : ""}`}
            style={{
              left: balloon.left,
              animationDelay: `${balloon.delay}s`,
              transform: `scale(${balloon.size})`,
            }}
          />
        ))}
      </div>

      {/* Twinkling Stars */}
      <div className="stars-container">
        {stars.map((star) => (
          <div
            key={star.id}
            className={`star ${star.size} ${stage !== "dark" && stage !== "lights" ? "visible" : ""}`}
            style={{
              left: star.left,
              top: star.top,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Confetti Rain */}
      <div className="confetti-container">
        {confetti.map((piece) => (
          <div
            key={piece.id}
            className={`confetti ${piece.shape} falling`}
            style={{
              left: piece.left,
              animationDelay: `${piece.delay}s`,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div>

      {/* Birthday Cake */}
      <div className={`cake-container ${showCake ? "visible" : ""}`}>
        <Image
          src={CAKE_IMAGE}
          alt="Birthday Cake"
          width={280}
          height={280}
          className="cake-image"
          unoptimized
          priority
        />
      </div>

      {/* Happy Birthday Text */}
      <div className={`birthday-text-container ${showBirthdayText ? "visible" : ""}`}>
        <h1 className="happy-birthday-text">Happy Birthday!</h1>
        <h2 className="birthday-name">{BIRTHDAY_PERSON.name} 🎂</h2>
      </div>

      {/* Photo Gallery / Memory Lane */}
      <div className={`gallery-container ${showGallery ? "visible" : ""}`}>
        <div className="photo-frame">
          <Image
            src={BIRTHDAY_PERSON.photos[currentPhoto]}
            alt={`Memory ${currentPhoto + 1}`}
            width={300}
            height={300}
            className="gallery-photo"
            unoptimized
          />
          <div className="floating-hearts">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="heart"
                style={{
                  left: `${10 + i * 15}%`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                ❤️
              </span>
            ))}
          </div>
        </div>
        <p style={{
          color: "#ffd700",
          marginTop: "20px",
          fontFamily: "Dancing Script, cursive",
          fontSize: "1.5rem",
          textShadow: "0 2px 10px rgba(0,0,0,0.5)"
        }}>
          ✨ Beautiful Memories ✨
        </p>
      </div>

      {/* Personal Wish Message */}
      <div className={`wish-container ${showWish ? "visible" : ""}`}>
        <div className="wish-card">
          <h3 style={{
            fontFamily: "Pacifico, cursive",
            fontSize: "2rem",
            color: "#ffd700",
            marginBottom: "20px"
          }}>
            Dear {BIRTHDAY_PERSON.name},
          </h3>
          <p className="wish-text">{BIRTHDAY_PERSON.wishMessage}</p>
          <div style={{ marginTop: "30px", fontSize: "2rem" }}>
            🎈🎁🎊🎉🎂🎉🎊🎁🎈
          </div>
        </div>
      </div>

      {/* Initial Button - Center Screen */}
      {stage === "dark" && (
        <div className="center-button-wrapper fade-in">
          <button className="magic-button lights-button" onClick={turnOnLights}>
            💡 Turn On Lights
          </button>
        </div>
      )}

      {/* Action Buttons - Bottom of Screen */}
      <div className="button-wrapper">
        {stage === "lights" && (
          <button className="magic-button decorate-button fade-in" onClick={decorate}>
            ✨ Decorate
          </button>
        )}

        {stage === "decorated" && (
          <button className="magic-button cake-button fade-in" onClick={bringCake}>
            🎂 Bring The Cake
          </button>
        )}

        {stage === "cake" && showBirthdayText && !showWish && (
          <button className="magic-button celebrate-button fade-in" onClick={celebrate}>
            🎉 Celebrate!
          </button>
        )}

        {showWish && (
          <button
            className="magic-button lights-button fade-in"
            onClick={resetCelebration}
          >
            🔄 Celebrate Again
          </button>
        )}
      </div>
    </div>
  );
}
