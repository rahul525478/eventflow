const API_URL = import.meta.env.PROD
    ? 'https://eventflow-mjdh.vercel.app/api'
    : 'http://localhost:5000/api';

export default API_URL;
