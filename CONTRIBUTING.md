# Contributors Guide

## Getting Started with Development

### Prerequisites
- Node.js v14.0.0 or higher
- npm v6.0.0 or higher
- MongoDB (local or Atlas)
- Git

### Local Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd trail-scout
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Setup environment variables**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration
```

4. **Start the application**
```bash
npm run dev
```

## Project Structure

```
trail-scout/
├── backend/                    # Express.js API server
│   ├── routes/                # API route handlers
│   │   ├── trails.js         # Trail CRUD operations
│   │   ├── users.js          # User authentication & profiles
│   │   └── reviews.js        # Trail reviews
│   ├── middleware/            # Custom middleware
│   ├── models/                # MongoDB schemas
│   ├── server.js             # Express app setup
│   ├── package.json
│   └── .env.example
│
├── frontend/                   # React.js SPA
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── Navigation.js
│   │   │   ├── TrailCard.js
│   │   │   └── TrailList.js
│   │   ├── pages/            # Page components
│   │   ├── App.js            # Root component
│   │   └── index.js          # Entry point
│   └── package.json
│
├── README.md                  # Project documentation
├── DEPLOYMENT.md              # Deployment guide
├── CONTRIBUTING.md            # This file
└── package.json              # Root package config
```

## Development Workflow

### Feature Development

1. **Create a new branch**
```bash
git checkout -b feature/your-feature-name
```

2. **Make your changes**
- Backend changes in `backend/` folder
- Frontend changes in `frontend/` folder

3. **Test your changes**
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: description of your feature"
```

5. **Push and create a Pull Request**
```bash
git push origin feature/your-feature-name
```

### Commit Message Guidelines

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `style:` for formatting
- `refactor:` for code refactoring
- `test:` for adding tests

Example: `feat: add user authentication with JWT`

## Backend Development

### Adding a New API Endpoint

1. **Create/Update route file** in `backend/routes/`
```javascript
router.get('/new-endpoint', (req, res) => {
  // Your logic here
});
```

2. **Import in server.js**
```javascript
app.use('/api/route-path', require('./routes/route-file'));
```

3. **Test with Postman or curl**
```bash
curl http://localhost:5000/api/route-path
```

## Frontend Development

### Creating a New Component

1. **Create component file** in `src/components/`
```javascript
import React from 'react';
import './ComponentName.css';

function ComponentName() {
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}

export default ComponentName;
```

2. **Add component styling** in `ComponentName.css`

3. **Import and use in parent component** or page

## Code Standards

### Backend
- Use ES6+ syntax
- Follow Express.js best practices
- Validate all inputs
- Use async/await for promises
- Add error handling

### Frontend
- Use functional components with Hooks
- Keep components small and focused
- Use meaningful variable names
- Implement proper error boundaries
- Write CSS with BEM methodology

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

Write tests for:
- Utility functions
- API integration
- Component rendering
- User interactions

## Debugging

### Backend Debugging
```bash
# Enable debug logs
DEBUG=* npm run dev
```

### Frontend Debugging
- Use React Developer Tools extension
- Chrome DevTools Elements/Console
- Network tab to check API calls

## Common Issues & Solutions

### MongoDB Connection Error
- Check MONGODB_URI in `.env`
- Ensure MongoDB is running locally or Atlas is accessible
- Check network whitelist for MongoDB Atlas

### CORS Errors
- Verify CORS settings in `backend/server.js`
- Check frontend API URL matches backend URL

### Port Already in Use
```bash
# Kill the process using the port
# On Windows: netstat -ano | findstr :5000
# npm install -g kill-port
# kill-port 5000
```

## Need Help?

- Check existing issues in GitHub
- Create a new issue with details and reproduction steps
- Reach out to maintainers

## Code Review Process

1. Submit a Pull Request
2. Wait for review from maintainers
3. Address any feedback
4. Merge once approved

Thank you for contributing to Trail Scout! 🥾
