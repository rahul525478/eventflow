# EventFlow - Intelligent Event Management System

EventFlow is a modern, full-stack event management application powered by the MERN stack and enhanced with **Google Gemini 2.5 Flash** for intelligent features.

## 🚀 Features

- **AI-Powered Event Creation**: Automatically generate compelling event descriptions from a few keywords using Gemini AI.
- **Smart Chatbot**: An integrated AI assistant to help users navigate the platform and plan events.
- **Comprehensive Dashboard**: Real-time analytics and reports on event performance.
- **Secure Authentication**: Robust user creation and login system (including Google OAuth support).
- **Responsive Design**: Built with React and Tailwind CSS for a seamless mobile and desktop experience.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **AI Integration**: Google Gemini API (`gemini-2.5-flash` model)

## ⚙️ Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key

# Google Auth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## 📦 Installation & Setup

### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Frontend Setup

Open a new terminal:
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## 🤖 AI Troubleshooting

If you encounter issues with AI features:
- **Quota Exceeded (429)**: The system automatically attempts to fall back to available models. 
- **Model Not Found (404)**: Ensure your API key has access to the `gemini-2.5-flash` model.

## 📝 License

This project is licensed under the MIT License.
