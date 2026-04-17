# Trail Scout Voice Integration Guide

## Overview

Trail Scout now features full voice integration via the Vocal Bridge voice agent platform. Users can have natural conversations with the Trail Scout agent entirely through voice, without needing to type.

## Features

- 🎤 **Voice Interface**: Natural language interactions with the Trail Scout agent
- 📋 **Live Transcript**: See both user and agent messages in real-time
- 🎙️ **Mute/Unmute**: Control when the agent listens
- 📱 **Mobile Ready**: Works on all devices with microphone support
- 🔊 **Crystal Clear Audio**: WebRTC-based real-time communication
- 🤖 **Agent Personality**: Friendly, knowledgeable outdoor assistant

## Setup Instructions

### Prerequisites

1. **Vocal Bridge Account**: Sign up at [vocalbridgeai.com](https://vocalbridgeai.com)
2. **Agent Created**: Create "Trail Scout" agent in Vocal Bridge dashboard
3. **API Key**: Get your API key from the Vocal Bridge Dashboard

### Backend Setup

1. **Update Environment Variables**

```bash
# Copy the example file
cp backend/.env.example backend/.env

# Add your Vocal Bridge API Key
VOCAL_BRIDGE_API_KEY=vb_your_api_key_here
VOCAL_BRIDGE_API_URL=http://vocalbridgeai.com/api/v1
```

2. **Install Dependencies**

```bash
cd backend
npm install
```

3. **Verify Configuration**

The backend will automatically provide voice tokens at `/api/voice/token` endpoint.

### Frontend Setup

1. **Install Dependencies**

```bash
cd frontend
npm install
```

2. **The Voice Agent** is automatically initialized when the app starts. No additional configuration needed!

### Running the Application

```bash
# From project root
npm run dev
```

Then open `http://localhost:3000` in your browser.

## How to Use

### Starting a Voice Conversation

1. Click the **"🎤 Start Voice Chat"** button
2. Grant microphone permission when your browser asks
3. The agent will greet you: _"Hey, Trail Scout here! Planning a hike or adventure?..."_
4. Start speaking your query

### During a Conversation

- **Live Transcript**: Your words and the agent's responses appear in real-time
- **Voice Feedback**: The agent speaks back to you
- **Controls**:
  - 🎤 **Mute Button**: Tap to stop the agent from listening
  - 📞 **End Call**: Disconnect when done
  - ✖️ **Clear**: Clear the transcript

### Example Queries

Try these voice commands:

- _"What's a good beginner-friendly trail near me?"_
- _"I'm planning a 5-mile hike, what gear do I need?"_
- _"What are current conditions at Devil's Lake?"_
- _"Tell me about hiking safety tips"_
- _"I need a trail that's kid-friendly with water features"_

## Agent Capabilities

The Trail Scout voice agent helps with:

- 🥾 **Trail Recommendations** - Difficulty, distance, elevation recommendations
- 🌤️ **Conditions & Weather** - Current trail status and forecasts
- 🎒 **Gear Advice** - Equipment recommendations based on conditions
- ⚠️ **Safety Tips** - Leave-no-trace principles and safety guidelines
- 📍 **Route Planning** - Navigation help and permit requirements
- 🗺️ **Location Details** - Trail features, facilities, access info

## Architecture

### Backend Routes

#### `/api/voice/token` (POST)
Generates a LiveKit access token for voice agent connection.

**Request:**
```json
{
  "participantName": "Optional User Name"
}
```

**Response:**
```json
{
  "success": true,
  "livekit_url": "wss://livekit-server.example.com",
  "token": "JWT_token_here",
  "room_name": "room-id",
  "participant_identity": "user-id",
  "expires_in": 3600
}
```

#### `/api/voice/health` (GET)
Check if voice agent is configured.

**Response:**
```json
{
  "status": "configured",
  "message": "Voice agent is ready"
}
```

### Frontend Components

#### `VoiceAgent.js`
Main component that:
- Initializes Vocal Bridge SDK
- Manages connection state
- Displays live transcript
- Handles user controls

#### `VoiceAgentContext.js` (Optional)
React Context for global voice agent state management.

## Event Handling

The voice agent emits several events:

### Transcript Event
```javascript
vb.on('transcript', ({ role, text, timestamp }) => {
  // role: 'user' or 'assistant'
  // text: the message
  // timestamp: when it was spoken
});
```

### Agent Actions
```javascript
vb.on('agentAction', ({ action, payload }) => {
  // Custom actions from the agent
  // Examples: search_trail, get_weather, etc.
});
```

### Error Event
```javascript
vb.on('error', (err) => {
  console.error(err.code, err.message);
});
```

### Heartbeat (Built-in)
The agent automatically sends heartbeat messages to verify connection:
```json
{
  "type": "client_action",
  "action": "heartbeat",
  "payload": { "timestamp": 1708123456789 }
}
```

## Troubleshooting

### "Microphone Permission Denied"
- Check browser microphone permissions in Settings
- Click the permission prompt when prompted
- Try a different browser if issue persists

### "Failed to generate voice token"
- Verify `VOCAL_BRIDGE_API_KEY` in `.env`
- Check the backend is running (`npm run dev`)
- Ensure API key has proper permissions in Vocal Bridge Dashboard

### "No agent response"
- Check internet connection
- Verify the voice agent is active in Vocal Bridge Dashboard
- Try starting a new conversation
- Check browser console for errors

### Audio Issues
- Test microphone in browser settings
- Ensure no other app is blocking the microphone
- Check audio output levels in system settings
- Try different browser (Chrome/Edge recommended)

## Performance Optimization

### For Mobile Users
- Voice interface reduces data usage vs. video
- Works on 4G/LTE with good latency
- Automatic audio compression

### For Server
- Token generation is lightweight
- WebRTC uses minimal bandwidth
- Horizontal scaling supported via load balancer

## Security

### API Key Protection
- API key is stored only on backend
- Frontend communicates via secure endpoint
- Tokens have 1-hour expiration

### User Privacy
- Voice data is encrypted in transit
- No user data stored without consent
- Transcripts can be cleared anytime

## Customization

### Modify Agent Greeting
Edit the greeting in Vocal Bridge Dashboard:

```
Hey, Trail Scout here! Planning a hike or adventure? 
Ask me about trails, conditions, gear, or anything outdoors -- 
I've got you covered.
```

### Customize Agent Responses
Use Vocal Bridge CLI to update the system prompt:

```bash
vb prompt edit
```

### Change UI Colors
Edit `VoiceAgent.css`:
```css
.voice-agent-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## CLI Management

Use the Vocal Bridge CLI to manage your voice agent:

```bash
# View agent info
vb agent

# Check call logs
vb logs

# Update system prompt
vb prompt edit

# View statistics
vb stats

# Stream debug events
vb debug
```

See [Vocal Bridge CLI Docs](https://vocalbridgeai.com/docs/cli) for more.

## Next Steps

1. **Deploy Backend**: Host backend on Azure App Service or similar
2. **Deploy Frontend**: Host frontend on Vercel or Azure Static Web Apps
3. **Share with Friends**: Send the deployed URL to friends
4. **Monitor Calls**: Use Vocal Bridge Dashboard to see call analytics

## Support

- Vocal Bridge Docs: https://vocalbridgeai.com/docs
- GitHub Issues: [Trail Scout Issues](https://github.com)
- Email Support: support@vocalbridgeai.com

---

**Ready to chat with Trail Scout?** Start the app and tap the microphone! 🥾
