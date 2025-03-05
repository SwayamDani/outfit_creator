import React, { useState } from 'react';
import { Download, ThumbsUp, RefreshCw, Sparkles } from 'lucide-react';
import { 
  Card, CardHeader, CardTitle, CardContent, 
  CardFooter, Badge, IconButton, ItemDetail
} from './ui-components';

const OutfitDisplay = ({ outfit, onCreateNew }) => {
  const [liked, setLiked] = useState(false);
  
  const handleDownload = () => {
    // Create a temporary link element
    if (typeof outfit.imageUrl === 'string') {
      const link = document.createElement('a');
      link.href = outfit.imageUrl;
      link.download = `styleai-outfit-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (Array.isArray(outfit.imageUrl) && outfit.imageUrl.length > 0) {
      const link = document.createElement('a');
      link.href = outfit.imageUrl[selectedImageIndex];
      link.download = `styleai-outfit-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };

  // Check if outfit has multiple images
  const hasMultipleImages = Array.isArray(outfit.imageUrl);
  const images = hasMultipleImages ? outfit.imageUrl : [outfit.imageUrl];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Simple image gallery component to avoid dependencies
  const ImageGallery = ({ images, selectedIndex, onSelect }) => {
    return (
      <div>
        {images.length > 1 && (
          <div className="flex overflow-auto gap-2 mb-2 pb-1">
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`flex-shrink-0 cursor-pointer ${selectedIndex === index ? 'ring-2 ring-indigo-500' : ''}`}
                onClick={() => onSelect(index)}
              >
                <img 
                  src={image} 
                  alt={`View ${index + 1}`} 
                  className="h-16 w-16 object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        )}
        
        <div className="relative aspect-square rounded-md overflow-hidden">
          <img
            src={images[selectedIndex]}
            alt="Selected view"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI Fashion Designer</h1>
          <p className="text-gray-600 mb-4">Create stunning outfits tailored to your style</p>
          
          <div className="mb-6">
            <p className="font-medium">{outfit.accountType || 'Free'} Account</p>
            {outfit.remainingGenerations !== null && (
              <p className="text-sm text-gray-600">
                {outfit.remainingGenerations} of {outfit.totalGenerations} remaining
              </p>
            )}
          </div>
        </div>
        
        {/* Outfit title */}
        <h2 className="text-xl font-bold mb-6">Your AI Styled Outfit</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image section */}
          <div>
            <Card>
              <CardContent className="p-6">
                {images.length > 0 ? (
                  <ImageGallery 
                    images={images} 
                    selectedIndex={selectedImageIndex} 
                    onSelect={setSelectedImageIndex} 
                  />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-between bg-gray-50 border-t border-gray-200">
                <div className="flex space-x-2">
                  <IconButton 
                    icon={Download} 
                    label="Download outfit image" 
                    onClick={handleDownload}
                  />
                  <button
                    onClick={handleLike}
                    className={`border ${liked ? 'border-indigo-300 bg-indigo-50 text-indigo-600' : 'border-gray-300 bg-white text-gray-700'} rounded-md p-2 flex items-center justify-center transition-colors`}
                    aria-label={liked ? "Unlike outfit" : "Like outfit"}
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  {liked ? 'Saved to favorites' : 'Like this outfit?'}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          {/* Outfit details section */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="mb-2">{outfit.styleName || "Casual fan-inspired style."}</CardTitle>
                    
                    {outfit.isPerfectMatch && (
                      <Badge variant="success" className="mb-2">
                        Perfect Match
                      </Badge>
                    )}
                    
                    <p className="text-gray-600">
                      {outfit.description || "Perfect for him • Simple, plain wall or minimalistic urban setup."}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {[
                    { label: "Top", value: outfit.top },
                    { label: "Bottoms", value: outfit.bottoms },
                    { label: "Shoes", value: outfit.shoes },
                    { label: "Accessories", value: outfit.accessories },
                    outfit.outerwear && { label: "Outerwear", value: outfit.outerwear }
                  ].filter(Boolean).map((item, index) => (
                    <ItemDetail key={index} label={item.label}>
                      {item.value}
                    </ItemDetail>
                  ))}
                  
                  {/* Styling tips section */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                    <h4 className="flex items-center text-gray-800 font-bold mb-2">
                      <Sparkles className="h-4 w-4 mr-2 text-indigo-600" />
                      Styling Tips
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {outfit.stylingTips || "This outfit works best for simple, plain wall or minimalistic urban setup. The color palette creates a cohesive look while the silhouette flatters a variety of body types."}
                    </p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="justify-end space-x-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={onCreateNew}
                  className="flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Create Another Outfit
                </button>
                
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Save Outfit
                </button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutfitDisplay;