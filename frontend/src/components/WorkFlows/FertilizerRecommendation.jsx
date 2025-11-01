import Modal from '../../Utils/Modal';
import React, { useState } from 'react';
import Loading from '../../Utils/Loading';
import { DigikarshakanAPIs } from '../../utils/DigikarshakanAPIs';
import { notifySuccess, notifyError } from "../../Utils/Toasts";

const FertilizerRecommendation = () => {
  const [recommendedFertilizer, setRecommendedFertilizer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAutoFill = async () => {
    setLoading(true);
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude: lat, longitude: lon } = position.coords;

      const response = await DigikarshakanAPIs.getSoilAndWeather({ lat, lon });
      console.log('Soil and Weather API Response:', response); // Debug log

      if (response.success) {
        const { N, P, K } = response.data;

        setFormData({
          N: N ? Math.round(N) : '', // Round to integer
          P: P ? Math.round(P) : '', // Round to integer
          K: K ? Math.round(K) : '', // Round to integer
        });

        notifySuccess('Form auto-filled with soil data (N, P, K). Please verify or adjust values.');
      } else {
        console.warn('API failed, using fallback values:', response.error);
        setFormData({
          N: Math.round(150), // South India avg, rounded
          P: Math.round(30),
          K: Math.round(250),
        });
        notifyError(`Failed to fetch soil data: ${response.error}. Using fallback values.`);
      }
    } catch (error) {
      console.error("Auto-fill error:", error);
      setFormData({
        N: Math.round(150), // South India avg, rounded
        P: Math.round(30),
        K: Math.round(250),
      });
      notifyError('Could not get location data. Please check location permissions. Using fallback values.');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      N: parseFloat(formData.N),
      P: parseFloat(formData.P),
      K: parseFloat(formData.K),
    };

    if (Object.values(payload).some(val => isNaN(val))) {
      setLoading(false);
      notifyError('Please ensure all fields are filled with valid numbers.');
      return;
    }


    try {
      const response = await DigikarshakanAPIs.fertilizerRecommendation(payload);
      setLoading(false);
      if (response.success) {
        setRecommendedFertilizer(response.Fertilizer);
        setIsModalOpen(true);
        notifySuccess('Fertilizer Recommendation Successful.');
        setFormData({
          N: '',
          P: '',
          K: '',
        });
      } else {
        notifyError('Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error("Submit error:", error);
      setLoading(false);
      notifyError('An error occurred. Please try again later.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Fertilizer Recommend
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          ation
        </span>
      </h2>
      <p className="text-center text-neutral-600  dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Recommends the right fertilizers based on soil type, crop needs, and <br />
        growth stage for optimal development.
      </p>

      <div className="w-full md:w-10/12 lg:w-8/12 mx-auto p-6 sm:p-8 bg-white dark:bg-neutral-900 rounded-lg shadow-lg mt-10" data-aos="zoom-in" data-aos-delay="300">
        <p className="text-center text-neutral-600 dark:text-neutral-400 font-normal mb-4">
          Note: Auto-fill provides Nitrogen (N), Phosphorus (P), and Potassium (K) from soil data based on your location. Please verify or adjust values manually.
        </p>

        <div className="text-center mb-4">
          <button
            type="button"
            onClick={handleAutoFill}
            className="py-2 px-4 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md"
          >
            Auto-Fill from Location
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="N" className="block font-medium text-gray-700 dark:text-neutral-300">Nitrogen (N)</label>
          <input
            type="number"
            id="N"
            min="0"
            step="1"
            name="N"
            value={formData.N}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter nitrogen value (e.g., 50)"
          />

          <label htmlFor="P" className="block font-medium text-gray-700 dark:text-neutral-300">Phosphorus (P)</label>
          <input
            type="number"
            id="P"
            min="0"
            step="1"
            name="P"
            value={formData.P}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter phosphorus value (e.g., 30)"
          />

          <label htmlFor="K" className="block font-medium text-gray-700 dark:text-neutral-300">Potassium (K)</label>
          <input
            type="number"
            id="K"
            min="0"
            step="1"
            name="K"
            value={formData.K}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-md dark:bg-neutral-800 dark:border-neutral-700 border-none focus:outline-none focus:border-none"
            placeholder="Enter potassium value (e.g., 40)"
          />

          <div className="text-center">
            <button
              type="submit"
              className="py-3 px-6 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading />}
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        title="Recommended Fertilizer"
        value={recommendedFertilizer}
      />
    </div>
  );
};

export default FertilizerRecommendation;