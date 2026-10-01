# 🛡️ SheShield — Women's Safety Web App

> A MERN-based women's safety platform that lets users trigger help instantly in an emergency, alert trusted contacts in real time, and get AI-powered legal guidance.

---

## 📌 About

**SheShield** is a full-stack web application designed to make personal safety simple, fast, and accessible. With a single SOS button, a user can send an alert and her live location to her emergency contacts, have the situation's severity classified by AI, and ask a legal chatbot about her rights.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **JWT Authentication** | Secure signup and login using JSON Web Tokens |
| 🚨 **SOS Trigger** | One-tap emergency alert with **AI severity classification** |
| ⚡ **Real-time Alerts** | Instant notifications to emergency contacts via Socket.io |
| 📍 **Live Location Sharing** | Real-time location sharing with emergency contacts via Socket.io |
| ⚖️ **Legal Chatbot** | AI-powered legal assistance with conversation history |
| 👥 **Emergency Contacts** | Full CRUD: add, edit, and delete trusted contacts |
| 🕘 **SOS History** | A record of all past SOS alerts |
| 🏘️ **Community Incidents** | Listing of incidents reported by the community |
| 📊 **Safety Score** | A score-based safety rating system |
| 📞 **Fake Call** | A simulated incoming call to help exit uncomfortable situations |

---

## 🧰 Tech Stack

**Frontend**
- React.js
- Tailwind CSS v4
- Socket.io Client

**Backend**
- Node.js + Express.js
- MongoDB (Mongoose)
- Socket.io
- JWT Authentication

**AI**
- Groq API (LLM-based severity classification and legal chatbot)

---

## 🎨 UI Theme

A dark lavender and pink theme with a `#1a1625` background and gradient buttons.

---

## 📁 Project Structure

```
sheshield/
├── client/          # React frontend
│   └── src/
└── server/          # Express backend
    ├── models/
    ├── routes/
    ├── controllers/
    └── middleware/
```

> Update this to match your actual folder structure.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)
- A Groq API key from [console.groq.com](https://console.groq.com)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/sheshield.git
cd sheshield
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

Start the server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd client
npm install
npm run dev
```

The app will run at `http://localhost:5173` (Vite default), or whichever port your setup uses.

---

## 🔌 Real-time Flow (Socket.io)

1. The user triggers an SOS.
2. The backend has the AI classify the severity.
3. An alert is emitted to emergency contacts through Socket.io.
4. If live location sharing is active, location updates are streamed in real time.

---

## 🗺️ Future Improvements

- SMS and push notification integration
- Map view for community incidents
- Mobile app version (React Native)
- Multi-language support

---



## Author

Sawni Rajak
