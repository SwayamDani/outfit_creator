import React, { useState, useContext, useCallback } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Camera, Upload, Loader } from 'lucide-react';

// Create a reusable Alert component
const Alert = ({ variant = 'default', children }) => {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className={`px-4 py-3 rounded-lg ${variantStyles[variant]}`}>
      {children}
    </div>
  );
};

const OutfitGenerator = () => {
  const { user, updateImageCount } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [outfitData, setOutfitData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Image validation helper function
  const validateImage = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload JPEG, PNG, or WebP images only');
    }
    if (file.size > maxSize) {
      throw new Error('Image size should be less than 5MB');
    }
  }, []);

  // Handle image upload with validation
  const handleImageUpload = useCallback(async (event) => {
    try {
      const files = Array.from(event.target.files);
      
      // Validate each uploaded image
      files.forEach(validateImage);
      
      // Check subscription limits
      const totalImages = user.dailyImageGenerations + files.length;
      const limit = user.subscriptionTier === 'free' ? 5 : 
                   user.subscriptionTier === 'premium' ? 20 : Infinity;
      
      if (totalImages > limit) {
        throw new Error(`Daily limit reached. Upgrade to upload more images.`);
      }

      setImages(prev => [...prev, ...files]);
      await updateImageCount(totalImages);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [user, updateImageCount, validateImage]);

  // Generate outfit from uploaded images
  const generateOutfit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      images.forEach(image => formData.append('images', image));

      const response = await fetch('/generate-outfits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate outfit');
      }

      const data = await response.json();
      setOutfitData(data.outfitData.outfits);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [images, user.accessToken]);

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      {/* Error Display */}
      {error && (
        <Alert variant="error" className="w-full mb-4">
          {error}
        </Alert>
      )}

      <div className="w-full mb-8">
        {/* Header with remaining uploads counter */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">AI Fashion Designer</h2>
          <span className="text-sm text-gray-600">
            {user.subscriptionTier === 'free' ? 
              `${5 - user.dailyImageGenerations} images remaining` : 
              'Unlimited images available'}
          </span>
        </div>

        {/* Image upload area */}
        <label className="block w-full p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2">Drop your clothing images here or click to upload</p>
            <p className="text-sm text-gray-500">JPEG, PNG, or WebP, up to 5MB each</p>
          </div>
        </label>
      </div>

      {/* Uploaded images display and generate button */}
      {images.length > 0 && (
        <div className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {images.map((file, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>

          <button
            onClick={generateOutfit}
            disabled={loading}
            className="w-full p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <Loader className="animate-spin h-5 w-5" />
                <span>Generating Outfit...</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span>Generate Outfit</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Generated outfit display */}
      {outfitData.length > 0 && (
        <div className="w-full mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Generated Outfit</h3>
          {outfitData.map((outfit, index) => (
            <div key={index} className="space-y-2 text-gray-700">
              <p><strong>Top:</strong> {outfit.top}</p>
              <p><strong>Bottoms:</strong> {outfit.bottoms}</p>
              <p><strong>Shoes:</strong> {outfit.shoes}</p>
              <p><strong>Accessories:</strong> {outfit.accessories}</p>
              {outfit.outerwear && (
                <p><strong>Outerwear:</strong> {outfit.outerwear}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutfitGenerator;