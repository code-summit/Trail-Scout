# Trail Scout

A **voice-first** web application for discovering, sharing, and tracking hiking trails with friends over the internet. Talk to your personal outdoor assistant powered by AI!

## Features

- 🎤 **Voice-First Interface** - Natural conversations with Trail Scout agent
- 📋 **Live Transcript** - See messages as you speak
- 🥾 **Trail Recommendations** - Get suggestions by difficulty, distance, elevation
- 🗺️ **Trail Info** - Current conditions, weather, permit requirements
- 🎒 **Gear Advice** - Equipment recommendations from an outdoor expert
- ⚠️ **Safety Tips** - Learn best practices and leave-no-trace principles
- 👥 **Social Features** - Share trails with friends through voice
- 📱 **Works Anywhere** - Desktop, tablet, or mobile with microphone

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Getting Started

### Prerequisites
- Node.js (v14+)
- Vocal Bridge Account (https://vocalbridgeai.com)
- npm or yarn

### Quick Setup (1 minute)

1. **Get Vocal Bridge API Key**
   - Sign up at https://vocalbridgeai.com
   - Create a new agent named "Trail Scout"
   - Copy your API key

2. **Configure Backend**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and paste your Vocal Bridge API key:
   # VOCAL_BRIDGE_API_KEY=vb_your_key_here
   ```

3. **Install & Run**
   ```bash
   npm run install-all
   npm run dev
   ```

4. **Open Your Browser**
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000
   - Click "🎤 Start Voice Chat" and grant microphone access
   - Speak naturally to Trail Scout!

### Example Voice Commands

Try saying:
- _"What's a good beginner trail nearby?"_
- _"What do I need to bring for a 5-mile hike?"_
- _"Tell me about trail safety"_
- _"Find a waterfall hike"_

---

For detailed voice integration setup, see **[VOICE_INTEGRATION.md](VOICE_INTEGRATION.md)**

## API Endpoints

### Voice Agent
- `POST /api/voice/token` - Get LiveKit token for voice connection
- `GET /api/voice/health` - Check if voice agent is configured

### Trails
- `GET /api/trails` - Get all trails
- `GET /api/trails/:id` - Get single trail
- `POST /api/trails` - Create new trail
- `PUT /api/trails/:id` - Update trail
- `DELETE /api/trails/:id` - Delete trail

### Users
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile/:id` - Update profile

### Reviews
- `GET /api/reviews/trail/:trailId` - Get trail reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Deployment

### Key Configuration

Before deploying, ensure you have:
1. **Vocal Bridge API Key** - Get from vocalbridgeai.com
2. **Set Environment Variables** - Add VOCAL_BRIDGE_API_KEY to production `.env`

### Deploy to Production

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for detailed cloud deployment guides:
- Azure App Service
- Heroku
- DigitalOcean
- AWS

### Recommended Hosting
- **Backend**: Azure App Service, Heroku, or DigitalOcean
- **Frontend**: Vercel, Netlify, or Azure Static Web Apps
- **Voice Agent**: Powered by Vocal Bridge (no additional hosting needed)

## Project Structure

```
trail-scout/
├── backend/
│   ├── routes/
│   │   ├── voice.js           # Voice agent token endpoint
│   │   ├── trails.js
│   │   ├── users.js
│   │   └── reviews.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── VoiceAgent.js     # Main voice interface
│   │   │   ├── VoiceAgent.css
│   │   │   ├── Navigation.js
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── VoiceAgentContext.js  # Voice state management
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── README.md                  # Project documentation
├── VOICE_INTEGRATION.md       # Voice setup guide
├── DEPLOYMENT.md              # Deployment guide
├── CONTRIBUTING.md            # Developer guide
└── package.json              # Root package config
```

## Development

### Add a New Feature
1. Create a new route in the backend
2. Add API calls in frontend components
3. Test locally before deployment

### Running Tests
```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test
```

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## License

MIT License - feel free to use this project however you like.

## Support

For issues and questions, please create an issue in the repository.

---

Happy hiking! 🏔️
