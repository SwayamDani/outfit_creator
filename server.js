const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OpenAI = require("openai");
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

            Step 2: Generate a full outfit that matches the clothing style. It should be casual and not too bold. Include:
            - **Matching bottoms** (e.g., ripped jeans, cargo pants, shorts).
            - **Shoes** (e.g., sneakers, combat boots, platform shoes).
            - **Accessories** (e.g., chains, bracelets, rings, hats).
            - **Outerwear (if necessary)** (e.g., jackets, flannels, hoodies).
            - **Gender** (e.g. male female, unisex).
            - **Overall aesthetic/style** (e.g., dark streetwear, vintage casual).
            - **Pose recommendation** for DALL·E to follow.
            - **Background setting** that matches the aesthetic.

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

  console.log("GPT response received. Generating outfits...");
  return gptResponse;
}

app.post("/generate-outfits", upload.array("images"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded" });
    }

    const uploadedFiles = req.files.map(file => file.buffer.toString("base64"));
    console.log("Sending images to GPT for outfit generation...");
    const gptResponse = await analyzeImagesAndGenerateOutfits(uploadedFiles);
    let gptGeneratedText = gptResponse.choices[0].message.content;
    console.log("Raw GPT Response:", gptGeneratedText);

    gptGeneratedText = gptGeneratedText.replace(/```json|```/g, "").trim();
    let outfitData;
    try {
      outfitData = JSON.parse(gptGeneratedText);
    } catch (error) {
      console.error("Failed to parse JSON from GPT response:", error);
      return res.status(500).json({ error: "Failed to parse JSON from GPT response" });
    }
    res.json({ uploadedFiles, outfitData, gptGeneratedText });
  }catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/generate-outfit-image", upload.array("data"), async (req, res) => {
    const outfitImages = [];
  
    let gptGeneratedText = req.body.rawResponse;
    console.log("Raw GPT Response:", gptGeneratedText);
  
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
  
    console.log("Generated Outfit Data:", outfitData);
  
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
  
      res.json({ outfitImages });
    } catch (error) {
      console.error("Error generating outfit images:", error);
      res.status(500).json({ error: "Failed to generate outfit images" });
    }
  });

    
    



app.listen(port, () => console.log(`Server running on port ${port}`));
