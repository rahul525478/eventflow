const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("test");
        console.log("gemini-1.5-flash WORKS");
    } catch (e) { console.log("gemini-1.5-flash FAILS"); }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        await model.generateContent("test");
        console.log("gemini-pro WORKS");
    } catch (e) { console.log("gemini-pro FAILS"); }
}
test();
