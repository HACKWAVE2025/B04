import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { workflowFeatures } from "../../Utils/Constants";

const Workflow = () => {
    return (
        <div className="w-screen mx-auto overflow-x-hidden">
            <div className="relative bg-weather-banner overflow-hidden h-[20vh] lg:h-[25vh] rounded-b-[5rem] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <h2
                    id="features"
                    className="relative text-2xl sm:text-3xl lg:text-4xl tracking-wide text-white text-center"
                    data-aos="fade-up"
                    data-aos-delay="100"
                >
                    One Step Solution for All AI-Dri
                    <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                        ven Agriculture Needs
                    </span>
                </h2>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative min-h-[800px] flex flex-wrap mt-10">
                {workflowFeatures.map((feature, index) => (
                    <div
                        key={index}
                        className={`w-full flex flex-col md:flex-row items-center md:items-start mt-5 sm:mt-5 lg:mt-20 mb-5 ${index % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
                            }`}
                        data-aos="fade-up"
                        data-aos-delay={300 + index * 100}
                    >
                        <div className="w-full h-[12rem] lg:h-[22rem] md:w-2/6 mb-4 md:mb-0 flex justify-center items-center">
                            <img
                                src={feature.image}
                                alt="feature"
                                loading="lazy"
                                className="h-full w-full object-cover rounded-lg"
                            />
                        </div>

                        <div className="w-full md:w-4/6 flex flex-col items-center md:items-start px-0 sm:px-2 md:px-7 lg:px-10">
                            <div className="flex items-center mb-4">
                                <div className="flex h-10 w-10 p-2 bg-neutral-200 dark:bg-neutral-900 text-custom-green justify-center items-center rounded-full">
                                    {feature.icon && <feature.icon />}
                                </div>
                                <Link to={feature.link} className="ml-4 text-xl hover:text-custom-green">
                                    {feature.text}
                                </Link>
                            </div>

                            {feature.instructions && feature.instructions.length > 0 &&
                                feature.instructions.map((instruction, index) => (
                                    <p key={index} className="text-md pt-2 ml-10 flex text-neutral-500">
                                        <span className="text-custom-green mr-2"><ChevronDown /></span>
                                        {instruction}
                                    </p>
                                ))
                            }

                            <Link
                                to={feature.link}
                                className="bg-gradient-to-r text-center from-[#6bc83f] to-[#2d511c] hover:from-[#2d511c] hover:to-[#6bc83f] transition-colors duration-300 py-2 px-10 m-10 rounded-md text-white w-full sm:w-auto"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Workflow;
