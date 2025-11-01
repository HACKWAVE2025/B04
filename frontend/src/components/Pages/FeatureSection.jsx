import { Link } from "react-router-dom";
import { features } from "../../Utils/Constants";
import FeaturesBanner from "../../Assets/Features/FeaturesBanner.webp";
import { ChevronDown, Camera, ArrowRight, CloudUpload, PcCase } from 'lucide-react';

const FeatureSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 relative min-h-[800px]">
      <h2
        className="text-center text-2xl sm:text-3xl lg:text-4xl mt-10 lg:mt-20 tracking-wide"
        data-aos="fade-up"
        data-aos-delay="100"
      >
        Revolutionizing Agriculture with{" "}
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          AI Smart Solutions
        </span>
      </h2>

      <div className="flex justify-center mt-8" data-aos="zoom-in" data-aos-delay="150">
        <img
          src={FeaturesBanner}
          alt="feature_1"
          loading="lazy"
          className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto rounded-lg"
        />
      </div>

      <div className="flex flex-wrap mt-10 lg:mt-20 sm:p-10" data-aos="fade-up" data-aos-delay="300">
        <div className="w-full sm:w-3/5 lg:w-3/5 sm:px-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl tracking-wide">
            How it{" "}
            <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
              Works ?
            </span>
          </h2>
          <div className="mt-5">
            <p className="text-md pt-3 flex text-neutral-500">
              <span className="text-custom-green mr-2"> <ChevronDown /> </span>
              Start by uploading an image of the plant or entering specific parameters.
            </p>
            <p className="text-md pt-1 flex text-neutral-500">
              <span className="text-custom-green mr-2"> <ChevronDown /> </span>
              Initiate the diagnosis process with that data.
            </p>
            <p className="text-md pt-1 flex text-neutral-500">
              <span className="text-custom-green mr-2"> <ChevronDown /> </span>
              Our AI-powered tool analyzes visual and data inputs to recognize the plant’s condition, nutrient needs, and potential issues.
            </p>
            <p className="text-md pt-1 flex text-neutral-500">
              <span className="text-custom-green mr-2"> <ChevronDown /> </span>
              Wait & Get an comprehensive diagnosis report with actionable recommendations tailored to your crops.
            </p>
          </div>
        </div>

        <div className="w-full rounded-lg sm:w-2/5 lg:w-2/5 my-6 py-6 sm:my-6 bg-neutral-200 dark:bg-neutral-900 flex flex-col items-center justify-center" data-aos="fade-up" data-aos-delay="300">
          <div className="w-full flex items-center justify-center" data-aos="fade-up" data-aos-delay="200">
            <div className="w-full sm:w-2/5 lg:w-2/5 flex flex-col items-center mb-6 sm:mb-0">
              <div className="block p-2 text-center">
                <Camera className="flex mx-6 h-10 w-10 p-2 mb-8 bg-neutral-100 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full" />
                <p className="text-neutral-500 font-sm">Take a Picture</p>
              </div>
            </div>
            <ArrowRight className="text-neutral-500"/>
            
            <div className="w-full sm:w-2/5 lg:w-2/5 flex flex-col items-center mb-6 sm:mb-0">
              <div className="block p-2 text-center">
                <CloudUpload className="flex mx-6 h-10 w-10 p-2 mb-8 bg-neutral-100 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full" />
                <p className="text-neutral-500 font-sm">Upload it</p>
              </div>
            </div>
            <ArrowRight className="text-neutral-500"/>
            
            <div className="w-full sm:w-2/5 lg:w-2/5 flex flex-col items-center mb-6 sm:mb-0">
              <div className="block p-2 text-center">
                <PcCase className="flex mx-6 h-10 w-10 p-2 mb-8 bg-neutral-100 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full" />
                <p className="text-neutral-500 font-sm">Get Diagnosis</p>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center mt-6" data-aos="fade-up" data-aos-delay="100">
            <Link
              to="/workflow"
              className="bg-gradient-to-r text-center from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 py-2 px-10 mx-2 rounded-md text-white w-full sm:w-auto"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-20 tracking-wide" data-aos="fade-up" data-aos-delay="300">
         Digi-Karshakan in Ac
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
        tion
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Unlock unparalleled precision, speed, and accuracy with Digi-Karshakan advanced AI-powered tools, <br />
        designed for smarter, more efficient plant care
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-12" >
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center"
            data-aos="zoom-in"
            data-aos-delay={300 + index * 100} 
          >
            <img
              src={feature.link}
              alt="feature"
              loading="lazy"
              className="w-auto h-[8rem] sm:h-[8rem] lg:h-[10rem] mb-4"
            />
            <h5 className="text-2xl font-bold text-custom-green hover:text-custom-green-dark mb-2">
              {feature.count}
            </h5>
            <p className="text-[18px] p-3 flex text-neutral-500">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FeatureSection;