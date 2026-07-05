# 🏗️ SiteGuide AI: Next-Gen AI Construction Platform

SiteGuide is a comprehensive, AI-powered construction management platform designed to streamline project planning, cost estimation, and site monitoring. Leveraging state-of-the-art Generative AI (Google Gemini), SiteGuide provides intelligent insights and automated workflows for modern construction teams.

---

## 🌟 Key Features

- **🤖 AI Copilot**: A context-aware construction assistant powered by Google Gemini AI. Ask questions about building codes, materials, or project delays and get instant, expert-level advice.
- **📊 Interactive Dashboard**: Real-time visualization of project health, timelines, and resource allocation using dynamic charts.
- **🗺️ Map Dashboard**: Geographical visualization of site locations with integrated data overlays for multi-site management.
- **💰 Smart Cost Estimator**: Predict and track project expenses with AI-driven estimation tools to prevent budget overruns.
- **📅 App Scheduler**: Intelligent scheduling system to manage labor, machinery, and milestones with automated conflict detection.
- **📁 Project Management**: Centralized hub for managing multiple construction projects, tracking progress, and team collaboration.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (with [Vite](https://vitejs.dev/))
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Routing**: [React Router DOM](https://reactrouter.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with [Mongoose](https://mongoosejs.com/))
- **AI Integration**: [Google Generative AI (Gemini)](https://ai.google.dev/)
- **Environment**: [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google AI (Gemini) API Key

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ThakurUjjwal1706/SiteGuide.git
   cd SiteGuide
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📂 Project Structure

```text
SiteGuide/
├── backend/                # Express API Server
│   ├── middleware/        # Custom middleware (Error handling, etc.)
│   ├── models/            # MongoDB Schemas
│   ├── routes/            # API Endpoints (AI, Projects, Analytics)
│   └── server.js          # Entry point
├── frontend/               # React Vite Application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (AI Copilot, Dashboard, etc.)
│   │   └── api/           # API service configurations
│   └── public/            # Static assets
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---

## 📞 Contact

**Ujjwal Singh** - [GitHub](https://github.com/ThakurUjjwal1706)

Project Link: [https://github.com/ThakurUjjwal1706/SiteGuide](https://github.com/ThakurUjjwal1706/SiteGuide)
