# StyleAI - AI Fashion Assistant

StyleAI is an AI-powered personal fashion assistant that helps users create stunning outfits and elevate their style using artificial intelligence. Users can upload images of their clothing items, and the application generates coordinated outfit recommendations and visualizations.

## Features

- **AI Outfit Generation**: Upload images of your clothing items and receive personalized outfit recommendations
- **Visual Outfit Creation**: Generate photorealistic images of complete outfits using DALL-E
- **User Authentication**: Secure login with email/password or Google authentication
- **Subscription Tiers**: Free, Premium, and Pro subscription options with different usage limits
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Authentication**: Firebase Authentication
- **Database**: Firestore (Firebase)
- **AI Services**: OpenAI GPT-4 and DALL-E 3
- **Payment Processing**: Stripe

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v8 or higher)
- Firebase account
- OpenAI API key
- Stripe account (for payment processing)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-fashion.git
   cd ai-fashion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_firebase_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
   REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # Server environment variables
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Place your Firebase service account key file in the root directory:
   - Rename it to `unirides-5913a-firebase-adminsdk-uo610-bdc6af5983.json` or update the reference in `server.js`

## Running the Application

1. Start the server:
   ```bash
   node server.js
   ```

2. In a separate terminal, start the client:
   ```bash
   npm run client
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Project Structure

- `/public` - Static assets
- `/src` - React application source code
  - `/components` - React components
  - `/contexts` - React context providers
  - `/App.js` - Main application component
- `server.js` - Express server for handling API requests

## User Flow

1. **Sign Up/Login**: Users create an account or sign in with existing credentials
2. **Upload Images**: Users upload images of their clothing items
3. **Generate Outfit**: The AI analyzes the uploaded images and generates outfit recommendations
4. **View Results**: Users can view and download the generated outfit images and descriptions
5. **Subscription**: Users can upgrade to Premium or Pro plans for additional features

## Subscription Plans

- **Free Plan**:
  - 5 text generations per day
  - 2 image generations per day
  - Basic outfit recommendations

- **Premium Plan** ($9.99/month):
  - Unlimited text generations
  - 10 image generations per day
  - Advanced outfit recommendations
  - Priority support

- **Pro Plan** ($19.99/month):
  - Unlimited text and image generations
  - Custom outfit criteria
  - Seasonal trend analysis
  - 24/7 priority support

## API Endpoints

The server exposes the following API endpoints:

- `POST /generate-outfits` - Analyze uploaded clothing images and generate outfit descriptions
- `POST /generate-outfit-image` - Create visual representations of outfits using DALL-E
- `POST /create-payment-intent` - Create a Stripe payment intent for subscription
- `POST /stripe-webhook` - Handle Stripe webhook events
- `GET /subscription-status` - Get user's current subscription status
- `POST /cancel-subscription` - Cancel a user's subscription

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the GPT-4 and DALL-E APIs
- Firebase for authentication and database services
- Tailwind CSS for the UI components
