import React, { useState, useContext, useCallback, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { 
  Upload, Trash2, Sparkles, ArrowRight, 
  ImagePlus, AlertCircle, Info
} from 'lucide-react';
import OutfitDisplay from './OutfitDisplay';

const UploadScreen = ({ onUpload, images, removeImage, generateOutfit, loadingState, error }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Upload Your Clothing</h2>
        <p className="text-gray-600 text-sm mt-1">
          Upload images of clothing items you'd like to style into an outfit
        </p>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
      
        {images.length === 0 ? (
          /* Empty state uploader */
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <div className="flex flex-col items-center">
                <div className="bg-indigo-50 text-indigo-500 rounded-full p-4 mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your clothing</h3>
                <p className="text-gray-600 mb-2 max-w-md">
                  Drag and drop your clothing items or click to browse your files
                </p>
                <p className="text-xs text-gray-500">
                  JPEG, PNG, WebP (Max 5MB)
                </p>
              </div>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onUpload}
              className="hidden"
              disabled={loadingState}
            />
          </label>
        ) : (
          /* Images grid with items */
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
              {images.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group shadow-sm hover:shadow transition-all">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add more button */}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                <ImagePlus className="h-8 w-8 text-indigo-500 mb-2" />
                <span className="text-sm text-indigo-600 font-medium">Add More</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onUpload}
                  className="hidden"
                  disabled={loadingState}
                />
              </label>
            </div>
            
            {/* Generate button */}
            <button
              onClick={generateOutfit}
              disabled={loadingState}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loadingState ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Outfit
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-center">
        <Info className="h-4 w-4 mr-2 text-gray-400" />
        Generating typically takes 30-60 seconds
      </div>
    </div>
  );
};

const OutfitGenerator = () => {
  const { user, loading, updateImageCount } = useContext(UserContext);
  const [images, setImages] = useState([]);
  const [outfitData, setOutfitData] = useState(null);
  const [loadingState, setLoadingState] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('upload'); // upload, analyze, generate

  // Clean up object URLs when component unmounts or images change
  useEffect(() => {
    return () => {
      // Clean up any created object URLs
      images.forEach(image => {
        if (image instanceof File && image._objectUrl) {
          URL.revokeObjectURL(image._objectUrl);
        }
      });
    };
  }, [images]);

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
    if (!user) {
      setError("User data is not available. Please try again later.");
      return;
    }
    
    try {
      const files = Array.from(event.target.files);
      
      // Validate each uploaded image
      files.forEach(validateImage);
      
      // Check subscription limits
      const totalImages = (user.dailyImageGenerations || 0) + files.length;
      const subscriptionTier = user.subscriptionTier || 'free';
      const limit = subscriptionTier === 'free' ? 5 : 
                   subscriptionTier === 'premium' ? 10 : Infinity;
      
      if (totalImages > limit) {
        setError(`You've reached your daily limit of ${limit} generations. Upgrade your account for more.`);
        return;
      }

      // Store object URLs for cleanup
      const filesWithObjectUrls = files.map(file => {
        file._objectUrl = URL.createObjectURL(file);
        return file;
      });

      setImages(prev => [...prev, ...filesWithObjectUrls]);
      await updateImageCount(totalImages);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [user, updateImageCount, validateImage]);

  // Remove an image from the uploads
  const removeImage = (index) => {
    setImages(prev => {
      const newImages = [...prev];
      const removed = newImages.splice(index, 1)[0];
      
      // Clean up the object URL
      if (removed && removed._objectUrl) {
        URL.revokeObjectURL(removed._objectUrl);
      }
      
      return newImages;
    });
  };

  // Generate outfit from uploaded images
  const generateOutfit = useCallback(async () => {
    if (!user) {
      setError("User data is not available. Please try again later.");
      return;
    }
    
    try {
      setLoadingState(true);
      setError(null);
      setStep('analyze');

      const formData = new FormData();
      images.forEach(image => formData.append('images', image));

      const response = await fetch('https://outfit-creator-6mmz.onrender.com/generate-outfits', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to generate outfit');
      }

      const data = await response.json();
      
      // Now generate the images
      const imageResponse = await fetch('https://outfit-creator-6mmz.onrender.com/generate-outfit-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          rawResponse: data.gptGeneratedText
        })
      });
      
      if (!imageResponse.ok) {
        throw new Error('Failed to generate outfit images');
      }
      
      const imageData = await imageResponse.json();
      
      // Format outfit data
      const firstOutfit = data.outfitData.outfits[0];
      setOutfitData({
        imageUrl: imageData.outfitImages,  // Assuming this is an array
        styleName: firstOutfit.overall_aesthetic,
        isPerfectMatch: true,
        description: `Perfect for ${firstOutfit.gender === 'Male' ? 'him' : 'her'} • ${firstOutfit.background_setting || 'Simple, plain wall or minimalistic urban setup.'}`,
        top: firstOutfit.top,
        bottoms: firstOutfit.bottoms,
        shoes: firstOutfit.shoes,
        accessories: firstOutfit.accessories,
        outerwear: firstOutfit.outerwear,
        stylingTips: `This outfit works best for ${firstOutfit.background_setting?.toLowerCase() || 'simple, plain wall or minimalistic urban setup'}. The color palette creates a cohesive look while the silhouette flatters a variety of body types.`,
        accountType: user.subscriptionTier || 'Free',
        remainingGenerations: user.subscriptionTier === 'free' 
          ? 5 - (user.dailyImageGenerations || 0) 
          : user.subscriptionTier === 'premium' 
            ? 10 - (user.dailyImageGenerations || 0) 
            : null,
        totalGenerations: user.subscriptionTier === 'free' ? 5 : user.subscriptionTier === 'premium' ? 10 : null
      });
      
      setStep('generate');
    } catch (err) {
      setError(err.message);
      setStep('upload');
      setLoadingState(false);
    }
  }, [images, user]);

  const resetGenerator = () => {
    // Clean up any created object URLs before resetting
    images.forEach(image => {
      if (image._objectUrl) {
        URL.revokeObjectURL(image._objectUrl);
      }
    });
    
    setImages([]);
    setOutfitData(null);
    setStep('upload');
  };

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Professional header with account details */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">AI Fashion Designer</h1>
              <p className="text-gray-600">Create stunning outfits tailored to your style</p>
            </div>
            
            <div className="mt-4 md:mt-0 bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                <p className="font-medium text-gray-800">{user?.subscriptionTier || 'Admin'} Account</p>
              </div>
              {user?.subscriptionTier !== 'pro' && (
                <div className="mt-1 flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-1.5 mr-2">
                    <div 
                      className="h-1.5 rounded-full bg-indigo-600" 
                      style={{ 
                        width: `${(user?.dailyImageGenerations || 0) / (user?.subscriptionTier === 'free' ? 5 : 10) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {user?.subscriptionTier === 'free' 
                      ? `${5 - (user?.dailyImageGenerations || 0)} of 5 remaining` 
                      : `${10 - (user?.dailyImageGenerations || 0)} of 10 remaining`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Upload section */}
        {step === 'upload' && (
          <UploadScreen 
            onUpload={handleImageUpload}
            images={images}
            removeImage={removeImage}
            generateOutfit={generateOutfit}
            loadingState={loadingState}
            error={error}
          />
        )}
        
        {/* Analyzing state */}
        {step === 'analyze' && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
            </div>
            
            <h2 className="text-xl font-bold mb-3">Creating Your Outfit</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-2">
              Our AI is analyzing your clothing items to create a perfectly coordinated outfit.
            </p>
            <p className="text-sm text-gray-500">This typically takes 30-60 seconds</p>
            
            <div className="max-w-md mx-auto mt-6">
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Result displayed by OutfitDisplay component */}
        {step === 'generate' && outfitData && (
          <OutfitDisplay outfit={outfitData} onCreateNew={resetGenerator} />
        )}
      </div>
    </div>
  );
};

export default OutfitGenerator;