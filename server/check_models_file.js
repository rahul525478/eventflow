const fs = require('fs');
const https = require('https');
const dotenv = require('dotenv');
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        fs.writeFileSync('models_list.txt', data, 'utf8');
        console.log("Done");
    });
}).on('error', (err) => {
    fs.writeFileSync('models_list.txt', "Error: " + err.message, 'utf8');
});
