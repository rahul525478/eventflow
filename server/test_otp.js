const fetch = require('node-fetch'); // Older node might need this, but let's try native fetch or http if env allows. 
// Actually, let's use http module to be dependency-free in this script.
const http = require('http');

const data = JSON.stringify({
    phone: '1234567890'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/otp/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
