const dotenv = require('dotenv');
dotenv.config();
const key = process.env.GEMINI_API_KEY;

// Need a polyfill for fetch in older node/environments if strictly necessary, but Node 18+ has fetch.
// Assuming node 18+
// If not, we use https module. But let's assume fetch is there or use https.
// To be safe, I'll use https module implementation to avoid dependencies.

const https = require('https');

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("AVAILABLE_MODELS_START");
                json.models.forEach(m => console.log(m.name));
                console.log("AVAILABLE_MODELS_END");
            } else {
                console.log("API_ERROR:", json);
            }
        } catch (e) {
            console.log("PARSE_ERROR:", data);
        }
    });
}).on('error', (err) => {
    console.log("REQ_ERROR:", err.message);
});
