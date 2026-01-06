const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Hardcode secret from .env
const JWT_SECRET = 'super_secret_jwt_key_123';

const token = jwt.sign({ id: 123, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

// Create a dummy image file
fs.writeFileSync('test_image.png', 'fake image content');

const fileContent = fs.readFileSync('test_image.png');

const dataHeader = `--${boundary}\r
Content-Disposition: form-data; name="title"\r
\r
Test Event With Image\r
--${boundary}\r
Content-Disposition: form-data; name="date"\r
\r
2025-01-01\r
--${boundary}\r
Content-Disposition: form-data; name="location"\r
\r
Test Location\r
--${boundary}\r
Content-Disposition: form-data; name="price"\r
\r
100\r
--${boundary}\r
Content-Disposition: form-data; name="description"\r
\r
Test Description\r
--${boundary}\r
Content-Disposition: form-data; name="image"; filename="test_image.png"\r
Content-Type: image/png\r
\r
`;

const dataFooter = `\r
--${boundary}--\r
`;

const bodyBuffer = Buffer.concat([
    Buffer.from(dataHeader),
    fileContent,
    Buffer.from(dataFooter)
]);

async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: bodyBuffer
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
