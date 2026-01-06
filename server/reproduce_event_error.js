const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Hardcode secret from .env (retrieved in previous turn: super_secret_jwt_key_123)
const JWT_SECRET = 'super_secret_jwt_key_123';

const token = jwt.sign({ id: 123, role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });

const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

const data = `--${boundary}\r
Content-Disposition: form-data; name="title"\r
\r
Test Event\r
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
--${boundary}--\r
`;

// Note: I am NOT sending an image here to see if that's the issue. 
// If it fails, I will guess it's because upload.single('image') might require a field named 'image' even if empty, 
// or maybe simply having no file is fine but my FormData construction is manual.
// Actually, let's use 'fetch' in node effectively.
// But wait, node fetch isn't built-in in older nodes, but user has node 18+ likely?
// Actually I'll use simple http module to avoid deps or assume 'fetch' exists.
// I'll try 'fetch' first.

async function run() {
    try {
        const res = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: data
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

run();
