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

console.log("Sending request...");
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (d) => { body += d; });
    res.on('end', () => console.log(body));
});

req.on('error', (error) => {
    console.error("ERROR:", error.message);
});

req.write(data);
req.end();
