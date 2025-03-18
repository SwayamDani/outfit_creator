import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Gift, Users, Camera, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12">
          {/* Left column: Main content */}
          <div className="max-w-2xl">
            <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight leading-tight">
              <span className="block">AI-Powered</span>
              <span className="block">Fashion Assistant</span>
            </h1>
            
            <p className="mt-6 text-xl text-indigo-100 max-w-lg">
              Create stunning outfits tailored to your style using our advanced AI fashion designer.
            </p>
            
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-8 py-3 bg-white rounded-md font-medium text-indigo-600 hover:bg-gray-50 transition-colors shadow-md"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-8 py-3 border border-white rounded-md text-white hover:bg-indigo-500 hover:bg-opacity-30 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
          
          {/* Right column: AI badge */}
          <div className="flex items-start justify-center">
            <div className="bg-white rounded-xl shadow-xl p-5 flex items-center">
              <Sparkles className="h-6 w-6 text-indigo-600 mr-3" />
              <div>
                <div className="text-lg font-semibold text-gray-900">AI Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Personalized Style</h3>
            <p className="text-indigo-100">
              Our AI analyzes your clothing items and creates perfectly coordinated outfits for any occasion.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">AI-Generated Images</h3>
            <p className="text-indigo-100">
              See high-quality visualizations of your outfits on professional models.
            </p>
          </div>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-white">
            <h3 className="text-xl font-semibold mb-3">Style Recommendations</h3>
            <p className="text-indigo-100">
              Get expert styling tips and recommendations to elevate your fashion game.
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">
          Elevate your style with AI technology
        </h2>
        <Link
          to="/signin"
          className="inline-flex items-center justify-center px-8 py-3 bg-white rounded-md font-medium text-indigo-600 hover:bg-gray-50 transition-colors shadow-md"
        >
          Try StyleAI Today
        </Link>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Create outfits in three easy steps
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 relative transition hover:shadow-lg">
                <div className="absolute -top-3 -left-3 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Upload Your Clothing</h3>
                <p className="text-gray-600">
                  Upload images of your wardrobe pieces and let our AI analyze your style.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 relative transition hover:shadow-lg">
                <div className="absolute -top-3 -left-3 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analysis</h3>
                <p className="text-gray-600">
                  Our advanced AI analyzes your items and creates coordinated outfits.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 relative transition hover:shadow-lg">
                <div className="absolute -top-3 -left-3 bg-indigo-600 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
                  <Shirt className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Your Outfit</h3>
                <p className="text-gray-600">
                  Receive personalized outfit suggestions complete with detailed styling tips.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Everything you need to elevate your style
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Shirt className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">AI Outfit Generation</h3>
                  <p className="text-gray-600">
                    Get personalized outfit recommendations based on your style preferences and occasions.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                <div className="p-6">
                  <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Mystery Box</h3>
                  <p className="text-gray-600">
                    Discover exciting new styles with our AI-curated mystery box feature.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md md:col-span-2 lg:col-span-1">
                <div className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Style Analysis</h3>
                  <p className="text-gray-600">
                    Our AI learns your preferences and provides increasingly personalized recommendations over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Pricing</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Choose the plan that works for you
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Free Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-900">Free Plan</h3>
                <p className="mt-4 text-3xl font-extrabold text-gray-900">$0</p>
                <p className="mt-4 text-sm text-gray-500">Perfect for trying out StyleAI</p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">5 outfit text generations per day</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">2 image generations per day</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Basic outfit recommendations</span>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link to="/signin" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-white rounded-xl shadow-md border-2 border-indigo-500 overflow-hidden relative hover:shadow-lg transition-shadow">
              <div className="absolute top-0 inset-x-0 bg-indigo-500 text-white text-center py-1 text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-8 pt-12">
                <h3 className="text-lg font-medium text-gray-900">Premium Plan</h3>
                <p className="mt-4 text-3xl font-extrabold text-gray-900">$9.99<span className="text-xl font-normal text-gray-500">/mo</span></p>
                <p className="mt-4 text-sm text-gray-500">Perfect for fashion enthusiasts</p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Unlimited text generations</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">10 image generations per day</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Priority email support</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Custom color preferences</span>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link to="/signin" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-8">
                <h3 className="text-lg font-medium text-gray-900">Pro Plan</h3>
                <p className="mt-4 text-3xl font-extrabold text-gray-900">$19.99<span className="text-xl font-normal text-gray-500">/mo</span></p>
                <p className="mt-4 text-sm text-gray-500">Ultimate AI fashion experience</p>
                
                <ul className="mt-6 space-y-4">
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Unlimited text & image generations</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">Custom outfit criteria</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">AI wardrobe analysis</span>
                  </li>
                  <li className="flex">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-3" />
                    <span className="text-gray-600">24/7 priority support</span>
                  </li>
                </ul>
                
                <div className="mt-8">
                  <Link to="/signin" className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Subscribe Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Loved by fashion enthusiasts
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                StyleAI combines cutting-edge artificial intelligence with fashion expertise to help you look your best. 
                Our platform learns from your preferences and provides personalized fashion recommendations that match your style.
              </p>
              <div className="mt-8 flex">
                <Link
                  to="/signin"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try it yourself
                </Link>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl shadow-md p-8">
                <blockquote>
                  <div>
                    <svg className="h-12 w-12 text-indigo-300 opacity-50" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    <p className="mt-6 text-xl font-medium text-gray-900">
                      "StyleAI has completely transformed how I put together outfits. The AI recommendations are spot-on and have helped me discover my personal style."
                    </p>
                  </div>
                  <footer className="mt-6">
                    <p className="text-base font-medium text-gray-700">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Fashion Blogger</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your style?</span>
            <span className="block text-indigo-200">Start using StyleAI today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/signin"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="text-white text-2xl font-bold">StyleAI</div>
              <p className="text-gray-400 text-base">
                AI-powered fashion assistant that helps you create stunning outfits tailored to your style.
              </p>
              <div className="flex space-x-6">
                {/* Social links here */}
              </div>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Features</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link to="/signin" className="text-base text-gray-300 hover:text-white">
                        Outfit Generator
                      </Link>
                    </li>
                    <li>
                      <Link to="/signin" className="text-base text-gray-300 hover:text-white">
                        Mystery Box
                      </Link>
                    </li>
                    <li>
                      <Link to="/signin" className="text-base text-gray-300 hover:text-white">
                        Style Analysis
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Privacy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Careers
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Terms
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-gray-300 hover:text-white">
                        Cookies
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8">
            <p className="text-base text-gray-400 xl:text-center">
              &copy; {new Date().getFullYear()} StyleAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}