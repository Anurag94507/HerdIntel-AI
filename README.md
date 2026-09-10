# HerdIntel AI 🐄⚡

> **Precision Dairy Intelligence Platform powered by Multi-Modal AI & Telemetry Sensor Fusion.**

HerdIntel AI is a modern agricultural management platform designed to monitor herd health, automate animal welfare compliance reporting, and provide AI-assisted insights in multiple regional languages.

---

## 🌟 Key Features

- 📡 **Live Telemetry & Sensor Fusion**: Real-time tracking of bovine isolation score, acoustic cough frequencies, temperature index, and overall health status.
- 🚨 **Multimodal Alert System**: Automated priority alerts (High/Medium/Low) for heat stress, mastitis risk, and respiratory issues with actionable interventions.
- 📜 **Animal Welfare Audit & Compliance**: Instant generation of Five-Freedoms animal welfare compliance reports with digital certification signatures and cryptographic hash validation.
- 🤖 **AI Copilot & Multilingual Voice Assistance**: Multilingual interactive AI assistant supporting English, Hindi, Hinglish, Bhojpuri, Awadhi, image-based diet planning, and ledger accounting.
- 📊 **Individual Bovine Profiles**: Detailed health metrics, historical telemetry charts, and historical alert timelines for every cow.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6
- **Backend**: Node.js, Express, SQLite (`better-sqlite3`)
- **AI Integration**: Google Gemini API (Multimodal Vision & NLP)

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Anurag94507/HerdIntel-AI.git
   cd HerdIntel-AI
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run seed    # Initialize and seed the SQLite database
   npm run dev     # Starts backend on http://localhost:5000
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   npm run dev     # Starts Vite dev server on http://localhost:5173
   ```

---

## 🔒 License

Distributed under the MIT License.
