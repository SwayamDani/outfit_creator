import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shirt, Gift, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Welcome to</span>
                <span className="block text-indigo-200">StyleAI</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-indigo-100 sm:max-w-3xl">
                Your personal AI-powered fashion assistant that creates stunning outfits tailored to your style
              </p>
              <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link
                    to="/signin"
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 shadow-md transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signin"
                    className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 shadow-md transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What we offer
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover the power of AI-driven fashion recommendations
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
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

              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
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

              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg md:col-span-2 lg:col-span-1">
                <div className="p-6">
                  <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-blue-600" />
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

      {/* About Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                About Us
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                StyleAI combines cutting-edge artificial intelligence with fashion expertise to help you look your best. 
                Our platform learns from your preferences and provides personalized fashion recommendations that match your style.
              </p>
              <div className="mt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500 text-white">
                      <Users className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Community-driven</h4>
                    <p className="mt-1 text-gray-500">
                      Join thousands of fashion enthusiasts discovering their personal style with AI.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg shadow-lg p-6">
                <blockquote>
                  <div>
                    <p className="text-xl font-medium text-gray-900 italic">
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
          </div>
        </div>
      </div>
    </div>
  );
}