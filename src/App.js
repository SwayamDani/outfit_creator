import React, { useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import "./App.css";

function App() {
  const [images, setImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outfitData, setOutfitData] = useState([]);
  const [outfitImage, setOutfitImage] = useState([]);
  const [rawResponse, setRawResponse] = useState("");

  const handleImageUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setImages((prevImages) => [...prevImages, ...newFiles]);
  };

  const generateOutfits = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    try {
      const response = await axios.post("http://localhost:5000/generate-outfits", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setOutfitData(response.data.outfitData.outfits);
      setRawResponse(response.data.gptGeneratedText);
    } catch (error) {
      console.error("Error generating outfits:", error);
    }

    setLoading(false);
  };

  const generateOutfitImage = async () => {
    if (!outfitData.length) {
      alert("No outfit data available to generate an image.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/generate-outfit-image", {
        rawResponse,
      });

      setOutfitImage(response.data.outfitImages);
      console.log("Generated outfit images:", response.data.outfitImages);
    } catch (error) {
      console.error("Error generating outfit image:", error);
    }

    setLoading(false);
  };

  return (
    <div className="wrapper">
      {/* Header Container */}
      <div className="header">
        <h1 className="title">AI Fashion Designer</h1>
      </div>

      {/* Image Upload & Generation Area */}
      <div className="image-container">
        {uploadedFiles.length > 0 ? (
          <Carousel
          showArrows={true}
          showThumbs={false}
          showStatus={false}
          infiniteLoop={true}
          autoPlay={true}
          className="carousel"
        >
          {uploadedFiles.map((file, index) => (
            <div key={index} className="carousel-item">
              <img src={URL.createObjectURL(file)} alt={`Uploaded ${index}`} className="carousel-image" />
            </div>
          ))}
        </Carousel>
        ) : (
          <label htmlFor="file-upload" className="upload-placeholder">
            <input id="file-upload" type="file" multiple onChange={handleImageUpload} hidden />
            <span>Upload Image</span>
          </label>
        )}

        {uploadedFiles.length > 0 && (
          <button onClick={generateOutfits} className="generate-button" disabled={loading}>
            {loading ? "Generating..." : "Generate Outfit"}
          </button>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <>
          <label htmlFor="file-upload-more" className="upload-placeholder">
            <input id="file-upload-more" type="file" multiple onChange={handleImageUpload} hidden />
            <span>Upload More Images</span>
          </label>

          <div className="outfit-data">
            {outfitData.length > 0 && (
              outfitData.map((outfit) => (
              <>
                <h2>Generated Outfit:</h2>
                <p><strong>Bottoms:</strong> {outfit.bottoms}</p>
                <p><strong>Shoes:</strong> {outfit.shoes}</p>
                <p><strong>Accessories:</strong> {outfit.accessories}</p>
                <button className="generate-image" onClick={generateOutfitImage} disabled={loading}>
                  {loading ? "Generating Image..." : "Generate Image"}
                </button>
              </>
            )))}
          </div>

          <div className="image-container-generated">
          {outfitImage.length > 0 && (
            <div className="generated-outfit">
              <h2>Generated Image:</h2>
              <Carousel
                showArrows={true}
                showThumbs={false}
                showStatus={false}
                infiniteLoop={true}
                autoPlay={true}
                className="carousel-generated"
              >
                {outfitImage.map((file, index) => (
                  <div key={index} className="carousel-item-generated">
                    <img src={file} alt={`Uploaded ${index}`} className="carousel-image-generated" />
                  </div>
                ))}
            </Carousel>
            </div>
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default App;
