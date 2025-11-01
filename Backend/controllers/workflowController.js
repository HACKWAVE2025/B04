const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();
const NodeGeocoder = require('node-geocoder');

// Load South India soil data from JSON file
let southIndiaSoilData = [];
try {
  const filePath = path.join(__dirname, 'south_india_soil_data.json');
  const rawData = fs.readFileSync(filePath, 'utf8');
  southIndiaSoilData = JSON.parse(rawData);
  console.log(`Loaded ${southIndiaSoilData.length} soil records from file.`);
} catch (err) {
  console.error('Failed to load soil data file:', err.message);
  southIndiaSoilData = []; // Fallback to empty, use averages
}

// Manual mappings for common mandal/district variations
const districtMappings = {
  'gandipet mandal': 'Rangareddy',
  'gandipet': 'Rangareddy',
  // Add more as needed
};

// Weather forecast
exports.getWeatherForecast = async (req, res) => {
  try {
    const { cityName, lat, lon } = req.query;

    let params = {
      appid: process.env.WEATHER_API_KEY,
      units: 'metric',
    };

    if (cityName) {
      params.q = cityName;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get('http://api.openweathermap.org/data/2.5/forecast', { params });
    res.json(response.data);
  } catch (error) {
    console.error("Weather Forecast Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data?.message || 'Error fetching weather forecast' });
  }
};

// Identify crop
exports.identifyCrop = async (req, res) => {
  try {
    const imageFile = req.file;
    
    if (!imageFile) {
      console.error("❌ No image file received.");
      return res.status(400).json({ 
        error: "Image is required and must be uploaded as 'images' field."
      });
    }

    console.log("✅ Image received:", {
      filename: imageFile.originalname,
      mimetype: imageFile.mimetype,
      size: imageFile.size
    });

    // Validate image type
    if (!imageFile.mimetype.startsWith('image/')) {
      return res.status(400).json({ 
        error: "Only image files are allowed",
        receivedType: imageFile.mimetype
      });
    }

    // Validate file size (Plant.id recommends max 1500px, ~2MB)
    if (imageFile.size > 10 * 1024 * 1024) {
      return res.status(400).json({ 
        error: "Image size too large. Maximum 10MB allowed.",
        receivedSize: `${(imageFile.size / 1024 / 1024).toFixed(2)}MB`
      });
    }

    // Check API key
    if (!process.env.PLANTID_API_KEY) {
      return res.status(500).json({ 
        error: "Plant.id API key not configured. Please set PLANTID_API_KEY in .env file"
      });
    }

    console.log("📡 Calling Plant.id API...");

    // Convert image buffer to base64 (Plant.id requires base64 encoded images)
    const base64Image = imageFile.buffer.toString('base64');
    const base64DataUri = `data:${imageFile.mimetype};base64,${base64Image}`;

    // Make request to Plant.id API
    const response = await axios.post(
      'https://api.plant.id/v2/identify',
      {
        images: [base64DataUri],
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: [
          "common_names",
          "taxonomy",
          "url",
          "wiki_description",
          "synonyms"
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.PLANTID_API_KEY
        },
        timeout: 30000
      }
    );

    console.log("✅ Plant.id API responded successfully");

    // Parse and format the response
    if (!response.data || !response.data.suggestions || response.data.suggestions.length === 0) {
      return res.status(404).json({
        error: "No plants identified in the image",
        message: "Try uploading a clearer image of the plant"
      });
    }

    const suggestions = response.data.suggestions.slice(0, 5);
    
    const results = suggestions.map((suggestion) => ({
      plantName: suggestion.plant_name,
      scientificName: suggestion.plant_details?.scientific_name || suggestion.plant_name,
      commonNames: suggestion.plant_details?.common_names || [],
      taxonomy: {
        class: suggestion.plant_details?.taxonomy?.class,
        genus: suggestion.plant_details?.taxonomy?.genus,
        order: suggestion.plant_details?.taxonomy?.order,
        family: suggestion.plant_details?.taxonomy?.family,
        phylum: suggestion.plant_details?.taxonomy?.phylum,
        kingdom: suggestion.plant_details?.taxonomy?.kingdom
      },
      probability: suggestion.probability,
      confirmed: suggestion.confirmed,
      similarImages: suggestion.similar_images?.slice(0, 3).map(img => ({
        id: img.id,
        url: img.url,
        similarity: img.similarity,
        urlSmall: img.url_small
      })) || [],
      wikiDescription: suggestion.plant_details?.wiki_description?.value,
      wikiUrl: suggestion.plant_details?.url,
      synonyms: suggestion.plant_details?.synonyms || []
    }));

    res.json({
      source: "Plant.id",
      customId: response.data.custom_id,
      bestMatch: results[0]?.plantName,
      results: results,
      isPlant: response.data.is_plant,
      isPlantProbability: response.data.is_plant_probability
    });

  } catch (error) {
    console.error("❌ Plant.id API error:", error.response?.data || error.message);
    
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 401) {
        return res.status(401).json({
          error: "Invalid API key",
          message: "Please check your PLANTID_API_KEY in .env file",
          details: errorData
        });
      } else if (status === 402) {
        return res.status(402).json({
          error: "Payment required",
          message: "You've reached your API usage limit. Please upgrade your plan.",
          details: errorData
        });
      } else if (status === 429) {
        return res.status(429).json({
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
          details: errorData
        });
      } else {
        return res.status(status).json({
          error: "Plant.id API error",
          message: errorData?.message || "An error occurred during plant identification",
          details: errorData
        });
      }
    } else if (error.code === 'ECONNRESET' || error.code === 'ECONNABORTED') {
      return res.status(503).json({
        error: "Connection error",
        message: "Failed to connect to Plant.id API. Please try again.",
        code: error.code
      });
    } else if (error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        error: "Timeout error",
        message: "Request took too long. Please try with a smaller image.",
        code: error.code
      });
    } else {
      return res.status(500).json({
        error: "Internal server error",
        message: error.message
      });
    }
  }
};

