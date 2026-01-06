const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fs = require('fs');

async function main() {
    try {
        const response = await ai.models.list();
        fs.writeFileSync('models.txt', JSON.stringify(response, null, 2));
        console.log("Response written to models.txt");
    } catch (error) {
        fs.writeFileSync('models.txt', `Error: ${error.message}`);
        console.error("Error listing models:", error);
    }
}

main();
