import React, { useState, useContext } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { UserContext } from '../contexts/UserContext';
import { auth } from '../firebase';
import './OutfitGenerator.css';
import SignIn from './SignIn';

export default function OutfitGenerator() {
  const { user, updateImageCount } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [outfitData, setOutfitData] = useState([]);
  const [outfitImage, setOutfitImage] = useState([]);
  const [rawResponse, setRawResponse] = useState("");
  const [showSubscriptionPrompt, setShowSubscriptionPrompt] = useState(false);

  const handleImageUpload = async (event) => {
    const newFiles = Array.from(event.target.files);
    const totalNewFiles = user.dailyImageGenerations + newFiles.length;
    const limit = user.subscriptionTier === 'free' ? 5 : Infinity;

    if (totalNewFiles > limit) {
      setShowSubscriptionPrompt(true);
      return;
    }

    try {
      await updateImageCount(totalNewFiles);
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setImages((prevImages) => [...prevImages, ...newFiles]);
    } catch (error) {
      console.error("Error updating image count:", error);
      alert("Error updating image count. Please try again.");
    }
  };

  const handleSubscribe = () => {
    window.location.href = '/subscription';
  };

  if (!user) {
    return <SignIn />;
  }

  const generateOutfits = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));

    try {
      const token = await user.accessToken;
      const response = await axios.post(
        "http://localhost:5000/generate-outfits", 
        formData,
        {
          headers: { 
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log('Response received:', response.data);

      if (response.data.outfitData && response.data.outfitData.outfits) {
        setOutfitData(response.data.outfitData.outfits);
        setRawResponse(response.data.gptGeneratedText);
      } else {
        console.error('Invalid response format:', response.data);
        alert('Error: Invalid response format from server');
      }
    } catch (error) {
      console.error("Error generating outfits:", error.response || error);
      alert(`Error generating outfits: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateOutfitImage = async () => {
    if (!outfitData.length) {
      alert("No outfit data available to generate an image.");
      return;
    }

    setLoading(true);

    try {
      const token = await user.accessToken;
      const response = await axios.post(
        "http://localhost:5000/generate-outfit-image",
        { rawResponse },
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      setOutfitImage(response.data.outfitImages);
    } catch (error) {
      console.error("Error generating outfit image:", error);
      alert(`Error generating outfit image: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outfit-generator">
      {showSubscriptionPrompt ? (
        <div className="subscription-prompt">
          <div className="subscription-content">
            <h2>Daily Limit Reached</h2>
            <p>You've reached your daily limit of {user.subscriptionTier === 'free' ? 5 : 'unlimited'} images.</p>
            <p>Subscribe to our premium plan for unlimited images!</p>
            <button onClick={handleSubscribe} className="subscribe-button">
              Subscribe Now
            </button>
            <p className="limit-reset">Your limit will reset tomorrow.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="upload-counter">
            {user.subscriptionTier === 'free' ? 
              `${5 - user.dailyImageGenerations} images remaining today` : 
              'Unlimited images available'
            }
          </div>
          
          <div className="wrapper">
            <div className="header">
              <h1 className="title">AI Fashion Designer</h1>
              <button 
                onClick={async () => {
                  try {
                    await auth.signOut();
                  } catch (error) {
                    console.error('Error signing out:', error);
                  }
                }} 
                className="sign-out-button"
              >
                Sign Out
              </button>
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
                  <input 
                    id="file-upload" 
                    type="file" 
                    multiple 
                    onChange={handleImageUpload} 
                    hidden 
                    accept="image/*"
                  />
                  <span>
                    {user.subscriptionTier === 'free' ? 
                      `Upload Images (${5 - user.dailyImageGenerations} remaining)` : 
                      'Upload Images (Unlimited)'
                    }
                  </span>
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
                <div className="outfit-data">
                  {outfitData.length > 0 && (
                    outfitData.map((outfit) => (
                    <>
                      <h2>Generated Outfit:</h2>
                      <p><strong>Top:</strong> {outfit.top}</p>
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
        </>
      )}
    </div>
  );
}

