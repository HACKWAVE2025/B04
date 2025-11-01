import React, { useState } from 'react';
import Loading from '../../Utils/Loading';
import { DigikarshakanAPIs } from '../../utils/DigikarshakanAPIs';
import { notifyWarn, notifyError, notifySuccess } from "../../Utils/Toasts";

const PlantDiseasePrediction = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);

  // New states to hold detailed suggestions
  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setUploadedImage(null);
      setApiResponse(null);
      setDiseaseSuggestions([]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      notifyWarn("Please upload an image before submitting.");
      return;
    }

    setLoading(true);
    try {
      const response = await DigikarshakanAPIs.plantDiseasePrediction(selectedImage);
      if (response.status === 200) {
        const data = response.data.result;

        setApiResponse(response.data);
        setDiseaseSuggestions(data.disease.suggestions || []);
        setUploadedImage(URL.createObjectURL(selectedImage));
        notifySuccess("Image uploaded successfully. Scroll down to see our predictions");
      } else {
        notifyError("Unexpected response from the server.");
      }
    } catch (error) {
      notifyError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center mt-10 pt-5 tracking-wide" data-aos="fade-up" data-aos-delay="300">
        Plant Disease Pre
        <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
          diction
        </span>
      </h2>
      <p className="text-center text-neutral-600 dark:text-neutral-500 font-normal mt-3" data-aos="fade-up" data-aos-delay="300">
        Detects early signs of plant diseases from images, offering insights to <br />
        prevent or treat potential issues promptly.
      </p>

      <div className="mt-10 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center justify-center w-full md:w-8/12 lg:w-6/12 p-10 bg-gray-200 dark:bg-neutral-900 rounded-lg text-center" data-aos="zoom-in" data-aos-delay="300">
          <label
            htmlFor="imageUpload"
            className="block text-neutral-500 mb-2"
          >
            Upload Image (JPEG, JPG, PNG, TIFF, WEBP only)
          </label>

          <input
            type="file"
            id="imageUpload"
            accept="image/jpeg, image/jpg, image/png, image/jfif, image/tiff, image/webp"
            onChange={handleImageUpload}
            className="bg-white dark:bg-neutral-800 p-4 rounded-lg text-gray-700 dark:text-gray-300 cursor-pointer w-full sm:w-10/12 md:w-8/12 lg:w-8/12"
          />
          <button
            onClick={handleSubmit}
            disabled={!selectedImage || loading}
            className={"py - 3 px-6 mt-10 font-medium text-white bg-gradient-to-r from-[#6bc83f] to-[#2d511c] rounded-md ${!selectedImage || loading ? 'opacity-50 cursor-not-allowed' : ''}"}
          >
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </div>

      {loading && <Loading />}

      {uploadedImage && apiResponse && (
        <div>
          <div className="flex flex-wrap mt-0 sm:mt-0 md:mt-15 lg:mt-20">
            <div className="w-full sm:w-5/12 md:w-6/12 lg:w-7/12" data-aos="fade-up" data-aos-delay="300">
              <p className="text-neutral-600 dark:text-neutral-500 font-normal mt-5">
                Uploaded Image : &nbsp;
                <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text">
                  {selectedImage.name}
                </span>
                <br />
              </p>

              {/* If your API gives a main prediction string, you can still show it */}
              {apiResponse.prediction && (
                <p className="text-neutral-600 dark:text-neutral-500 font-normal mt-5">
                  Predicted Disease : &nbsp;
                  <span className="bg-gradient-to-r from-[#6bc83f] to-[#2d511c] text-transparent bg-clip-text capitalize">
                    {apiResponse.prediction.replace(/_+/g, ' ')}
                  </span>
                </p>
              )}
            </div>
            <div className="w-full sm:w-5/12 md:w-5/12 lg:w-5/12 p-6" data-aos="zoom-in" data-aos-delay="300">
              <img
                src={uploadedImage}
                alt="Uploaded Crop"
                loading="lazy"
                className="w-full sm:w-60 md:w-96 lg:w-2/2 h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Disease Suggestions */}
          {diseaseSuggestions.length > 0 && (
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-6">Disease Suggestions</h3>
              {diseaseSuggestions.map((disease) => (
                <div key={disease.id} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-neutral-800">
                  <p><strong>Name:</strong> {disease.name}</p>
                  <p><strong>Scientific Name:</strong> {disease.scientific_name}</p>
                  <p><strong>Probability:</strong> {(disease.probability * 100).toFixed(2)}%</p>
                  <p><strong>Type:</strong> {disease.details?.type || 'N/A'}</p>
                  <p>
                    <strong>Wiki:</strong>
                    <a href={disease.details?.wiki_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline ml-1">
                      Link
                    </a>
                  </p>
                </div>
              ))}
            </div>
          )}


        </div>
      )}
    </div>
    </div >
  );
};

export default PlantDiseasePrediction;