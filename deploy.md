# 🚀 Deployment Guide

## GitHub Repository Setup

### Method 1: Using Git Command Line

1. **Install Git**: Download from https://git-scm.com/download/win
2. **Initialize Repository**:
   ```bash
   git init
   git add .
   git commit -m "🌙 Initial commit: Stock vs Moon Dashboard"
   ```
3. **Create GitHub Repository**: Go to github.com/new
4. **Connect and Push**:
   ```bash
   git remote add origin https://github.com/yourusername/stock-vs-moon-dashboard.git
   git branch -M main
   git push -u origin main
   ```

### Method 2: GitHub Desktop (Recommended)

1. **Download**: https://desktop.github.com/
2. **Install and Sign In**
3. **Add Repository**: File → Add Local Repository
4. **Select**: Your Dashboard folder
5. **Publish**: Click "Publish repository" button

### Method 3: Manual Upload

1. **Create Repository**: github.com/new
2. **Upload Files**: Use GitHub's web interface
3. **Drag and Drop**: All project files

## 🌐 Hosting Options

### Vercel (Recommended for Frontend)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
1. Connect GitHub repository
2. Build command: `cd frontend && npm run build`
3. Publish directory: `frontend/dist`

### Railway (Full-Stack)
1. Connect GitHub repository
2. Auto-deploys on push
3. Handles both frontend and backend

### Docker Deployment
```bash
docker-compose up --build -d
```

## 🔐 Environment Variables for Production

Set these in your hosting platform:
```env
ALPHA_VANTAGE_API_KEY=your_real_api_key
NODE_ENV=production
PORT=3001
```

## 📊 Performance Optimization

- Enable gzip compression
- Use CDN for static assets
- Implement API caching
- Add rate limiting

## 🔍 Monitoring

- Set up error tracking (Sentry)
- Monitor API usage
- Track user analytics
- Performance monitoring