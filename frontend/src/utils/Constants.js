// Example constants for CropQ
export const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Workflow", href: "/workflow" }
];

// Features array for navigation and display
export const featuresList = [
    "Disease Detection",
    "Crop Recommendation",
    "Fertilizer Advice"
];

// Features count
export const featuresCount = featuresList.length;
import feature1 from "../Assets/Features/Feature1.webp";
import feature2 from "../Assets/Features/Feature2.webp";
import feature3 from "../Assets/Features/Feature3.webp";
import workflow1 from "../Assets/Workflow/Workflow1.webp";
import workflow2 from "../Assets/Workflow/Workflow2.webp";
import workflow3 from "../Assets/Workflow/Workflow3.webp";
import workflow4 from "../Assets/Workflow/Workflow4.webp";
import workflow5 from "../Assets/Workflow/Workflow5.webp";
import workflow6 from "../Assets/Workflow/Workflow6.webp";
import { Camera, CloudUpload, PcCase } from "lucide-react";

// Features for FeatureSection (Home)
export const features = [
    {
        link: feature1,
        title: "Disease Detection",
        count : 1000,
        description: "Identifies over 1000 plant species with precision."
    },
    {
        link: feature2,
        title: "Crop Recommendation",
        count : "5 Sec",
        description: "Results delivered in under 5 seconds."
    },
    {
        link: feature3,
        count : "90%",
        title: "Fertilizer Advice",
        description: "Boosts a prediction accuracy rate of over 90%"
    }
];

// Features for Workflow page
export const workflowFeatures = [
    {
        image: workflow1,
        icon: Camera,
        link: "/cropidentification",
        text: "Crop Identification",
        instructions: [
           "Capture or select a photo of the crop you want to identify.",
           "Upload the photo to the system for AI analysis.",
           "Receive detailed insights on the crop's species and recommended care practices."
        ]

    },
    {
        image: workflow2,
        icon: CloudUpload,
        link: "/croprecommendation",
        text: "Crop Recommendation",
        instructions: [
            "Input your soil's nitrogen (N), phosphorus (P), and potassium (K) values.",
            "Enter environmental conditions like Temperature, Humidity, Soil pH, and Rainfall.",
            "Receive recommendations for the best crops to grow in your region for maximum yield."
        ]
    },
    {
        image: workflow3,
        icon: PcCase,
        link: "/fertilizerrecommendation",
        text: "Fertilizer Recommendation",
        instructions: [
           "Enter the nitrogen (N), phosphorus (P), and potassium (K) values of your soil.",
           "Provide the soil type and crop details (e.g., type and growth stage).",
           "Receive fertilizer recommendations tailored to your soil and crop's needs for optimal development."
        ]
    },
    {

        image: workflow4,
        icon: CloudUpload,
        link: "/plantdiseaseprediction",
        text: "Plant Disease Prediction",
        instructions: [
            "Upload an image of the plant to detect early signs of disease.",
            "Allow the system to analyze the image for potential plant health issues.",
            "Receive insights and recommendations on how to prevent or treat the identified plant diseases."
        ]
    },
    {

        image: workflow5,
        icon: Camera,
        link: "/weatherreport",
        text: "Weather Report",
        instructions: [
            "Search by city to get the localized weather forecast.",
            "Receive the current weather report, including temperature, humidity, and rainfall data.",
            "Get future weather predictions to help plan your farming activities."
        ]
    },
    {
        image: workflow6,
        icon: PcCase,
        link: "/marketpriceforecasting",
        text: "Market Analysis",
        instructions: [
            "View the predicted future market prices for your crops based on historical trends.",
            "Analyze the system's forecasts on crop market fluctuations.",
            "Decide the best time to sell your crops for maximum profit based on price trends."
        ]
    }
];
// ...existing code...
// Developers list for Contact page
export const developers = [
    {
        name: "Alice Smith",
        role: "Frontend Developer",
        linkedin: "https://linkedin.com/in/alicesmith",
        github: "https://github.com/alicesmith",
        instagram: "https://instagram.com/alicesmith"
    },
    {
        name: "Bob Johnson",
        role: "Backend Developer",
        linkedin: "https://linkedin.com/in/bobjohnson",
        github: "https://github.com/bobjohnson",
        instagram: "https://instagram.com/bobjohnson"
    }
];

// Professions for contact form dropdown
export const contactProfessions = [
    "Farmer",
    "Agronomist",
    "Student",
    "Researcher",
    "Other"
];

// Subjects for contact form dropdown
export const contactSubjects = [
    "General Inquiry",
    "Technical Support",
    "Feedback",
    "Partnership",
    "Other"
];
