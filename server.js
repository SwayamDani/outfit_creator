const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const Stripe = require('stripe');

dotenv.config();

// Initialize Firebase Admin with service account
const serviceAccount = require("./unirides-5913a-firebase-adminsdk-uo610-bdc6af5983"); // You'll need to add this file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const port = 5000;
app.use(cors());
app.use(express.json());
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header exists:', !!authHeader);

  if (!authHeader) {
    console.log('No authorization header provided');
    return res.status(401).json({ error: 'No authorization header' });
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    console.log('Token extracted from header:', !!token);

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified, user ID:', decodedToken.uid);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
};

const checkUsageLimits = async (req, res, next) => {
  const userDoc = await db.collection('users').doc(req.user.uid).get();
  const userData = userDoc.data();

  const today = new Date().toISOString().split('T')[0];
  
  // Handle case where user data doesn't exist or lastReset is not set
  if (!userData || !userData.lastReset) {
    // Initialize user data with default values
    await userDoc.ref.set({
      dailyTextGenerations: 5,
      dailyImageGenerations: 2,
      subscriptionTier: 'free',
      lastReset: today
    }, { merge: true });
    next();
    return;
  }

  const lastReset = userData.lastReset.split('T')[0];

  // Reset daily counts if it's a new day
  if (today !== lastReset) {
    await userDoc.ref.update({
      dailyTextGenerations: userData.subscriptionTier === 'free' ? 5 : 999999,
      dailyImageGenerations: userData.subscriptionTier === 'free' ? 2 : 
        userData.subscriptionTier === 'premium' ? 10 : 999999,
      lastReset: today
    });
    next();
    return;
  }

  // Check limits based on generation type
  if (req.path.includes('/generate-text')) {
    if (userData.dailyTextGenerations <= 0) {
      return res.status(403).json({ error: 'Daily text generation limit reached' });
    }
    await userDoc.ref.update({
      dailyTextGenerations: userData.dailyTextGenerations - 1
    });
  } else if (req.path.includes('/generate-image')) {
    if (userData.dailyImageGenerations <= 0) {
      return res.status(403).json({ error: 'Daily image generation limit reached' });
    }
    await userDoc.ref.update({
      dailyImageGenerations: userData.dailyImageGenerations - 1
    });
  }

  next();
};

async function analyzeImagesAndGenerateOutfits(base64Images) {
  const imageContents = base64Images.map(base64Image => ({
    type: "image_url",
    image_url: { url: `data:image/jpeg;base64,${base64Image}` }
  }));

  // Ensure at least one valid image exists
  if (imageContents.length === 0) {
    console.error("No valid images found. Exiting.");
    return;
  }

  // Step 1: Ask GPT-4 to analyze images and generate complete outfits
  console.log("Analyzing images for accurate outfit descriptions...");

  const gptResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Step 1: Analyze each uploaded image and describe the clothing in structured JSON format. Include:
                    
            - **Color and texture** of the clothing.
            - **Sleeve length** (e.g., short, long, sleeveless).
            - **Graphic design** (e.g., skull, angel wings, gothic text).
            - **Fit and style** (e.g., oversized, slim, vintage).
            - **Material** (e.g., cotton, acid-wash fabric).
            - **Aesthetic influence** (e.g., gothic streetwear, punk grunge, Y2K fashion).

            Step 2: Generate a full outfit that matches the clothing style. Include:
            - **Matching top/Given top** (e.g., t-shirt, tank top, crop top) and **Color of top** (detailed color, not only black/white or something give proper color) and **Sleeve length** (e.g., short, long, sleeveless) and **Graphic design** (e.g., skull, angel wings, gothic text) and **Fit and style** (e.g., oversized, slim, vintage).**Suit/Jacket** (e.g., blazer, leather jacket, trench coat) and **Color of suit/jacket** (e.g., black, white, blue) and **Fit and style** (e.g., oversized, slim, vintage).
            - **Matching bottoms/Given bottoms** (e.g., ripped jeans, cargo pants, shorts) and **Color of bottoms** (e.g., black, white, blue) and **Fit and style** (e.g., ripped, cargo, skinny) and **Material** (e.g., cotton, acid-wash fabric).
            - **Shoes** (e.g., sneakers, combat boots, platform shoes) and **Color of shoes** (e.g., black, white, blue).
            - **Accessories** (e.g., chains, bracelets, rings, hats) and **Color of accessories** (e.g., black, white, blue).
            - **Outerwear (if necessary)** (e.g., jackets, flannels, hoodies) and **Color of outerwear** (e.g., black, white, blue).
            - **Gender** (e.g. male female, unisex).
            - **Overall aesthetic/style** (e.g., dark streetwear, vintage casual).
            - **Pose recommendation** for DALL·E to follow It should not be sitting or lying down.
            - **Background setting** that matches the aesthetic.

            **Important:**
            -In the response you should not give "top", "bottoms", "shoes", "accessories", "outerwear" as an array.

            Format the response as JSON:
            \`\`\`json
            {
              "outfits": [
                {
                  "image": "1.jpeg",
                  "top": "Black oversized t-shirt(half-sleeved) with angel wing design and gothic text, slightly faded vintage cotton.",
                  "bottoms": "Slim-fit black leather pants with silver buckle details.",
                  "shoes": "Black combat boots with a platform sole.",
                  "accessories": "Layered silver chain necklace, finger rings, and a leather bracelet.",
                  "outerwear": "Black distressed denim jacket with frayed edges.",
                  "gender": "Male",
                  "overall_aesthetic": "Gothic streetwear with punk influences.",
                  "pose_recommendation": "Confident stance with arms crossed, looking slightly away.",
                  "background_setting": "Neon-lit urban alley with a grunge aesthetic."
                }
              ]
            }
            \`\`\`

            Provide only valid JSON. No explanations.`
          },
          ...imageContents,
        ],
      },
    ],
  });

  console.log("GPT response received. Generating outfits..." + gptResponse);
  return gptResponse;
}

