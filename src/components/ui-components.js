import React from 'react';

// Card components
export const Card = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`p-6 pt-0 flex items-center ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Button component
export const Button = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-800",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-2.5 text-lg",
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge component
export const Badge = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: "bg-indigo-100 text-indigo-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    destructive: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Alert component
export const Alert = ({
  title,
  description,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: "bg-gray-50 text-gray-800 border-gray-200",
    success: "bg-green-50 text-green-800 border-green-200",
    destructive: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  return (
    <div
      className={`p-4 border rounded-md ${variantStyles[variant]} ${className}`}
      role="alert"
      {...props}
    >
      {title && <h5 className="font-medium mb-1">{title}</h5>}
      {description && <div className="text-sm">{description}</div>}
    </div>
  );
};

// Container component
export const Container = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`max-w-5xl mx-auto px-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Image gallery component
export const ImageGallery = ({ images, selectedIndex = 0, onSelect }) => {
  return (
    <div>
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

// Upload area component
export const UploadArea = ({ onUpload, className = '', disabled = false }) => {
  return (
    <label className={`block cursor-pointer ${disabled ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}>
      <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-gray-400 transition-colors">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 rounded-full p-3 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your clothing</h3>
          <p className="text-gray-500 mb-2">
            Drag and drop or click to upload
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: JPEG, PNG, WebP (Max 5MB)
          </p>
        </div>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={onUpload}
        className="hidden"
        disabled={disabled}
      />
    </label>
  );
};

// Spinner component
export const Spinner = ({ className = '', size = 'md', ...props }) => {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
  };

  return (
    <svg
      className={`animate-spin ${sizeStyles[size]} text-indigo-600 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

// Item detail component
export const ItemDetail = ({ label, children }) => {
  return (
    <div>
      <h4 className="font-bold text-gray-700 mb-1">{label}</h4>
      <p className="text-gray-600">{children}</p>
    </div>
  );
};

// Icon button component
export const IconButton = ({ icon: Icon, label, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-gray-300 rounded-md p-2 hover:bg-gray-50 ${className}`}
      aria-label={label}
    >
      <Icon className="h-5 w-5 text-gray-700" />
    </button>
  );
};
