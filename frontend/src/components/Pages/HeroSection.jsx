import { Link } from "react-router-dom";
import leaf from "../../Assets/Leaf.webp";
import Testimonials from "./Testimonials";
import FeatureSection from "./FeatureSection";

const HeroSection = () => {
  return (
    <div>
      <div className="home-banner flex items-center justify-center min-h-screen overflow-hidden mt-[-4rem]">
        <div className="text-center px-4 sm:px-8 md:px-16 mb-20 relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[111px] xl:text-8x font-extrabold font-[Montserrat] text-[#6bc83f] max-w-4xl mx-auto relative animate-zoom-in delay-150">
            Digi-Karshakan
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[20%] right-[10%] w-[15%] sm:w-[20%] md:w-[15%] opacity-100 animate-leaf-fall"
            />
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[40%] left-[35%] w-[10%] sm:w-[15%] md:w-[10%] opacity-100 animate-leaf-fall delay-150"
            />
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[2%] left-[-30%] w-[15%] sm:w-[20%] md:w-[15%] opacity-100 animate-leaf-fall delay-200"
            />
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[18%] left-[-22%] w-[10%] sm:w-[15%] md:w-[10%] opacity-100 animate-leaf-fall delay-200"
            />
            <img
              src={leaf}
              loading="lazy"
              alt="Leaf"
              className="absolute top-[50%] left-[-22%] w-[10%] sm:w-[15%] md:w-[10%] opacity-100 animate-leaf-fall delay-200"
            />
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[20%] right-[10%] w-[10%] sm:w-[15%] md:w-[10%] opacity-100 animate-leaf-fall delay-200"
            />
            <img
              src={leaf}
              alt="Leaf"
              loading="lazy"
              className="absolute top-[50%] right-[-30%] w-[15%] sm:w-[20%] md:w-[25%] opacity-100 animate-leaf-fall delay-200"
            />
          </h1>
          <p className="text-xl max-w-4xl mx-auto animate-zoom-in delay-300 text-[#fff]">
            Empowering Smarter Agriculture with
            <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
              {" "}AI-Driven Insights
            </span>
          </p>
          <div className="flex justify-center mt-6 flex-wrap">
            <Link to="/workflow"
              className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 py-2 px-3 mx-2 rounded-md text-white animate-zoom-in delay-350"
          
            >
              Try  Digi-Karshakan
            </Link>
          </div>
        </div>
      </div>
      <FeatureSection />
      <Testimonials />
    </div>
  );
};
export default HeroSection;
