import { User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DigikarshakanAPIs } from "../../utils/DigikarshakanAPIs";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    DigikarshakanAPIs.getTestimonials()
      .then((response) => {
        if (response) {
          setTestimonials(response);
        }
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 tracking-wide">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-10 lg:mt-20 tracking-wide text-center mb-20">
        What People ar
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          e saying
        </span>
      </h2>

      <div className="relative">
        <div className="overflow-hidden">
          <div className="flex space-x-12 animate-marquee min-h-[200px] hover:pause-marquee">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div
                  key={testimonial._id} 
                  className="bg-neutral-200 dark:bg-neutral-900 rounded-md p-6 text-md  dark:border-neutral-500 shadow-lg flex flex-col h-full min-w-[300px] max-h-[400px]" // Set fixed height for the container
                >
                  <div className="flex-grow">
                    <p className="text-neutral-600 dark:text-neutral-500 font-normal h-[100px] overflow-hidden text-ellipsis">
                      {testimonial.message}
                    </p>
                  </div>
                  <div className="flex items-center mt-6">
                    <div className="flex p-2 bg-neutral-100 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full">
                        <User size={24} />
                    </div>
                    <div className="ml-4">
                      <h5 className="text-custom-green font-normal">
                        {testimonial.fullName}
                      </h5>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">{testimonial.profession}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center w-full h-[200px]">
                <p className="text-center text-neutral-600 dark:text-neutral-400 text-lg font-semibold">
                  No testimonials available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