app.post("/generate-outfits", upload.array("images"), authenticateUser, checkUsageLimits, async (req, res) => {
  try {
    console.log('Request received with auth:', !!req.user);

    if (!req.files || req.files.length === 0) {
      console.log('No files in request');
      return res.status(400).json({ error: "No images uploaded" });
    }

    console.log('Number of files:', req.files.length);

    const uploadedFiles = req.files.map(file => file.buffer.toString("base64"));
    console.log('Processing images for outfit generation...');

    const gptResponse = await analyzeImagesAndGenerateOutfits(uploadedFiles);
    console.log('GPT response received');

    let gptGeneratedText = gptResponse.choices[0].message.content;
    console.log('Processing GPT response...');

    gptGeneratedText = gptGeneratedText.replace(/```json|```/g, "").trim();
    let outfitData;
    try {
      outfitData = JSON.parse(gptGeneratedText);
    } catch (error) {
      console.error("Failed to parse JSON from GPT response:", error);
      return res.status(500).json({ error: "Failed to parse JSON from GPT response" });
    }

    console.log('Sending response back to client');
    console.log("outfitData ",outfitData);
    console.log("gptGeneratedText ",gptGeneratedText);
    res.json({ uploadedFiles, outfitData, gptGeneratedText });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.post("/generate-outfit-image", upload.array("data"), authenticateUser, checkUsageLimits, async (req, res) => {
  const outfitImages = [];

  let gptGeneratedText = req.body.rawResponse;

  // Step 2: Remove code block formatting before parsing JSON
  gptGeneratedText = gptGeneratedText.replace(/```json|```/g, "").trim();

  let outfitData;
  try {
    outfitData = JSON.parse(gptGeneratedText);
  } catch (error) {
    console.error("Failed to parse JSON from GPT response:", error);
    return res.status(400).json({ error: "Failed to parse JSON from GPT response" });
  }

  if (!outfitData?.outfits || outfitData.outfits.length === 0) {
    console.error("No structured outfit data found in GPT response.");
    return res.status(400).json({ error: "No structured outfit data found in GPT response" });
  }

  // Step 3: Use the outfit data for DALL·E image generation
  console.log("Generating fashion images...");

  try {
    for (const [index, outfit] of outfitData.outfits.entries()) {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `
        Generate a **full-body, high-fashion model wearing the EXACT outfit** as described:
        
        - **Top:** ${outfit.top}
        - **Bottoms:** ${outfit.bottoms}
        - **Shoes:** ${outfit.shoes}
        - **Accessories:** ${outfit.accessories}
        - **Outerwear:** ${outfit.outerwear || "None"}
        
        The model should match the following pose: **${outfit.pose_recommendation}**  
        The model's gender should be **${outfit.gender}**
        The background should be: **${outfit.background_setting}**  
        
        This is a **highly detailed fashion photoshoot image** with **realistic textures and fabric accuracy**.  
        Ensure the **color, material, and style exactly match** the description.  
        The model should be posed naturally, displaying the entire outfit clearly. 
        It is for an ecommerce website showcasing the outfit. 
        The person in the image should be a fashion model.
        And in the image the person should always be **portrait**, standing along the length.
        the person should not be sitting or lying down.
        there should only be one person in the image.
        `,
        n: 1,
        size: "1024x1024", // Ensures full-body proportions
      });

      outfitImages.push(imageResponse.data[0].url);
      console.log("Generated image for outfit");
    }

    console.log(outfitImages);
    res.json({ outfitImages });
  } catch (error) {
    console.error("Error generating outfit images:", error);
    res.status(500).json({ error: "Failed to generate outfit images" });
  }
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Add these routes to your server.js file

// Create a payment intent for Stripe
app.post('/create-payment-intent', authenticateUser, async (req, res) => {
  const { amount, planId } = req.body;
  const userId = req.user.uid;

  try {
    // Get user data to check if they already have a Stripe customer ID
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    let customerId = userData.stripeCustomerId;
    
    // If user doesn't have a Stripe customer ID, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
          firebaseUserId: userId
        }
      });
      
      customerId = customer.id;
      
      // Save customer ID to user record
      await db.collection('users').doc(userId).update({
        stripeCustomerId: customerId
      });
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        firebaseUserId: userId,
        planId
      }
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook to handle successful payments
app.post('/stripe-webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event based on its type
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      if (paymentIntent.metadata && paymentIntent.metadata.firebaseUserId) {
        const userId = paymentIntent.metadata.firebaseUserId;
        const planId = paymentIntent.metadata.planId;
        
        try {
          // Update user's subscription in Firestore
          const userRef = db.collection('users').doc(userId);
          
          // Set subscription details based on plan
          const subscriptionData = {
            subscriptionTier: planId,
            subscriptionStatus: 'active',
            stripePaymentIntentId: paymentIntent.id,
            subscriptionStartDate: new Date().toISOString()
          };
          
          // Set usage limits based on plan
          if (planId === 'premium') {
            subscriptionData.dailyTextGenerations = 999999; // Unlimited
            subscriptionData.dailyImageGenerations = 10;
          } else if (planId === 'pro') {
            subscriptionData.dailyTextGenerations = 999999; // Unlimited
            subscriptionData.dailyImageGenerations = 999999; // Unlimited
          }
          
          await userRef.update(subscriptionData);
          
          console.log(`Updated subscription for user ${userId} to ${planId}`);
        } catch (error) {
          console.error('Error updating user subscription:', error);
        }
      }
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`Payment failed for intent ${failedPaymentIntent.id}`);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

// Endpoint to get subscription status
app.get('/subscription-status', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    // Return subscription details
    res.json({
      subscriptionTier: userData.subscriptionTier || 'free',
      subscriptionStatus: userData.subscriptionStatus || 'inactive',
      dailyTextGenerations: userData.dailyTextGenerations,
      dailyImageGenerations: userData.dailyImageGenerations,
      lastReset: userData.lastReset
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription endpoint
app.post('/cancel-subscription', authenticateUser, async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    const userData = userDoc.data();
    
    if (userData.stripeSubscriptionId) {
      // Cancel the subscription in Stripe
      await stripe.subscriptions.update(userData.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      
      // Update user record
      await db.collection('users').doc(req.user.uid).update({
        subscriptionStatus: 'canceling',
        subscriptionCanceledAt: new Date().toISOString()
      });
      
      res.json({ message: 'Subscription will be canceled at the end of the billing period' });
    } else {
      // Downgrade immediately for users without a Stripe subscription
      await db.collection('users').doc(req.user.uid).update({
        subscriptionTier: 'free',
        subscriptionStatus: 'inactive',
        dailyTextGenerations: 5,
        dailyImageGenerations: 2
      });
      
      res.json({ message: 'Subscription canceled' });
    }
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));