// Forecast market prices
const geocoder = NodeGeocoder({ provider: "openstreetmap" });

exports.getCropPrices = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: "lat and lng are required" });
    }

    const geoRes = await geocoder.reverse({ lat: Number(lat), lon: Number(lng) });
    const stateName = geoRes?.[0]?.state;
    const districtName = geoRes?.[0]?.administrativeLevels?.level2long || geoRes?.[0]?.district || geoRes?.[0]?.county;

    if (!districtName && !stateName) {
      return res.status(404).json({ error: "Could not determine location (state or district)" });
    }

    const apiKey = "579b464db66ec23bdd000001589805442e8f4d746168b7f2582b0d2e";
    let apiUrl = `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${apiKey}&format=json&limit=300&filters%5BArrival_Date%5D=19%2F09%2F2025`;

    if (districtName) {
      apiUrl += `&filters%5BDistrict%5D=${encodeURIComponent(districtName)}`;
    } else if (stateName) {
      apiUrl += `&filters%5BState%5D=${encodeURIComponent(stateName)}`;
    }
    console.log('Resolved location:', { stateName, districtName });
    console.log(`Fetching market prices for ${districtName || stateName} from ${apiUrl}`);
    const response = await axios.get(apiUrl);
    res.json({ data: response.data });
  } catch (error) {
    console.error("Market Price Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || "Error fetching market price data",
    });
  }
};

