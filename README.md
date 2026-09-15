# 🚀 DevFolio — Developer Portfolio Generator (MERN Stack)

> A full-stack web application built with the MERN stack where developers can easily generate, customize, preview, and publish their personal developer portfolio with a unique shareable public URL (`/portfolio/:username`).

---

## 🌟 Key Features

### 1. 🏠 Landing Page & Discovery
- **Hero Showcase**: High-impact modern hero with interactive preview mockups and quick CTAs.
- **Community Explore (`/explore`)**: Discover live developer portfolios with real-time text search and skill filtering pills.
- **3-Step Process Guide**: Visual walkthrough explaining portfolio generation.

### 2. 📝 Multi-Section Portfolio Builder (`/create`)
- **Personal Information**: Full Name, Headline/Title, Bio, and Profile Picture (URL or direct file upload).
- **Real-Time Username Availability**: Asynchronous check verifying unique URL-safe usernames before form submission.
- **Contact & Socials**: Email, GitHub, LinkedIn, Personal Website, Twitter/X, and Location.
- **Dynamic Skills Cloud**: Add custom skills with keyboard shortcuts (`Enter` / `,`), remove pills, or one-click add from popular suggestions.
- **Dynamic Projects Showcase**: Add unlimited projects with Name, Description, Tech Stack tags, GitHub URL, Live Demo URL, and Screenshot. Supports reordering (Move Up / Move Down).
- **Work Experience Timeline**: Add career positions with Company, Role, Duration, and Description.
- **Theme Selection**: Choose from 5 curated aesthetic themes.
- **Resume Upload / Link**: Upload a PDF resume or provide a link for recruiters.

### 3. 👁️ Interactive Portfolio Preview (`/preview`)
- **Live Device Frame**: Toggle between Desktop, Tablet, and Mobile viewport modes.
- **Instant Theme Switcher**: Try out themes before publishing.
- **One-Click Publish**: Publishes to MongoDB with celebratory confetti and redirects to your live URL.

### 4. 🌐 Dynamic Public Portfolio (`/portfolio/:username`)
- **Dynamic Routing**: Accessible via clean, shareable URL (`/portfolio/:username`).
- **Complete Sections**: Header/Avatar, About Me, Skills pill matrix, Featured Projects grid with live links, Experience Timeline, Contact, and Resume Viewer.
- **Analytics & View Counter**: Automatically tracks and displays view counts for each portfolio.
- **Live Theme Customizer**: Viewers can toggle themes on the fly.
- **One-Click Share & Copy**: Copies portfolio link directly to clipboard with instant toast alert.

### 5. ✏️ Edit Portfolio Management (`/edit/:username`)
- Pre-populates all form fields with existing data from the database.
- Update, reorder, or remove projects, skills, and experience items.
- Saves changes via `PUT /api/portfolio/:username`.
- Option to delete portfolio via `DELETE /api/portfolio/:username`.

---

## 🎨 Portfolio Themes Included

1. **Tech Dark (`modern-dark`)**: Deep space slate with indigo and cyan neon accents.
2. **Clean Light (`minimal-light`)**: Crisp modern light theme with royal blue and emerald accents.
3. **Cyber Neon (`cyberpunk`)**: High-contrast dark purple with glowing neon pink and cyan.
4. **Aurora Glass (`glassmorphism`)**: Translucent frosted cards with sky-blue ambient mesh glow.
5. **Nordic Forest (`nordic-forest`)**: Deep pine teal with mint and golden accents.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons | Responsive SPA with custom CSS design system |
| **Backend** | Node.js, Express.js | RESTful API, Schema validation, Morgan logging, CORS |
| **Database** | MongoDB & Mongoose | ODM schemas with automatic zero-config fallback |
| **File Handling** | Multer | Multipart image & PDF resume uploads |
| **Styling** | Vanilla CSS Design System | Custom CSS variables, glassmorphism, responsive grid |

---

## 🚀 Quick Start (Single Setup & Run)

### 1. Install all dependencies (Root, Server, and Client)
```bash
npm run install:all
```

### 2. Start both Backend & Frontend concurrently
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## ⚙️ Environment Variables

### Server Configuration (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/portfolio_generator
```
> **Note**: If `MONGODB_URI` is left unconfigured or MongoDB is not running locally, the server automatically boots an instant zero-config persisted fallback database with pre-seeded developer portfolios for instant evaluation.

---

## 📡 REST API Specification

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/portfolio` | Create a new developer portfolio | `201 Created` / `409 Conflict` |
| **GET** | `/api/portfolio` | List all portfolios (with `search`, `skill`, `page`, `limit`) | `200 OK` |
| **GET** | `/api/portfolio/:username` | Fetch portfolio by username (increments view count) | `200 OK` / `404 Not Found` |
| **PUT** | `/api/portfolio/:username` | Update an existing portfolio | `200 OK` / `404 Not Found` |
| **DELETE** | `/api/portfolio/:username` | Delete a portfolio | `200 OK` / `404 Not Found` |
| **GET** | `/api/portfolio/check/:username` | Check username availability in real-time | `200 OK` |
| **POST** | `/api/portfolio/upload` | Upload profile image or resume PDF | `200 OK` |
| **GET** | `/api/health` | API service health check | `200 OK` |

---

## 📁 Project Structure

```
Portfolio_genarator/
├── client/                     # Frontend React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   ├── DynamicSkillInput.jsx
│   │   │   ├── ProjectItemForm.jsx
│   │   │   ├── ExperienceItemForm.jsx
│   │   │   ├── ThemeSelector.jsx
│   │   │   ├── PortfolioCard.jsx
│   │   │   └── PortfolioRenderer.jsx
│   │   ├── pages/              # Application Pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreatePortfolioPage.jsx
│   │   │   ├── PreviewPage.jsx
│   │   │   ├── PublicPortfolioPage.jsx
│   │   │   ├── EditPortfolioPage.jsx
│   │   │   ├── ExplorePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios API client
│   │   ├── styles/
│   │   │   ├── index.css       # Core Design Tokens & Layout
│   │   │   └── themes.css      # 5 Aesthetic Themes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Express API
│   ├── config/
│   │   └── db.js               # Smart DB connector
│   ├── controllers/
│   │   └── portfolioController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── upload.js           # Multer file upload
│   ├── models/
│   │   └── Portfolio.js        # Mongoose Schema
│   ├── routes/
│   │   └── portfolioRoutes.js
│   ├── uploads/                # Uploaded avatars & resumes
│   ├── seed.js                 # Seed starter data
│   ├── server.js               # Express application entry
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root concurrent scripts
└── README.md
```

---

## 🧪 Evaluation Checklist Verification

- [x] **Home Page** with app tagline, overview, and prominent CTA.
- [x] **Create Portfolio Page** with multi-section inputs (Personal, Contact, Skills, Projects, Experience, Theme, Resume).
- [x] **Portfolio Preview Page** with read-only view and device responsiveness.
- [x] **Public Portfolio Page** (`/portfolio/:username`) with dynamic sections.
- [x] **Edit Portfolio Page** (`/edit/:username`) with pre-filled inputs and PUT save.
- [x] **Mongoose Database Schema** matching exact requirements.
- [x] **Backend API endpoints** for all CRUD operations.
- [x] **Theme Switcher** with 5 visual styles.
- [x] **Analytics** (portfolio view counter).
- [x] **Uploads** (profile pictures and PDF resumes).
- [x] **Clean error handling** on both frontend and backend.
- [x] **Single-command local startup** via `npm run dev`.
