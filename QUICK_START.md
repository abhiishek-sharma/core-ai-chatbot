# Quick Start Guide

## ✅ Backend Setup Complete!

The backend is now running on **http://localhost:8000**

## Next Steps:

### 1. Configure AWS Credentials

Edit `backend/.env` and add your Amazon Bedrock credentials:

```env
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=us-east-1
```

**Important:** Make sure Claude Haiku model is enabled in your AWS Bedrock console!

### 2. Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm install
npm start
```

The React app will start on **http://localhost:3000**

## What's Working:

✅ FastAPI backend installed and running
✅ All Python dependencies installed successfully
✅ Server is listening on port 8000
✅ Ready for AWS Bedrock integration

## Test the API:

Visit http://localhost:8000/docs to see the interactive API documentation (Swagger UI)

## Features Available:

- 💬 Real-time streaming chat responses
- 🗂️ Conversation history management
- ⚙️ Customizable settings (temperature, tokens, prompts)
- 🎨 Beautiful dark mode UI with Tailwind CSS
- 📝 Markdown and code syntax highlighting
- 🔍 Conversation search
- 📥 Export conversations as JSON

## Troubleshooting:

If you get AWS credential errors:
1. Make sure you've updated the `.env` file with valid credentials
2. Verify your AWS region has Bedrock access
3. Ensure Claude Haiku model is enabled in your AWS console

Enjoy your Claude AI chatbot! 🚀


