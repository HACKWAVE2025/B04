import Loading from '../../Utils/Loading';
import { DigikarshakanAPIs } from '../../utils/DigikarshakanAPIs';
import React, { useState, useEffect } from 'react';
import { notifyWarn } from "../../Utils/Toasts";
import { Search, MapPin, ThermometerSun, Waves, Dam, Sunrise, Sunset, ShowerHead } from 'lucide-react';

const WeatherReport = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [city, setCity] = useState('Amaravati');
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

const fetchWeatherData = async (cityName = '') => {
  try {
    setLoading(true);

    if (cityName.trim()) {
      // If user entered a city manually
      const response = await DigikarshakanAPIs.weatherReport({ type: 'current', cityName });
      setWeatherData(response);

      const forecast = await DigikarshakanAPIs.weatherReport({ type: 'forecast', cityName });
      const filteredData = forecast.list.filter(item => new Date(item.dt_txt).getHours() === 6);
      setForecastData(filteredData.slice(1, 4));
      setLoading(false);
    } else if (navigator.geolocation) {
      // Use geolocation if no manual input
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const response = await DigikarshakanAPIs.weatherReport({ lat, lon, type: 'current' });
        setWeatherData(response);

        const forecast = await DigikarshakanAPIs.weatherReport({ lat, lon, type: 'forecast' });
        const filteredData = forecast.list.filter(item => new Date(item.dt_txt).getHours() === 6);
        setForecastData(filteredData.slice(1, 4));
        setLoading(false);
      }, (error) => {
        console.warn("Geolocation error:", error);
        notifyWarn("Location access denied. Showing default city.");
        fetchWeatherData('Amaravati'); // fallback
      });
    } else {
      notifyWarn("Geolocation not supported. Showing default city.");
      fetchWeatherData('Amaravati');
    }
  } catch (error) {
    console.error("Weather API error:", error);
    notifyWarn('Unable to fetch weather data. Try another city or check connection.');
    setLoading(false);
  }
};

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      fetchWeatherData(inputValue);
      setCity(inputValue);
      setInputValue('');
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000).toLocaleString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
    return date.replace('am', 'AM').replace('pm', 'PM');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 text-center">
      {loading && <Loading />}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Weather Rep
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
        ort
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Provides localized weather forecasts to help plan farming activities, including <br />
        temperature, humidity, and rainfall predictions.
      </p>
      
      {weatherData && (
        <div className="weather-banner mt-10 p-6 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg dark:bg-gray-800 text-neutral-100 dark:text-neutral-100">
          <div className="flex justify-center items-center mb-6" data-aos="fade-up" data-aos-delay="300">
            <div className="relative w-3/4 sm:w-1/2 lg:w-1/3">
              <input
                type="text"
                className="w-full p-3 pl-10 border rounded-full focus:outline-none bg-transparent bg-gray-100 bg-opacity-10 placeholder-neutral-100"
                placeholder="Enter city name and press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleSearch}
              />
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-neutral-100" size={20} />
            </div>
          </div>

          <h3 className="text-2xl font-semibold flex justify-center items-center" data-aos="zoom-in" data-aos-delay="300">
            <MapPin className="mr-2" />
            {weatherData.name}, {weatherData.sys.country}
          </h3>
          <p className="text-sm" data-aos="zoom-in" data-aos-delay="200">{formatDate(weatherData.dt)}</p>
          <div className="flex justify-center items-center mt-4" data-aos="zoom-in" data-aos-delay="100">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              loading="lazy"
              alt={weatherData.weather[0].description}
            />
            <span className="text-6xl font-bold">{Math.round(weatherData.main.temp)}° C</span>
          </div>
          <p className="text-lg font-medium capitalize" data-aos="zoom-in" data-aos-delay="100">{weatherData.weather[0].main}</p>

          <div className="mt-6 flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-4 text-left">
            <div className="w-full lg:w-3/12 bg-gradient-to-r from-[rgba(45,81,28,0.6)] to-[rgba(107,200,63,0.6)] rounded-lg p-4 space-y-2" data-aos="zoom-in" data-aos-delay="300">
              <p className="text-sm">{formatDate(weatherData.dt)}</p>
              <div className="flex items-center space-x-2">
                <img
                  src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt={weatherData.weather[0].description}
                  loading="lazy"
                  className="w-16 h-16"
                />
                <h3 className="font-semibold flex items-center">
                  <MapPin className="mr-2" />
                  {weatherData.name}, {weatherData.sys.country}
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
                <div className="p-2">
                  <p className="flex items-center mb-2"><ThermometerSun />&nbsp;&nbsp;{Math.round(weatherData.main.temp)}° C</p>
                  <p className="flex items-center mb-2"><Dam />&nbsp;&nbsp;{weatherData.main.humidity}%</p>
                  <p className="flex items-center mb-2"><Waves />&nbsp;&nbsp;{(weatherData.wind.speed * 3.6).toFixed(2)} km/h</p>
                </div>
                <div className="p-2">
                  <p className="flex items-center mb-2"><ShowerHead />&nbsp;&nbsp;{weatherData.visibility}</p>
                  <p className="flex items-center mb-2"><Sunrise />&nbsp;&nbsp;{new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} AM</p>
                  <p className="flex items-center mb-2"><Sunset />&nbsp;&nbsp;{new Date(weatherData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} PM</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-wrap w-full lg:w-9/12 bg-neutral-900 bg-opacity-50 rounded-lg p-4 space-y-4 sm:space-y-0" data-aos="zoom-in" data-aos-delay="300">
              {forecastData && forecastData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4" data-aos="zoom-in" data-aos-delay="100">
                  {forecastData.map((forecast, index) => (
                    <div
                    key={index}
                    className={`flex flex-col space-y-2 p-4 ${
                      index !== forecastData.length - 1
                        ? 'lg:border-r border-neutral-500'
                        : ''
                    }`}
                  >
                      
                      <p className="text-sm">{formatDate(forecast.dt)}</p>
                      <div className="flex items-center space-x-2">
                        <img
                          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                          alt={forecast.weather[0].description}
                          loading="lazy"
                          className="w-12 h-12"
                        />
                        <h3 className="text-xl font-semibold flex items-center">
                          <ThermometerSun className="mr-2" />
                          {Math.round(forecast.main.temp)}° C
                        </h3>
                      </div>
                      <p className="flex items-center mb-2">
                        <Dam />&nbsp;&nbsp;{forecast.main.humidity}%
                      </p>
                      <p className="flex items-center mb-2">
                        <Waves />&nbsp;&nbsp;{(forecast.wind.speed * 3.6).toFixed(2)} km/h
                      </p>
                      <p className="flex items-center mb-2">
                        <ShowerHead />&nbsp;&nbsp;{forecast.visibility}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white">No forecast data available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherReport;
