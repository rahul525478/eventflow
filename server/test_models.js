const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const models = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.0-pro",
    "gemini-pro",
    "gemini-2.0-flash-exp"
];

async function testModel(modelName) {
    try {
        console.log(`Testing ${modelName}...`);
        await ai.models.generateContent({
            model: modelName,
            contents: "Hello",
        });
        console.log(`✅ SUCCESS: ${modelName} works!`);
        return true;
    } catch (error) {
        console.log(`❌ FAILED: ${modelName} - ${error.message.split('\n')[0]}`);
        return false;
    }
}

async function main() {
    console.log("Starting model checks...");
    for (const model of models) {
        if (await testModel(model)) {
            console.log(`\nRecommended Model: ${model}`);
            break; // Stop after finding the first working one
        }
    }
}

main();
