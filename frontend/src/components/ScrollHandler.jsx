import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowScrollToTop(scrollPosition > 700);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 lg:bottom-24 right-5 p-2 lg:p-3 bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-white rounded-full shadow-lg hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 z-50"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <ArrowUp color="white" size={32} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;
