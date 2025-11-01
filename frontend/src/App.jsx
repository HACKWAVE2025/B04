import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, Suspense, lazy } from "react";
import { ToastContainerStyled } from "./Utils/Toasts";
import { HashRouter as Router, Routes, Route} from 'react-router-dom';

// Lazy load components
const Loading = lazy(() => import("./Utils/Loading"));
const Navbar = lazy(() => import("./components/navbar"));
const Footer = lazy(() => import("./components/Footer"));
const Chatbot = lazy(() => import("./components/Chatbox"));
const CallButton = lazy(() => import("./components/CallButton"));
const SiteMap = lazy(() => import("./components/Pages/SiteMap"));
const Contact = lazy(() => import("./components/Pages/Contact"));
const Workflow = lazy(() => import("./components/Pages/Workflow"));
const ScrollHandler = lazy(() => import("./components/ScrollHandler"));
const Developers = lazy(() => import("./components/Pages/Developers"));
const HeroSection = lazy(() => import("./components/Pages/HeroSection"));
const FeatureSection = lazy(() => import("./components/Pages/FeatureSection"));
const Dashboard = lazy(() => import("./components/Pages/Dashboard"));
const WeatherReport = lazy(() => import("./components/WorkFlows/WeatherReport"));
const CropIdentification = lazy(() => import("./components/WorkFlows/CropIdentification"));
const CropRecommendation = lazy(() => import("./components/WorkFlows/CropRecommendation"));
const PlantDiseasePrediction = lazy(() => import("./components/WorkFlows/PlantDiseasePrediction"));
const MarketPriceForecasting = lazy(() => import("./components/WorkFlows/MarketPriceForecasting"));
const FertilizerRecommendation = lazy(() => import("./components/WorkFlows/FertilizerRecommendation"));

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Router
      future={{
        v7_startTransition: true,       
        v7_relativeSplatPath: true,      
      }}
    >
      <Suspense fallback={<Loading />}>
        <ScrollHandler />
        <Navbar />
        <ToastContainerStyled />
        <Routes>
          <Route path="/" element={<HeroSection />} />
          <Route path="/features" element={<FeatureSection />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/workflow" element={<Workflow />} />
          <Route path="/cropidentification" element={<CropIdentification />} />
          <Route path="/croprecommendation" element={<CropRecommendation />} />
          <Route path="/fertilizerrecommendation" element={<FertilizerRecommendation />} />
          <Route path="/plantdiseaseprediction" element={<PlantDiseasePrediction />} />
          <Route path="/weatherreport" element={<WeatherReport />} />
          <Route path="/marketpriceforecasting" element={<MarketPriceForecasting />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <CallButton />
        <Chatbot />
        <Footer />
      </Suspense>
    </Router>
  );
};

export default App;
