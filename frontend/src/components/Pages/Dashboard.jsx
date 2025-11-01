import React, { useState } from "react";
import { TaskSection } from "../TaskSection";
import { YieldPredictionSection } from "../YieldPredictionSection";
import { Sprout, Scan, Droplet, Bug, CloudRain, Send } from "lucide-react";
import { DigikarshakanAPIs } from "../../Utils/DigikarshakanAPIs";
import { notifyWarn, notifyError, notifySuccess } from "../../Utils/Toasts";

export default function Dashboard() {
    // -------------------- States --------------------
    const [cropIdSelectedImage, setCropIdSelectedImage] = useState(null);
    const [cropIdLoading, setCropIdLoading] = useState(false);
    const [cropIdUploadedImage, setCropIdUploadedImage] = useState(null);
    const [cropIdResponse, setCropIdResponse] = useState(null);

    const [diseaseSelectedImage, setDiseaseSelectedImage] = useState(null);
    const [diseaseLoading, setDiseaseLoading] = useState(false);
    const [diseaseUploadedImage, setDiseaseUploadedImage] = useState(null);
    const [diseaseResponse, setDiseaseResponse] = useState(null);
    const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);

    const [cropRecLoading, setCropRecLoading] = useState(false);
    const [cropRecommendation, setCropRecommendation] = useState("");

    const [fertRecLoading, setFertRecLoading] = useState(false);
    const [fertRecommendation, setFertRecommendation] = useState("");

    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);

    const [yieldLoading, setYieldLoading] = useState(false);
    const [yieldPrediction, setYieldPrediction] = useState("");

    // -------------------- Crop Identification --------------------
    const handleCropIdentificationImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCropIdSelectedImage(file);
            setCropIdUploadedImage(URL.createObjectURL(file));
            setCropIdResponse(null);
        }
    };

    const handleCropIdentification = async (e) => {
        e?.preventDefault();
        if (!cropIdSelectedImage) return notifyWarn("Please upload a crop image first.");
        setCropIdLoading(true);
        try {
            const response = await DigikarshakanAPIs.cropIdentification(cropIdSelectedImage);
            const data = response?.data ?? response;
            console.log("Crop Identification API Response:", data);

            // Build a friendly, readable output (can be a string or JSX)
            let textNode = "";
            if (typeof data === "string") {
                textNode = data;
            } else if (data?.bestMatch || Array.isArray(data?.results)) {
                textNode = (
                    <div className="text-sm text-left">
                        {data.bestMatch && (
                            <div className="mb-2">
                                <strong>Best match:</strong> {data.bestMatch}
                            </div>
                        )}
                        {Array.isArray(data.results) && data.results.length > 0 && (
                            <div>
                                <strong>Top results:</strong>
                                <ul className="list-disc ml-5 mt-1">
                                    {data.results.slice(0, 5).map((r, i) => (
                                        <li key={i} className="mb-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-semibold">
                                                    {r.scientificName || r.name || r.commonNames?.[0] || "Unknown"}
                                                </span>
                                                {typeof r.score === "number" && (
                                                    <span className="text-xs text-gray-500">
                                                        {(r.score * 100).toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                            {r.commonNames && r.commonNames.length > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    Common: {r.commonNames.join(", ")}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            } else if (data?.result?.name) {
                textNode = data.result.name;
            } else if (data?.prediction) {
                textNode = data.prediction;
            } else if (data?.label) {
                textNode = data.label;
            } else if (Array.isArray(data?.predictions) && data.predictions[0]?.label) {
                textNode = data.predictions[0].label;
            } else {
                textNode = JSON.stringify(data, null, 2);
            }

            setCropIdResponse({ raw: data, text: textNode });
            setCropIdUploadedImage(URL.createObjectURL(cropIdSelectedImage));
            notifySuccess("Crop image analyzed successfully!");
        } catch (error) {
            console.error("Crop identification error:", error);
            
            // Provide specific error messages based on error type
            if (error.message.includes('timeout')) {
                notifyError("Request timed out. The service is taking too long. Please try again.");
            } else if (error.message.includes('network') || error.message.includes('connect')) {
                notifyError("Network error. Please check your internet connection and try again.");
            } else if (error.message.includes('identification service')) {
                notifyError(error.message);
            } else {
                notifyError("Error identifying crop. Please try again with a different image.");
            }
            
            // Clear the response on error
            setCropIdResponse(null);
        } finally {
            setCropIdLoading(false);
        }
    };

    // -------------------- Disease Identification --------------------
    const handleCropDiseaseImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setDiseaseSelectedImage(file);
            setDiseaseUploadedImage(URL.createObjectURL(file));
            setDiseaseResponse(null);
            setDiseaseSuggestions([]);
        }
    };

    const handleCropDiseaseIdentification = async (e) => {
        e?.preventDefault();
        if (!diseaseSelectedImage) {
            notifyWarn("Please upload an image of the diseased leaf first.");
            return;
        }

        setDiseaseLoading(true);
        try {
            const response = await DigikarshakanAPIs.plantDiseasePrediction(diseaseSelectedImage);
            const data = response?.data ?? response;
            console.log("Disease Identification API Response:", data);

            const result = data?.result ?? data;

            const extractFromObj = (obj) => {
                if (!obj) return null;
                if (Array.isArray(obj)) return extractFromObj(obj[0]);
                // detect direct shape like the sample you provided
                if (obj.id || obj.name || obj.scientific_name || obj.probability !== undefined) {
                    return {
                        name: obj.name ?? obj.scientific_name ?? obj.scientificName ?? null,
                        scientific_name: obj.scientific_name ?? obj.scientificName ?? null,
                        score: obj.probability ?? obj.prob ?? obj.confidence ?? obj.score ?? null,
                        details: obj,
                    };
                }
                // common nested keys
                if (obj.disease) return extractFromObj(obj.disease);
                if (obj.predictions) return extractFromObj(obj.predictions);
                if (obj.results) return extractFromObj(obj.results);
                if (obj.outputs) return extractFromObj(obj.outputs);
                // fallback: inspect first child object
                for (const v of Object.values(obj)) {
                    if (typeof v === "object") {
                        const found = extractFromObj(v);
                        if (found) return found;
                    }
                }
                return null;
            };

            const candidate = extractFromObj(result);

            // Build a safe details node (avoid rendering raw objects)
            const buildDetailsNode = (detailObj) => {
                if (!detailObj) return null;
                if (typeof detailObj === "string") return <div className="text-xs text-gray-600 mt-1">{detailObj}</div>;
                // prefer known subfields from your sample
                const commonNames = detailObj.common_names ?? detailObj.commonNames ?? detailObj.common_names;
                const type = detailObj.type ?? null;
                const wiki = detailObj.wiki_url ?? detailObj.details?.wiki_url ?? null;
                const taxonomy = detailObj.taxonomy ?? null;
                const taxonomyFamily = taxonomy?.family ?? null;

                return (
                    <div className="text-xs text-gray-600 mt-1">
                        {Array.isArray(commonNames) && commonNames.length > 0 && <div>Common names: {commonNames.join(", ")}</div>}
                        {typeof commonNames === "string" && <div>Common names: {commonNames}</div>}
                        {type && <div>Type: {type}</div>}
                        {taxonomyFamily && <div>Family: {taxonomyFamily}</div>}
                        {wiki && (
                            <div>
                                <a href={wiki} target="_blank" rel="noreferrer" className="underline">
                                    More info
                                </a>
                            </div>
                        )}
                    </div>
                );
            };

            let parsedNode;
            if (candidate && candidate.name) {
                const sci = candidate.scientific_name ? ` (${candidate.scientific_name})` : "";
                const conf = typeof candidate.score === "number" ? `${(candidate.score * 100).toFixed(2)}%` : null;
                const detailsNode = buildDetailsNode(candidate.details);
                parsedNode = (
                    <div className="text-sm text-left">
                        <div className="mb-1">
                            <strong>Disease:</strong> {candidate.name}
                            {sci}
                        </div>
                        {conf && <div className="text-xs text-gray-500">Confidence: {conf}</div>}
                        {detailsNode}
                    </div>
                );
            } else {
                const topKeys = result && typeof result === "object" ? Object.keys(result).slice(0, 10).join(", ") : String(result);
                parsedNode = (
                    <div className="text-sm text-left">
                        <div className="mb-1 text-yellow-600">No parsed fields matched.</div>
                        <div className="text-xs text-gray-500">Top-level keys: {topKeys || "none"}</div>
                    </div>
                );
            }

            const textNode = (
                <div className="text-sm text-left">
                    {parsedNode}
                    <details className="mt-2 text-xs" style={{ whiteSpace: "pre-wrap" }}>
                        <summary className="cursor-pointer font-medium">View raw response</summary>
                        <pre className="mt-2 max-h-48 overflow-auto text-xs">{JSON.stringify(data, null, 2)}</pre>
                    </details>
                </div>
            );

            setDiseaseResponse({ raw: data, text: textNode });
            setDiseaseUploadedImage(URL.createObjectURL(diseaseSelectedImage));
            notifySuccess("Disease prediction completed successfully!");
        } catch (error) {
            console.error("Disease prediction error:", error);
            notifyError("Error predicting disease. Please try again later.");
        } finally {
            setDiseaseLoading(false);
        }
    };

    // -------------------- Crop Recommendation --------------------
    const handleCropRecommendation = async (e) => {
        e?.preventDefault();
        setCropRecLoading(true);
        try {
            const position = await new Promise((res, rej) =>
                navigator.geolocation.getCurrentPosition(res, rej)
            );
            const { latitude: lat, longitude: lon } = position.coords;

            const soilWeather = await DigikarshakanAPIs.getSoilAndWeather({ lat, lon });
            if (!soilWeather.success)
                throw new Error("Failed to fetch soil/weather data");

            const payload = {
                N: Math.round(soilWeather.data.N || 150),
                P: Math.round(soilWeather.data.P || 30),
                K: Math.round(soilWeather.data.K || 250),
                temperature: soilWeather.data.temperature?.toFixed(1) || "27.0",
                humidity: soilWeather.data.humidity?.toFixed(0) || "70",
                ph: soilWeather.data.ph?.toFixed(1) || "7.2",
                rainfall: soilWeather.data.rainfall?.toFixed(1) || "2.0",
            };

            const response = await DigikarshakanAPIs.cropRecommendation(payload);
            if (response.success) {
                setCropRecommendation(response.recommended_crop);
                notifySuccess("Crop Recommendation Successful!");
            } else {
                notifyError("Failed to get crop recommendation");
            }
        } catch (err) {
            console.error(err);
            notifyError("Could not fetch location or recommend crop. Using fallback.");
            setCropRecommendation("Wheat, Rice, Maize (fallback recommendation)");
        } finally {
            setCropRecLoading(false);
        }
    };

    // -------------------- Fertilizer Recommendation --------------------
    const handleFertilizerRecommendation = async (e) => {
        e?.preventDefault();
        setFertRecLoading(true);
        try {
            const position = await new Promise((res, rej) =>
                navigator.geolocation.getCurrentPosition(res, rej)
            );
            const { latitude: lat, longitude: lon } = position.coords;

            const soil = await DigikarshakanAPIs.getSoilAndWeather({ lat, lon });
            if (!soil.success) throw new Error("Failed to fetch soil data");

            const payload = {
                N: Math.round(soil.data.N || 150),
                P: Math.round(soil.data.P || 30),
                K: Math.round(soil.data.K || 250),
            };

            const response = await DigikarshakanAPIs.fertilizerRecommendation(payload);
            if (response.success) {
                setFertRecommendation(response.Fertilizer);
                notifySuccess("Fertilizer Recommendation Successful!");
            } else notifyError("Failed to get fertilizer recommendation");
        } catch (err) {
            console.error(err);
            notifyError("Could not fetch location or recommend fertilizer");
            setFertRecommendation("Urea, DAP, Potash (fallback recommendation)");
        } finally {
            setFertRecLoading(false);
        }
    };

    // -------------------- Weather Forecast --------------------
    const handleWeatherForecast = async (e) => {
        e?.preventDefault();
        setWeatherLoading(true);
        try {
            const position = await new Promise((res, rej) =>
                navigator.geolocation.getCurrentPosition(res, rej)
            );
            const { latitude: lat, longitude: lon } = position.coords;

            const current = await DigikarshakanAPIs.weatherReport({ lat, lon, type: "current" });
            const forecast = await DigikarshakanAPIs.weatherReport({ lat, lon, type: "forecast" });

            const filtered = forecast.list.filter(
                (item) => new Date(item.dt_txt).getHours() === 6
            );
            setWeatherData(current);
            setForecastData(filtered.slice(1, 4));

            notifySuccess(`Weather data fetched for ${current.name}`);
        } catch (error) {
            console.warn("Weather fetch error:", error);
            notifyWarn("Location access denied. Showing default city (Amaravati).");
            const fallback = await DigikarshakanAPIs.weatherReport({
                type: "current",
                cityName: "Amaravati",
            });
            setWeatherData(fallback);
        } finally {
            setWeatherLoading(false);
        }
    };

    // -------------------- Yield Prediction --------------------
    const handleYieldPrediction = async (e) => {
        e?.preventDefault();
        setYieldLoading(true);
        try {
            // Prepare payload from all available section results
            const payload = {
                crop_recommendation: cropRecommendation || "N/A",
                fertilizer_recommendation: fertRecommendation || "N/A",
                crop_identification: cropIdResponse?.raw || cropIdResponse?.text || "N/A",
                disease_identification: diseaseResponse?.raw || diseaseResponse?.text || "N/A",
                weather_forecast: weatherData
                    ? {
                        location: weatherData.name,
                        temperature: weatherData.main?.temp,
                        condition: weatherData.weather?.[0]?.main,
                        description: weatherData.weather?.[0]?.description,
                    }
                    : "N/A",
            };

            console.log("Yield prediction payload:", payload);

            // Send payload to backend
            const response = await DigikarshakanAPIs.Yieldprediction("http://localhost:3000/yield-prediction", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            console.log("Yield Prediction API response:", response);

            if (response.success) {
                setYieldPrediction(response.explanation);
                notifySuccess("Yield prediction generated!");
            } else {
                throw new Error(response.message || "Prediction failed");
            }
        } catch (error) {
            console.error("Yield prediction error:", error);
            notifyError("Could not generate yield prediction. Try again.");
            setYieldPrediction("Unable to predict yield at this time.");
        } finally {
            setYieldLoading(false);
        }
    };


    // -------------------- Tasks --------------------
    const tasks = [
        {
            title: "Crop Recommendation",
            description: "AI-powered crop suggestions based on soil and climate",
            icon: <Sprout className="w-7 h-7" />,
            buttonText: cropRecLoading ? "Analyzing..." : "Get Recommendation",
            onButtonClick: handleCropRecommendation,
            outputText: cropRecommendation,
            loading: cropRecLoading,
        },
        {
            title: "Crop Identification",
            description: "Identify crop varieties using image recognition",
            icon: <Scan className="w-7 h-7" />,
            buttonText: cropIdLoading ? "Analyzing..." : "Identify Crop",
            onButtonClick: handleCropIdentification,
            showImageInput: true,
            imageInputLabel: "Upload crop image",
            onImageChange: handleCropIdentificationImageChange,
            loading: cropIdLoading,
            uploadedImage: cropIdUploadedImage,
            outputText: cropIdResponse?.text || "", // normalized JSX/string
        },
        {
            title: "Fertilizer Recommendation",
            description: "Customized fertilizer plans for optimal nutrition",
            icon: <Droplet className="w-7 h-7" />,
            buttonText: fertRecLoading ? "Analyzing..." : "Get Plan",
            onButtonClick: handleFertilizerRecommendation,
            loading: fertRecLoading,
            outputText: fertRecommendation,
        },
        {
            title: "Crop Disease Identification",
            description: "Detect and diagnose plant diseases with AI",
            icon: <Bug className="w-7 h-7" />,
            buttonText: diseaseLoading ? "Analyzing..." : "Diagnose Disease",
            onButtonClick: handleCropDiseaseIdentification,
            showImageInput: true,
            imageInputLabel: "Upload diseased leaf image",
            onImageChange: handleCropDiseaseImageChange,
            loading: diseaseLoading,
            uploadedImage: diseaseUploadedImage,
            outputText: diseaseResponse?.text || "",
        },
        {
            title: "Weather Forecast",
            description: "Hyperlocal weather predictions for agriculture",
            icon: <CloudRain className="w-7 h-7" />,
            buttonText: weatherLoading ? "Fetching..." : "View Forecast",
            onButtonClick: handleWeatherForecast,
            loading: weatherLoading,
            outputText: weatherData
                ? `${weatherData.name}: ${Math.round(
                    weatherData.main.temp
                )}°C, ${weatherData.weather[0].main}`
                : "",
        },
        {
            title: "Yield Prediction",
            description: "Yield estimates based on historical and real-time data",
            icon: <Send className="w-7 h-7" />,
            buttonText: yieldLoading ? "Predicting..." : "Get yield report",
            onButtonClick: handleYieldPrediction,
            loading: yieldLoading,
            outputText: yieldPrediction,
        },
    ];

    return (
        <div className="w-screen mx-auto overflow-x-hidden">
            {/* Hero Banner Section */}
            <div className="relative weather-banner overflow-hidden h-[25vh] lg:h-[30vh] rounded-b-[5rem] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                <div className="relative text-center z-10">
                    <h2
                        className="text-2xl sm:text-3xl lg:text-4xl tracking-wide text-white text-center mb-3"
                        data-aos="fade-up"
                        data-aos-delay="100"
                    >
                        Transform Your Agricult
                        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                            ural Practices
                        </span>
                    </h2>
                    <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="150">
                        Harness the power of AI to make smarter decisions about your crops, soil, and farming methods.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="max-w-7xl mx-auto px-6 relative min-h-screen py-10 lg:py-20">
                <h2 
                    className="text-2xl sm:text-3xl lg:text-4xl text-center tracking-wide mb-6"
                    data-aos="fade-up"
                    data-aos-delay="200"
                >
                    AI-Driven Agricultural 
                    <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                        {" "}Solutions
                    </span>
                </h2>
                <p className="text-center text-neutral-600 dark:text-neutral-400 mb-12 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="250">
                    Explore our comprehensive suite of tools designed to optimize your farming operations
                </p>

                {/* First Row - 3 Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-6" data-aos="fade-up" data-aos-delay="300">
                    {tasks.slice(0, 3).map((task, index) => (
                        <div key={task.title} data-aos="zoom-in" data-aos-delay={300 + index * 50}>
                            <TaskSection {...task} />
                        </div>
                    ))}
                </div>

                {/* Second Row - 2 Cards Centered */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-6" data-aos="fade-up" data-aos-delay="450">
                    {tasks.slice(3, 5).map((task, index) => (
                        <div key={task.title} data-aos="zoom-in" data-aos-delay={450 + index * 50}>
                            <TaskSection {...task} />
                        </div>
                    ))}
                </div>

                {/* Third Row - Yield Prediction (Special Premium Card) */}
                <div className="max-w-4xl mx-auto mt-10" data-aos="fade-up" data-aos-delay="550">
                    <div data-aos="zoom-in" data-aos-delay="600">
                        <YieldPredictionSection {...tasks[5]} />
                    </div>
                </div>
            </div>
        </div>
    );
}
