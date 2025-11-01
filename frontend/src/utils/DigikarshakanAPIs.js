// Unified API utility for CropQ frontend
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/workflow'; // Update if backend URL changes

export const DigikarshakanAPIs = {
  // Testimonials (static example)
  getTestimonials: async () => {
    return [
      {
        name: "John Doe",
        feedback: "CropQ helped me detect diseases early and save my crops!"
      },
      {
        name: "Jane Smith",
        feedback: "The recommendations are spot on and easy to follow."
      }
    ];
  },

  // Crop Identification (image upload)
  cropIdentification: async (imageFile) => {
    const formData = new FormData();
    formData.append('images', imageFile);
    const response = await fetch(`${BASE_URL}/identifyCrop`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log("Crop Identification API response :", data);
    return data;
  },

  // Market Price Forecasting
  marketPriceForecasting: async (lat, lng) => {
    const res = await fetch(`${BASE_URL}/marketpriceforecasting?lat=${lat}&lng=${lng}`);
    const data = await res.json();
    return { status: res.status, data };
  },


  getSoilAndWeather: async ({ lat, lon }) => {
    try {
      const res = await fetch(`${BASE_URL}/getSoilAndWeather?lat=${lat}&lon=${lon}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const response = await res.json();
      console.log("Soil and Weather API response:", response);

      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch soil and weather data');
      }

      const { data } = response;
      return {
        success: true,
        data: {
          N: data.N, // Default, as Open-Meteo doesn't provide soil nutrients
          P: data.P, // Default
          K: data.K, // Default
          temperature: data.temperature, // Average of max/min
          humidity: data.humidity || 60, // Use API humidity or default
          ph: data.ph, // Default neutral pH
          rainfall: data.rainfall || 0, // Use precipitation as rainfall
        },
      };
    } catch (error) {
      console.error("Error fetching soil and weather data:", error);
      return { success: false, error: error.message };
    }
  },

  // Crop Recommendation
  cropRecommendation: async (payload) => {
    const res = await axios.post(`${BASE_URL}/croprecommendation`, payload);
    return res.data;
  },

  // Fertilizer Recommendation
  fertilizerRecommendation: async (payload) => {
    const res = await axios.post(`${BASE_URL}/fertilizerrecommendation`, payload);
    return res.data;
  },

  // Plant Disease Prediction (image upload)
  plantDiseasePrediction: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await fetch(`${BASE_URL}/plantdiseaseprediction`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return { status: response.status, data };
  },

  // 🌤️ Weather Report (current or forecast)
  weatherReport: async ({ lat, lon, cityName, type = 'current' }) => {
    const endpoint = type === 'forecast' ? 'weatherforecast' : 'weatherreport';
    let url = `${BASE_URL}/${endpoint}`;

    if (lat && lon) {
      url += `?lat=${lat}&lon=${lon}`;
    } else if (cityName) {
      url += `?cityName=${encodeURIComponent(cityName)}`;
    } else {
      throw new Error("Either lat/lon or cityName is required");
    }

    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      }
    });

    // Handle no-content response (e.g., 304 or empty)
    if (response.status === 304 || response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    return await response.json();
  },

  // Chatbot
  chatBot: async (message) => {
    const response = await fetch(`${BASE_URL}/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      throw new Error('Chatbot API error');
    }
    const data = await response.json();
    // Prefer 'answer' (FastAPI), fallback to 'reply' (backend)
    return data.answer || data.reply;
  },
  // Chatbot with optional image (multipart)
  chatBotWithImage: async (message, imageFile) => {
    const formData = new FormData();
    if (message) formData.append('message', message);
    if (imageFile) formData.append('image', imageFile);

    const response = await fetch(`${BASE_URL}/chatbot`, {
      method: 'POST',
      body: formData,  // No Content-Type header; browser sets multipart boundary
    });

    if (!response.ok) {
      throw new Error('Chatbot API error');
    }

    const data = await response.json();
    // Prefer 'answer' or 'reply' as before
    return data.answer || data.reply || 'No response from bot.';
  },
  Yieldprediction: async (payload) => {
    const res = await axios.post(`${BASE_URL}/yieldprediction`, payload);
    return res.data;
  }
};
