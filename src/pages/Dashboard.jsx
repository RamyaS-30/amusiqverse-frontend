import { useContext, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { AudioContext } from "../context/AudioContext";
import RequestAdminAccess from "./RequestAdminAccess";

export default function Dashboard() {
  //const { user, logout } = useContext(AuthContext);
  const { playTrack, track: currentTrack, isPlaying } = useContext(AudioContext);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [cardsPerView, setCardsPerView] = useState(3); // default desktop
  const [currentIndex, setCurrentIndex] = useState(0);

  /*const handleLogout = () => {
    logout();
    navigate("/login");
  };*/

  const sampleTrack = {
    id: 1,
    title: "Sample Track",
    artist: "Artist Name",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover_url: "https://via.placeholder.com/150",
  };

  const samplePodcast = {
    id: 101,
    title: "Sample Podcast",
    artist: "Podcast Host",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover_url: "https://via.placeholder.com/150",
  };

  // Determine cards per view based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setCardsPerView(3); // desktop
      else if (width >= 640) setCardsPerView(2); // tablet
      else setCardsPerView(1); // mobile
      setCurrentIndex(0);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cards = [
    {
      title: "Your Playlists",
      desc: "Manage and listen to your playlists.",
      buttonText: "Go to Playlists",
      buttonAction: () => navigate("/user/playlists"),
    },
    {
      title: "Recently Played",
      desc: "Resume from where you left off.",
      buttonText: "View History",
      buttonAction: () => navigate("/user/recent"),
    },
    {
      title: "Browse Music",
      desc: "Explore tracks and podcasts.",
      buttonText1: currentTrack?.id === sampleTrack.id && isPlaying ? "Playing ▶️" : "Play Sample Track",
      buttonAction1: () => playTrack(sampleTrack),
      buttonText2: "Music Library",
      buttonAction2: () => navigate("/user/music"),
    },
    {
      title: "Podcasts",
      desc: "Listen to your favorite podcasts.",
      buttonText1: currentTrack?.id === samplePodcast.id && isPlaying ? "Playing ▶️" : "Play Sample Podcast",
      buttonAction1: () => playTrack(samplePodcast),
      buttonText2: "Podcast Library",
      buttonAction2: () => navigate("/user/podcasts"),
    },
  ];

  const maxIndex = cards.length - cardsPerView;

  const scroll = (direction) => {
    let newIndex = currentIndex;
    if (direction === "left") newIndex = Math.max(currentIndex - 1, 0);
    else newIndex = Math.min(currentIndex + 1, maxIndex);
    setCurrentIndex(newIndex);

    if (carouselRef.current) {
      const containerWidth = carouselRef.current.offsetWidth;
      const cardWidth = containerWidth / cardsPerView;
      carouselRef.current.scrollTo({
        left: cardWidth * newIndex,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center py-16 px-4">
      <div className="bg-gray-900 text-white shadow-2xl rounded-3xl w-full max-w-6xl p-8 sm:p-12">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-4 text-center">
          Welcome to AMusiqVerse 🎧
        </h1>
        <p className="text-gray-400 text-center mb-12 sm:mb-16 text-lg sm:text-xl">
          Enjoy your favorite music and podcasts
        </p>

        {/* Carousel */}
        <div className="relative">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            >
              ◀
            </button>
          )}

          {/* Right Arrow */}
          {currentIndex < maxIndex && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
            >
              ▶
            </button>
          )}

          {/* Cards container */}
          <div
            ref={carouselRef}
            className="flex overflow-hidden gap-6 px-4 sm:px-8 lg:px-12"
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="flex-none bg-gray-800 rounded-2xl p-6 flex flex-col items-center text-center hover:bg-green-900 transition duration-300 shadow-lg"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-green-400 mb-3">{card.title}</h2>
                <p className="text-gray-300 text-sm sm:text-base mb-4">{card.desc}</p>

                {card.buttonText1 && (
                  <button
                    onClick={card.buttonAction1}
                    className={`mt-2 px-4 py-2 rounded-lg font-semibold transition
                      ${currentTrack?.id === sampleTrack.id && isPlaying
                        ? "bg-green-600"
                        : "bg-green-400 hover:bg-green-500"
                      }`}
                  >
                    {card.buttonText1}
                  </button>
                )}

                {card.buttonText2 && (
                  <button
                    onClick={card.buttonAction2}
                    className="mt-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                  >
                    {card.buttonText2}
                  </button>
                )}

                {!card.buttonText1 && !card.buttonText2 && (
                  <button
                    onClick={card.buttonAction}
                    className="mt-auto px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition"
                  >
                    {card.buttonText}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <RequestAdminAccess />
    </div>
  );
}
