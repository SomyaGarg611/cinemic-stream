# 🎬 CINEMIC - Movie & TV Show Discovery Platform

A modern, full-stack movie and TV show discovery platform built with React and Node.js. Browse trending content, discover popular movies and shows, watch trailers, and explore detailed information about your favorite entertainment.

![Cinemic](https://img.shields.io/badge/React-18.2.0-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![TMDB](https://img.shields.io/badge/API-TMDB-orange)

## ✨ Features

- 🎥 **Comprehensive Movie & TV Data** - Powered by TMDB API
- 🔥 **Trending Content** - Daily trending movies and TV shows  
- ⭐ **Popular Content** - Most popular movies and TV shows
- 🎞️ **Watch Trailers** - In-app trailer playback with YouTube integration
- 🔍 **Advanced Search** - Search movies, TV shows, and people
- 🎭 **Genre Browsing** - Browse content by genre with dedicated pages
- 📱 **Mobile Responsive** - Optimized for all screen sizes
- 🌙 **Dark Theme** - Beautiful dark UI with smooth animations
- 🔒 **Secure Backend** - Protected API keys and secure architecture
- 📧 **Contact Form** - Working contact form with email notifications
- ⚡ **Fast Performance** - Optimized loading and caching

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Redux Toolkit** - Efficient state management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

### Backend  
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **NodeMailer** - Email service integration
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **TMDB API** - Movie and TV show data
- **YouTube** - Trailer integration

## 📦 Installation & Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn
- TMDB API key ([Get it here](https://www.themoviedb.org/settings/api))

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd cinemic
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

**Backend Environment (server/.env):**
```env
# TMDB API Configuration (Required)
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=
TMDB_IMAGE_BASE_URL=

# Server Configuration
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development

# Email Configuration (Optional - for contact form)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=your_email@gmail.com
```

### 4. Start the Application

**Development Mode:**
```bash
# Start backend server (Terminal 1)
cd server
npm start

# Start frontend (Terminal 2) 
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment on Vercel

### Method 1: Frontend + Serverless Functions (Recommended)

**Step 1: Prepare for Deployment**
```bash
# Build the frontend
npm run build
```

**Step 2: Deploy Frontend to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Follow prompts, set build command to `npm run build`
5. Set output directory to `build`

**Step 3: Deploy Backend as Serverless Functions**

Create `api/` folder in root and move server files:
```bash
mkdir api
cp server/server.js api/index.js
cp -r server/routes api/
cp -r server/controllers api/ 
cp -r server/services api/
cp -r server/middleware api/
cp server/package.json api/
```

Update `api/index.js` for Vercel:
```javascript
const express = require('express');
const app = express();

// Import your existing server setup
// ... (your server code)

module.exports = app;
```

**Step 4: Configure Vercel**

Create `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "build/**/*",
      "use": "@vercel/static"
    },
    {
      "src": "api/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ],
  "env": {
    "TMDB_API_KEY": "@tmdb-api-key",
    "EMAIL_USER": "@email-user", 
    "EMAIL_PASSWORD": "@email-password",
    "ADMIN_EMAIL": "@admin-email"
  }
}
```

**Step 5: Set Environment Variables**
```bash
vercel env add TMDB_API_KEY
vercel env add EMAIL_USER
vercel env add EMAIL_PASSWORD  
vercel env add ADMIN_EMAIL
```

**Step 6: Deploy**
```bash
vercel --prod
```

### Method 2: Separate Frontend + Backend Deployment

**Frontend (Vercel):**
1. Create new Vercel project from GitHub
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push

**Backend (Railway/Heroku/DigitalOcean):**
1. Deploy `server/` folder to your preferred platform
2. Set environment variables in platform dashboard
3. Update frontend API URLs to point to deployed backend

## 📡 API Endpoints

### Movies
- `GET /api/tmdb/trending/movie/:timeWindow` - Trending movies
- `GET /api/tmdb/movies/:category` - Movies by category (popular, top_rated, etc.)
- `GET /api/tmdb/movie/:id` - Movie details with videos and credits

### TV Shows  
- `GET /api/tmdb/trending/tv/:timeWindow` - Trending TV shows
- `GET /api/tmdb/tv/:category` - TV shows by category
- `GET /api/tmdb/tv/:id` - TV show details with videos and credits

### Search & Discovery
- `GET /api/tmdb/search/:type?query=` - Search movies, TV shows, people
- `GET /api/tmdb/genres/:type` - Get genres for movies or TV
- `GET /api/tmdb/discover/:type` - Discover content with filters

### Utility
- `GET /api/health` - Server health check
- `POST /api/email/contact` - Send contact form email

## 📁 Project Structure

```
cinemic/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable components
│   │   │   ├── MediaCard.js # Movie/TV show cards
│   │   │   ├── MediaGrid.js # Responsive grid layout  
│   │   │   ├── Slider.js    # Horizontal content slider
│   │   │   └── TrailerModal.js # Trailer popup
│   │   └── layout/          # Layout components
│   │       ├── Header.js    # Navigation header
│   │       ├── Footer.js    # Footer with links
│   │       └── Layout.js    # Main layout wrapper
│   ├── pages/              # Page components
│   │   ├── HomePage.js     # Landing page with trending content
│   │   ├── MoviesPage.js   # Movies by category
│   │   ├── TvShowsPage.js  # TV shows by category
│   │   ├── SearchPage.js   # Search results
│   │   ├── GenresPage.js   # Browse by genre
│   │   └── *DetailPage.js  # Movie/TV detail pages
│   ├── redux/
│   │   ├── store.js        # Redux store configuration
│   │   └── slices/         # Redux Toolkit slices
│   │       ├── moviesSlice.js
│   │       ├── tvShowsSlice.js
│   │       ├── searchSlice.js
│   │       └── uiSlice.js
│   ├── services/
│   │   └── tmdbApi.js      # API service layer
│   └── utils/
│       └── helpers.js      # Utility functions
├── server/                 # Backend API
│   ├── server.js          # Main server file
│   ├── routes/            # API routes
│   ├── controllers/       # Route handlers
│   ├── services/          # Business logic
│   └── middleware/        # Custom middleware
└── public/                # Static assets
```

## 🎨 Key Features Breakdown

### 🏠 **Homepage**
- Hero banner with random trending content
- Trending Movies carousel
- Popular Movies carousel  
- Trending TV Shows carousel
- Popular TV Shows carousel

### 🎬 **Movies & TV Shows Pages**
- Category filtering (Popular, Top Rated, Now Playing, Upcoming)
- Responsive grid layout with optimized card sizes
- Load more functionality
- Detailed information cards

### 🔍 **Search**
- Multi-type search (movies, TV shows, people)
- Filter by content type
- Real-time results
- Mobile-optimized interface

### 🎞️ **Detail Pages**
- High-quality poster and backdrop images
- Comprehensive movie/show information
- Cast and crew details
- Trailers and videos
- Related recommendations
- Genre tags and ratings

### 📧 **Contact System**
- Working contact form with validation  
- Email notifications to admin
- Auto-reply to users
- Professional email templates
- Secure server-side processing

## 🛡️ Security & Best Practices

- ✅ Environment variables for sensitive data
- ✅ CORS configuration for allowed origins  
- ✅ Input validation on all forms
- ✅ Secure email handling
- ✅ No exposed API keys in frontend
- ✅ Rate limiting on API endpoints
- ✅ Error handling and logging

## 📱 Browser Support

- ✅ Chrome (90+)
- ✅ Firefox (88+) 
- ✅ Safari (14+)
- ✅ Edge (90+)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for providing the comprehensive movie and TV data API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) team for the amazing frontend library


---

**Made with ❤️ by Somya Garg**
