const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // For v1beta, the model listing is not directly on genAI.
    // We need to use the model manager or just try to get a model.
    // Actually, the node SDK doesn't have a simple listModels off the main client in older versions, 
    // but let's check if we can simply use the API or if there is a helper.
    // Wait, the SDK wrapping of the API is thin.
    // Actually, if I look at the error, it suggests checking the list.
    // Let's try to just use valid known models.
    // But to be safe, I'll try to fetch the model list via strict API call if SDK doesn't expose it easily?
    // No, let's try a simple script that tries 'gemini-1.5-flash-001' and 'gemini-pro'.

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });
        console.log("Testing gemini-1.5-flash-001...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-1.5-flash-001");
    } catch (e) {
        console.log("Failed gemini-1.5-flash-001: " + e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("Testing gemini-pro...");
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro");
    } catch (e) {
        console.log("Failed gemini-pro: " + e.message);
    }
}

listModels();
