# Deployment Guide

## Voice Agent Configuration

**IMPORTANT**: Before deploying, ensure you have:

1. **Vocal Bridge API Key**
   - Sign up at https://vocalbridgeai.com
   - Create a "Trail Scout" agent
   - Copy API key from dashboard

2. **Environment Variable**
   - Add `VOCAL_BRIDGE_API_KEY=vb_your_key_here` to production `.env`

---

## Quick Start (Local Development)

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure Environment**
   - Copy `backend/.env.example` to `backend/.env`
   - Update MongoDB URI and JWT_SECRET

3. **Start Development Servers**
   ```bash
   npm run dev
   ```
   - Backend runs on http://localhost:5000
   - Frontend runs on http://localhost:3000

## Production Deployment

### Option 1: Azure

#### Backend (Azure App Service)
1. Create an Azure App Service (Node.js)
2. Configure deployment from Git
3. Set environment variables in App Service settings
4. Deploy using Git push or GitHub Actions

#### Frontend (Azure Static Web Apps)
1. Create an Azure Static Web App
2. Build: `cd frontend && npm run build`
3. Deploy the `build` folder to Static Web Apps

#### Database (Azure Cosmos DB or MongoDB Atlas)
- Create a Cosmos DB MongoDB API instance
- Update MONGODB_URI in backend environment variables

### Option 2: Heroku

#### Backend
```bash
cd backend
git push heroku main
```

#### Frontend
```bash
cd frontend
npm run build
# Deploy to Vercel or Netlify
```

### Option 3: Digital Ocean / Self-Hosted

1. Set up Ubuntu server
2. Install Node.js and MongoDB
3. Clone repository
4. Configure environment variables
5. Run with PM2 or systemd
6. Set up Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/trail-scout
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
VOCAL_BRIDGE_API_KEY=vb_your_api_key_here
VOCAL_BRIDGE_API_URL=http://vocalbridgeai.com/api/v1
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://api.yourdomain.com
```

**⚠️ CRITICAL**: Never commit `.env` files with real API keys to version control!

## Domain & SSL

1. Register a domain
2. Configure DNS to point to your server
3. Set up SSL certificate (Let's Encrypt)
4. Update CORS_ORIGIN in backend .env

## Monitoring & Maintenance

- Monitor logs: `docker logs trail-scout-backend`
- Database backups: Enable automated backups in MongoDB Atlas
- Performance monitoring: Use Azure Application Insights or DataDog
- Email notifications: Set up alerts for errors

## Troubleshooting

### Frontend can't connect to backend
- Check CORS settings in backend
- Verify API_URL in frontend .env
- Ensure backend is accessible from your domain

### No data loading
- Check MongoDB connection string
- Verify database exists
- Check API endpoint responses

### Performance issues
- Enable caching headers
- Set up CDN for static assets
- Optimize database queries
- Consider using Redis for caching

## Sharing with Friends

### Access URL
- Share with friends: `https://your-domain.com`
- Backend API: `https://api.your-domain.com/api/`

### Setup for Friends
- No installation needed - just open the URL in browser
- They can create accounts and start exploring trails
- Share trail links to collaborate

---

For more help, check the main README.md
