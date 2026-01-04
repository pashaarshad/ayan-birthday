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
  // Your personal photos!
  photos: [
    "/5.jpeg",
    "/6.jpeg",
    "/8.jpeg",
    "/2.jpeg",
    "/3.jpeg",
    "/1.jpeg",
    "/4.jpeg",
    "/7.jpeg",
  ],
  wishMessage: `May this special day bring you endless joy, 
    laughter, and all the happiness your heart can hold! 
    
    You deserve all the wonderful things life has to offer. 
    
    Wishing you a year filled with love, success, and beautiful memories! 
    
    🎉✨🎂 Happy Birthday! 🎂✨🎉`,
};


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
  const [showBirthdayText, setShowBirthdayText] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [showWish, setShowWish] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio with local happy birthday music
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/happy-birthday.mp3");
      audioRef.current.loop = true; // Loop the birthday music
      audioRef.current.volume = 0.7; // Set volume to 70%
    }
  }, []);

  // Play birthday music
  const playMusic = () => {
    if (audioRef.current && !audioPlaying) {
      audioRef.current.play().catch(() => { });
      setAudioPlaying(true);
    }
  };

  // Light up bulbs one by one
  const turnOnLights = useCallback(() => {
    setShowNextButton(false);
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
    // Show next button after all bulbs are lit (12 bulbs * 200ms = 2400ms + 500ms buffer)
    setTimeout(() => setShowNextButton(true), 3000);
  }, []);

  // Create balloons and stars for decoration
  const decorate = useCallback(() => {
    setShowNextButton(false);
    playMusic();
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

    // Show next button after decoration animation
    setTimeout(() => setShowNextButton(true), 3000);
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

  // Show birthday text and then celebrate
  const showBirthdayAndCelebrate = useCallback(() => {
    setShowNextButton(false);
    setStage("cake");
    setShowBirthdayText(true);
    launchConfetti();
    // Show next button after text animation
    setTimeout(() => setShowNextButton(true), 2000);
  }, []);

  // Final celebration with gallery and wish
  const celebrate = useCallback(() => {
    setShowNextButton(false);
    setShowBirthdayText(false);
    setCurrentPhoto(0);

    setTimeout(() => {
      setShowGallery(true);
    }, 500);
  }, []);

  // Photo slideshow - 1 second per photo, then show all photos grid
  useEffect(() => {
    if (showGallery && !showAllPhotos) {
      const interval = setInterval(() => {
        setCurrentPhoto((prev) => {
          const next = prev + 1;
          if (next >= BIRTHDAY_PERSON.photos.length) {
            // All photos shown, now show all photos grid
            clearInterval(interval);
            setShowGallery(false);
            setShowAllPhotos(true);
            launchConfetti();
            return prev;
          }
          return next;
        });
      }, 2000); // 2 seconds per photo
      return () => clearInterval(interval);
    }
  }, [showGallery, showAllPhotos]);

  // Continue to wish message
  const showWishMessage = () => {
    setShowAllPhotos(false);
    setSelectedPhoto(null);
    setShowWish(true);
    setShowFireworks(true);
    launchConfetti();
  };

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
    setShowBirthdayText(false);
    setShowGallery(false);
    setShowAllPhotos(false);
    setSelectedPhoto(null);
    setShowWish(false);
    setShowFireworks(false);
    setShowNextButton(false);
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

      {/* Happy Birthday Text */}
      <div className={`birthday-text-container ${showBirthdayText ? "visible" : ""}`}>
        <h1 className="happy-birthday-text">Happy Birthday!</h1>
        <h2 className="birthday-name">{BIRTHDAY_PERSON.name} 🎂</h2>
      </div>

      {/* Photo Gallery / Memory Lane - Single Photo Slideshow */}
      <div className={`gallery-container ${showGallery ? "visible" : ""}`}>
        <div className="photo-frame" style={{ padding: "20px" }}>
          <Image
            src={BIRTHDAY_PERSON.photos[currentPhoto]}
            alt={`Memory ${currentPhoto + 1}`}
            width={500}
            height={500}
            className="gallery-photo"
            style={{ width: "500px", height: "500px", objectFit: "cover" }}
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
          ✨ Memory {currentPhoto + 1} of {BIRTHDAY_PERSON.photos.length} ✨
        </p>
      </div>

      {/* All Photos Grid - After Slideshow */}
      <div className={`gallery-container ${showAllPhotos ? "visible" : ""}`}>
        <h2 style={{
          fontFamily: "Pacifico, cursive",
          fontSize: "2.5rem",
          color: "#ffd700",
          marginBottom: "30px",
          textShadow: "0 0 20px rgba(255,215,0,0.5)"
        }}>
          ✨ Beautiful Memories ✨
        </h2>
        <p style={{ color: "#fff", marginBottom: "20px", fontSize: "1rem" }}>
          Click any photo to view it larger
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          maxWidth: "700px",
          padding: "20px"
        }}>
          {BIRTHDAY_PERSON.photos.map((photo, index) => (
            <div
              key={index}
              onClick={() => setSelectedPhoto(index)}
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
                border: "3px solid rgba(255,215,0,0.5)",
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,215,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 5px 20px rgba(0,0,0,0.4)";
              }}
            >
              <Image
                src={photo}
                alt={`Memory ${index + 1}`}
                width={150}
                height={150}
                style={{ objectFit: "cover", width: "100%", height: "150px" }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={showWishMessage}
          className="magic-button celebrate-button"
          style={{ marginTop: "30px" }}
        >
          💌 See Birthday Wish
        </button>

        {/* Designer Credit */}
        <a
          href="https://arshadpasha.tech"
          target="_blank"
          rel="noopener noreferrer"
          className="designer-credit"
          style={{
            marginTop: "20px",
            color: "#ffd700",
            fontSize: "1.3rem",
            textDecoration: "none",
            fontFamily: "Dancing Script, cursive",
          }}
        >
          ✨ Designed by Arshad ✨
        </a>
      </div>

      {/* Photo Modal - Full View */}
      {selectedPhoto !== null && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "rgba(255,255,255,0.2)",
              border: "2px solid #fff",
              borderRadius: "50%",
              width: "50px",
              height: "50px",
              fontSize: "24px",
              color: "#fff",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            ✕
          </button>
          <Image
            src={BIRTHDAY_PERSON.photos[selectedPhoto]}
            alt={`Memory ${selectedPhoto + 1}`}
            width={300}
            height={300}
            style={{
              objectFit: "contain",
              maxWidth: "90%",
              maxHeight: "80vh",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
            }}
            unoptimized
          />
          <p style={{
            color: "#ffd700",
            marginTop: "20px",
            fontFamily: "Dancing Script, cursive",
            fontSize: "1.5rem"
          }}>
            Memory {selectedPhoto + 1} of {BIRTHDAY_PERSON.photos.length} ❤️
          </p>
        </div>
      )}

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

          {/* Close button to go back to photos */}
          <button
            onClick={() => {
              setShowWish(false);
              setShowFireworks(false);
              setShowAllPhotos(true);
            }}
            className="magic-button decorate-button"
            style={{ marginTop: "30px" }}
          >
            ✕ Close & View Photos
          </button>
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
        {stage === "lights" && showNextButton && (
          <button className="magic-button decorate-button fade-in" onClick={decorate}>
            ✨ Decorate
          </button>
        )}

        {stage === "decorated" && showNextButton && (
          <button className="magic-button cake-button fade-in" onClick={showBirthdayAndCelebrate}>
            🎂 Happy Birthday!
          </button>
        )}

        {stage === "cake" && showBirthdayText && showNextButton && !showWish && (
          <button className="magic-button celebrate-button fade-in" onClick={celebrate}>
            🎉 Celebrate!
          </button>
        )}
      </div>
    </div>
  );
}