// Soil and Weather (with file-based South India NPK data)
exports.getSoilAndWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const latitude = Number(lat);
    const longitude = Number(lon);
    if (isNaN(latitude) || latitude < -90 || latitude > 90 || isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({ error: 'Invalid latitude or longitude' });
    }

    const baseOpenMeteo = 'https://api.open-meteo.com/v1';
    const soilParams = {
      latitude,
      longitude,
      hourly: 'soil_temperature_0cm,soil_moisture_0_to_1cm,relative_humidity_2m',
    };
    const forecastParams = {
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      timezone: 'auto',
    };

    // Fetch Open-Meteo data
    console.log('📡 Sending to Open-Meteo:', { soilParams, forecastParams });
    let soilResp, forecastResp;
    try {
      [soilResp, forecastResp] = await Promise.all([
        axios.get(`${baseOpenMeteo}/forecast`, { params: soilParams }),
        axios.get(`${baseOpenMeteo}/forecast`, { params: forecastParams }),
      ]);
    } catch (err) {
      console.error('Open-Meteo API failed:', err.response?.status, err.response?.data || err.message);
      throw new Error('Failed to fetch weather data from Open-Meteo');
    }

    // Validate Open-Meteo responses
    if (soilResp.status !== 200 || !soilResp.data?.hourly) {
      console.error('Invalid soil response:', soilResp.data);
      throw new Error('Invalid soil data from Open-Meteo');
    }
    if (forecastResp.status !== 200 || !forecastResp.data?.daily) {
      console.error('Invalid forecast response:', forecastResp.data);
      throw new Error('Invalid forecast data from Open-Meteo');
    }

    // Extract weather data with fallbacks
    const temperatureMax = forecastResp.data.daily.temperature_2m_max?.[0] || 27; // Hyderabad avg
    const temperatureMin = forecastResp.data.daily.temperature_2m_min?.[0] || 27;
    const rainfall = forecastResp.data.daily.precipitation_sum?.[0] || 2; // Hyderabad avg
    const temperature = (temperatureMax + temperatureMin) / 2;

    console.log('Open-Meteo extracted:', {
      soil_temperature: soilResp.data.hourly.soil_temperature_0cm?.[0],
      soil_moisture: soilResp.data.hourly.soil_moisture_0_to_1cm?.[0],
      humidity: soilResp.data.hourly.relative_humidity_2m?.[0],
      temperature,
      rainfall,
    });

    // Fetch NPK from file-based South India data
    let npkData = { N: 85, P: 58, K: 41, ph: 6.5 }; // South India averages as defaults
    try {
      // Reverse geocode to get state and district (using Nominatim)
      const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1&zoom=10`, {
        headers: { 'User-Agent': 'Digi-karshakan/1.0 alnimmals2431@gmail.com' } // Replace with your email
      });
      const state = geoRes.data.address?.state;
      let district = geoRes.data.address?.county || geoRes.data.address?.city_district || geoRes.data.address?.state_district || geoRes.data.address?.city;
      if (!state || !district) {
        throw new Error('Could not determine state or district');
      }

      // Apply manual mappings for mandals/sub-districts
      const lowerDistrict = district.toLowerCase();
      if (districtMappings[lowerDistrict]) {
        district = districtMappings[lowerDistrict];
        console.log(`Mapped "${lowerDistrict}" to "${district}"`);
      }

      console.log('Detected state:', state, 'district:', district);

      // Match in loaded data (case-insensitive)
      const record = southIndiaSoilData.find(r =>
        r.state.toLowerCase() === state.toLowerCase() &&
        (r.district.toLowerCase() === district.toLowerCase() ||
          district.toLowerCase().includes(r.district.toLowerCase()) ||
          r.district.toLowerCase().includes(district.toLowerCase()))
      );

      if (record) {
        npkData = {
          N: (record.N || 150) * 0.2, // kg/ha to mg/kg
          P: (record.P || 30) * 0.2,
          K: (record.K || 250) * 0.2,
          ph: record.ph || 7.2,
        };
        console.log('Matched soil data:', npkData);
      } 
    } catch (err) {
      console.warn('Geocoding or matching failed, using South India averages:', err.message);
      // Continue with defaults
    }

    res.json({
      success: true,
      data: {
        N: npkData.N,
        P: npkData.P,
        K: npkData.K,
        ph: npkData.ph,
        soil_temperature: soilResp.data.hourly.soil_temperature_0cm?.[0] || 25, // Fallback
        soil_moisture: soilResp.data.hourly.soil_moisture_0_to_1cm?.[0] || 0.2, // Fallback
        humidity: soilResp.data.hourly.relative_humidity_2m?.[0] || 70, // Fallback
        temperature: temperature,
        rainfall: rainfall * 100, // Convert m to mm
      },
    });
  } catch (err) {
    console.error('❌ API call failed:', err.response?.status || 500, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      error: err.response?.data?.error || err.message,
      data: {
        N: 150,
        P: 30,
        K: 250,
        ph: 7.2,
        soil_temperature: 25,
        soil_moisture: 0.2,
        humidity: 70,
        temperature: 27, // Fallback for Hyderabad
        rainfall: 2, // Fallback for Hyderabad
      },
    });
  }
};

// Crop recommendation
exports.cropRecommendation = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, error: 'Payload is required' });
    }

    // Flask API expects { data: { N, P, K, ... } } format
    const flaskPayload = { data: payload };

    const response = await axios.post(
      'http://10.10.180.67:5000/recommend',
      flaskPayload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json({
      success: true,
      recommended_crop: response.data.recommended_crop,
      // recommended_crop: "Paddy",
    });
  } catch (error) {
    console.error("Crop Recommendation Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Error fetching crop recommendation',
    });
  }
};

// Fertilizer recommendation
exports.fertilizerRecommendation = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, error: 'Payload is required' });
    }

    const response = await axios.post(
      'http://127.0.0.1:5001/fertilizer_recommendation',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    res.json({
      success: true,
      Fertilizer: response.data.Fertilizer,
      // Fertilizer: "Urea",
    });
    console.log('Fertilizer Recommendation Response:', response.data);
  } catch (error) {
    console.error("Fertilizer Recommendation Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Error fetching fertilizer recommendation',
    });
  }
};

// Plant disease prediction
exports.plantDiseasePrediction = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const base64Image = file.buffer.toString('base64');
    const payload = {
      images: [base64Image],
      similar_images: true,
    };

    const response = await axios.post(
      'https://crop.kindwise.com/api/v1/identification',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.KINDWISE_API_KEY,
        },
        params: {
          details: 'type,common_names,eppo_code,wiki_url,taxonomy',
          language: 'en',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Plant Disease Prediction Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error predicting plant disease',
    });
  }
};
// Weather report
exports.getWeatherReport = async (req, res) => {
  try {
    const { cityName, lat, lon } = req.query;

    let params = {
      appid: process.env.WEATHER_API_KEY,
      units: 'metric',
    };

    if (cityName) {
      params.q = cityName;
    } else {
      params.lat = lat;
      params.lon = lon;
    }

    const response = await axios.get('http://api.openweathermap.org/data/2.5/weather', { params });
    res.json(response.data);
  } catch (error) {
    console.error("Weather Report Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error fetching weather report',
    });
  }
};

// Chatbot
exports.chatBot = async (req, res) => {
  try {
    console.log("Chatbot request body:", req.file);

    const { message } = req.body;
    const image = req.file;

    if (typeof message !== "string" || !message.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Missing or invalid 'message' in request body." });
    }

    // ✅ Create a FormData object
    const formData = new FormData();
    formData.append("question", message);
    formData.append("session_id", ""); // or pass real session id if you have one
    formData.append("model", "llama-3.3-70b-versatile");

    if (image && image.buffer) {
      // Append the image as a file (Multer gives buffer)
      formData.append("imageFile", image.buffer, image.originalname);
    }

    // ✅ Send to FastAPI
    const response = await axios.post("http://localhost:8000/chat", formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    res.json({
      success: true,
      reply: response.data.answer,
    });
  } catch (error) {
    console.error("Chatbot integration error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.detail || "Chatbot service unavailable",
    });
  }
};
exports.yieldPrediction = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ success: false, error: 'Payload is required' });
    }

    // Build a dynamic prompt with all provided section responses
    let prompt = 'Based on the following agricultural data from various sections, provide a brief explanation of what is happening overall, including potential yield implications, risks, and recommendations. Keep it concise, under 150 words.\n\n';

    // Dynamically add sections if they exist in the payload
    if (payload.cropRecommendation) {
      prompt += `Crop Recommendation: ${payload.cropRecommendation}\n`;
    }
    if (payload.cropIdentification) {
      prompt += `Crop Identification: ${JSON.stringify(payload.cropIdentification)}\n`;
    }
    if (payload.fertilizerRecommendation) {
      prompt += `Fertilizer Recommendation: ${payload.fertilizerRecommendation}\n`;
    }
    if (payload.diseaseIdentification) {
      prompt += `Disease Identification: ${JSON.stringify(payload.diseaseIdentification)}\n`;
    }
    if (payload.weatherData) {
      prompt += `Weather Data: ${JSON.stringify(payload.weatherData)}\n`;
    }
    if (payload.forecastData && Array.isArray(payload.forecastData)) {
      prompt += `Forecast Data: ${JSON.stringify(payload.forecastData)}\n`;
    }
    if (payload.soilData) {
      prompt += `Soil Data: ${JSON.stringify(payload.soilData)}\n`;
    }
    // Add more sections as needed (e.g., market prices, etc.)

    prompt += '\nRespond as an agricultural expert.Analyse all the results and provide insights to provide a brief explanation.';

    // Call the LLM (using OpenRouter)
    const llmResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.HTTP_REFERER || '',
          'X-Title': 'YieldExplanation',
        },
      }
    );

    const explanation = llmResponse.data.choices[0].message.content;
    console.log('Yield Prediction Explanation:', explanation);
    res.json({
      success: true,
      explanation,
    });
  } catch (error) {
    console.error("Yield Prediction Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Error generating yield explanation',
    });
  }
};
