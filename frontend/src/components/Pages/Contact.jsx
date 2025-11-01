import React, { useState } from 'react';
import { DigikarshakanAPIs } from '../../utils/DigikarshakanAPIs';
import { notifySuccess, notifyError } from "../../Utils/Toasts";
import { CircleUser, Linkedin, Github, Instagram } from 'lucide-react';
import { developers, contactProfessions, contactSubjects } from "../../Utils/Constants";

const Contact = () => {
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: '',
    profession: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setSending(true);
      try {
        const payload = {
          fullName: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          profession: formData.profession,
        };
    
        const response = await DigikarshakanAPIs.createContact(payload);
        if (response.status === 201) {
          notifySuccess('Message sent successfully.');
          setFormData({
            fullName: '',
            email: '',
            subject: '',
            message: '',
            profession: '',
          }); 
        } else {
          notifyError('Something went wrong. Please try again later.');
        }
      } catch (error) {
        notifyError('An error occurred. Please try again later.');
      } finally {
        setSending(false);
      }
    };
  
  return (
    <div className="max-w-10xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-20">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-6 tracking-wide" data-aos="fade-up" data-aos-delay="300">
          Lets, Meet O
          <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          ur Developers
          </span>
        </h2>
        <div className="flex flex-wrap justify-center gap-20 mt-10 py-10" data-aos="zoom-in" data-aos-delay="300">
          {developers.map((developer, index) => (
            <div
              key={index}
              className="w-full sm:w-5/12 md:w-4/12 lg:w-4/12 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-lg text-center"
              data-aos="zoom-in"
              data-aos-delay={300 + index * 100} 
            >
              <img
                src={developer.photo}
                alt={developer.name}
                loading="lazy"
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
                {developer.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {developer.role}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {developer.email}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-10">
                {developer.phone}
              </p>
              <div className="flex justify-center gap-4">
                {developer.social.portfolio && (
                  <a
                    href={developer.social.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-[#6bc83f] transition"
                  >
                    <div className="flex h-10 w-10 p-2 bg-neutral-200 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full transform hover:scale-110 transition-all duration-300">
                      <CircleUser size={24} />
                    </div>
                  </a>
                )}

                {developer.social.linkedin && (
                  <a
                    href={developer.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-[#6bc83f] transition"
                  >
                    <div className="flex h-10 w-10 p-2 bg-neutral-200 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full transform hover:scale-110 transition-all duration-300">
                    <Linkedin size={24} />
                    </div>
                  </a>
                )}

                {developer.social.github && (
                  <a
                    href={developer.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-[#6bc83f] transition"
                  >
                    <div className="flex h-10 w-10 p-2 bg-neutral-200 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full transform hover:scale-110 transition-all duration-300">
                    <Github size={24} />
                    </div>
                  </a>
                )}

                {developer.social.instagram && (
                  <a
                    href={developer.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-600 dark:text-neutral-400 hover:text-[#6bc83f] transition"
                  >
                    <div className="flex h-10 w-10 p-2 bg-neutral-200 dark:bg-neutral-800 text-custom-green justify-center items-center rounded-full transform hover:scale-110 transition-all duration-300">
                    <Instagram size={24} />
                    </div>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl mt-8 lg:mt-16 tracking-wide text-center mb-10 lg:mb-20">
          Reach Out to Us, We’d Love to He
          <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
            ar From You!
          </span>
        </h2>

        <div className="w-full md:w-10/12 lg:w-8/12 xl:w-6/12 mx-auto p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3">

            <label htmlFor="fullName" className="block font-medium text-gray-700 dark:text-neutral-300">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            />

            <label htmlFor="email" className="block font-medium text-gray-700 dark:text-neutral-300">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            />

            <label htmlFor="profession" className="block font-medium text-gray-700 dark:text-neutral-300">
              Profession
            </label>
            <select
              id="profession"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            >
              {contactProfessions.map((Items, index) => 
                <option key={index} value={Items.value}>{Items.label}</option>
              )}
            </select>

            <label htmlFor="subject" className="block font-medium text-gray-700 dark:text-neutral-300">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            >
              {contactSubjects.map((Items, index) => 
                <option key={index} value={Items.value}>{Items.label}</option>
              )}
            </select>

            <label htmlFor="message" className="block font-medium text-gray-700 dark:text-neutral-300">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Write your message here"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            ></textarea>

            <div className="text-center">
              <button
                type="submit"
                className="py-3 px-6 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md"
              >
                {sending ? 'Sending' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
