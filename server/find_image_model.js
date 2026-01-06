const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        const models = await genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        // Actually, listing models is a different API call usually. 
        // Let's use the explicit listModels method if SDK supports it, or just try to generate an image with "gemini-2.0-flash" and "gemini-2.5-flash".

        // We will try to generate an image to see which model works.
        const imageModels = ["gemini-2.0-flash", "gemini-2.5-flash", "imagen-3.0-generate-001"];

        console.log("Testing image generation support...");

        // This is a hypothetical check because the SDK might differ for image gen.
        // Standard Gemini SDK often separates text/multimodal from image generation.
        // However, if "Nano Banana" is Gemini 2.5, it might be integrated.

        // Let's just try to list them first if possible.
        // Note: older SDKs might not have listModels exposed easily without rest.
    } catch (e) {
        console.log("Error:", e.message);
    }
}

// Easier approach: Use the direct REST API to list models to be sure.
const https = require('https');

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
    method: 'GET',
};

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => {
        const data = JSON.parse(body);
        const fs = require('fs');
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log("Model list saved to models.json");
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.end();
