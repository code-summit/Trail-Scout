# Voice Agent Troubleshooting Guide

## Common Issues & Solutions

### 🔴 "Failed to generate voice token"

**Symptoms**: Error message when clicking "Start Voice Chat"

**Causes & Solutions**:

```
❌ Missing API key in backend/.env
✅ Add VOCAL_BRIDGE_API_KEY=vb_your_key_here

❌ API key is expired/invalid
✅ Go to vocalbridgeai.com, regenerate key in dashboard

❌ Backend not running
✅ Run npm run dev in terminal

❌ Wrong API endpoint
✅ Ensure VOCAL_BRIDGE_API_URL is set (default: http://vocalbridgeai.com/api/v1)

❌ Agent not published in Vocal Bridge
✅ Go to Vocal Bridge Dashboard, publish the "Trail Scout" agent
```

**Test the backend**:
```bash
curl http://localhost:5000/api/voice/health
# Should return: { "status": "configured" }
```

---

### 🔴 "Microphone Permission Denied"

**Symptoms**: Browser blocks microphone access

**Solutions**:

**Chrome/Edge**:
1. Click the lock icon 🔒 in address bar
2. Click "Permissions"
3. Find "Microphone"
4. Change from "Block" to "Allow"
5. Refresh page

**Firefox**:
1. Click the info icon in address bar
2. Find "Microphone"
3. Set to "Allow"
4. Refresh page

**Safari**:
1. Go to Settings → Privacy → Microphone
2. Find trail-scout domain
3. Click "Allow"
4. Refresh page

**Check your system**:
- Windows: Settings → Privacy & Security → Microphone → Allow apps
- macOS: System Preferences → Security & Privacy → Microphone
- Restart browser after changing permissions

---

### 🔴 "No Agent Response"

**Symptoms**: Clicked start, said something, but no response

**Causes & Solutions**:

```
❌ Agent is not published
✅ Vocal Bridge Dashboard → Publish agent

❌ Agent is in development mode
✅ Publish as "production" not "development"

❌ Network timeout
✅ Try refreshing page and reconnecting

❌ Server-side error
✅ Check browser console (F12 → Console tab)
✅ Check backend logs for errors
```

**Check agent status**:
```bash
vb agent  # View agent info
vb stats  # View recent call stats
```

---

### 🔴 "No Sound / Can't Hear Agent"

**Symptoms**: Text appears in transcript but no audio plays

**Solutions**:

```
❌ System volume muted
✅ Check Windows volume mixer or macOS volume

❌ Browser audio disabled
✅ Chrome: Settings → Privacy → Site Settings → Sound → Allow

❌ Headphones disconnected
✅ Plug in headphones or speaker

❌ Speaker not selected
✅ Browser may be outputting to wrong device
```

**Test audio**:
```javascript
// In browser console (F12)
const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
audio.play(); // Should beep
```

---

### 🔴 "Connection Drops / Lag"

**Symptoms**: Started fine but disconnected mid-conversation

**Causes & Solutions**:

```
❌ Unstable internet
✅ Connect to stable WiFi or wired connection
✅ Check: speedtest.net (need >2 Mbps)

❌ Browser tab backgrounded
✅ Click back to browser tab (some browsers pause audio)

❌ WebRTC firewall blocking
✅ Test: webRTC.github.io/samples (check connectivity)
✅ May need VPN or network admin help

❌ Server-side connection issues
✅ Restart backend: npm run dev
```

**Check network**:
- Open browser DevTools (F12)
- Network tab
- Look for failed `/api/voice/token` requests
- Check status code (should be 200)

---

### 🔴 "Microphone Input Not Working"

**Symptoms**: Clicked start, button shows "muted" or no transcript appears

**Solutions**:

```
❌ Microphone blocked by browser
✅ Grant permission (see "Microphone Permission Denied" above)

❌ Mic input level too low
✅ Speak louder or closer to microphone
✅ Check system mic levels (Settings)

❌ Wrong microphone selected
✅ System Settings → Sound → Input → Select correct mic
```

**Test microphone**:
```bash
# macOS/Linux
arecord -d 2 test.wav && play test.wav

# Windows
recorder test.wav (then SPACE, then ENTER)
```

---

### 🔴 "CORS Error"

**Symptoms**: Console shows error: `No 'Access-Control-Allow-Origin' header`

**Solutions**:

```
❌ Backend CORS not configured
✅ Check backend/server.js has app.use(cors())

❌ Frontend URL not in CORS_ORIGIN
✅ If deployed, set CORS_ORIGIN to frontend domain

❌ Different port for frontend and backend
✅ Frontend: localhost:3000
✅ Backend: localhost:5000
✅ CORS should allow both
```

**Fix in backend**:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

### 🔴 "Agent Says Nothing / Silent Response"

**Symptoms**: Agent understands question but doesn't respond with voice

**Solutions**:

```
❌ Agent system prompt missing
✅ Vocal Bridge Dashboard → Agent settings → Verify system prompt

❌ Agent in "silent mode"
✅ Check agent configuration → Enable speech output

❌ Text appears but no audio
✅ See "No Sound" section above
```

---

### 🟡 "Slow to Start / Initial Latency"

**Symptoms**: Takes 3-5 seconds to hear first response

**Normal**: First response can take 2-3 seconds (API calls, processing)

**If timeout occurs**:
```
❌ Cold start - server warming up
✅ Try again - should be faster

❌ Slow internet
✅ Check connection speed (need >2 Mbps upload for mic)

❌ Overloaded server
✅ Scale up backend or add more servers
```

---

### 🟡 "Transcript Doesn't Update"

**Symptoms**: Speaking but text doesn't appear in real-time

**Solutions**:

```
❌ Speech recognition not working
✅ Check browser console for errors (F12)

❌ Connection unstable
✅ Refresh and try reconnecting

❌ Browser doesn't support WebRTC
✅ Use Chrome, Edge, or Firefox (latest versions)
```

**Check browser support**:
```javascript
// Browser console (F12)
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  console.log('✅ WebRTC supported');
} else {
  console.log('❌ WebRTC not supported');
}
```

---

## Advanced Troubleshooting

### Enable Debug Logging

**Backend**:
```bash
DEBUG=* npm run dev
```

**Frontend** (Chrome DevTools):
1. F12 to open DevTools
2. Go to Console tab
3. Look for `VoiceAgent:` prefixed logs
4. Look for errors in red

### Check Call Logs

```bash
# View recent calls
vb logs

# View specific call
vb logs <session_id>

# View full details
vb logs <session_id> --json
```

### Stream Live Debug Events

```bash
# First enable Debug Mode in Vocal Bridge Dashboard
vb debug

# Or use HTTP polling instead of WebSocket
vb debug --poll
```

### Test Token Generation

```bash
curl -X POST http://localhost:5000/api/voice/token \
  -H "Content-Type: application/json" \
  -d '{"participantName":"Test User"}' | jq
```

Expected response:
```json
{
  "success": true,
  "livekit_url": "wss://...",
  "token": "eyJ...",
  "room_name": "room-...",
  "expires_in": 3600
}
```

---

## Getting Help

### 📚 Documentation
- [Vocal Bridge Docs](https://vocalbridgeai.com/docs)
- [Trail Scout README](README.md)
- [Voice Integration Guide](VOICE_INTEGRATION.md)

### 🔧 CLI Tools
```bash
# Install CLI
pip install vocal-bridge

# View agent
vb agent

# Update prompt
vb prompt edit

# Check stats
vb stats
```

### 💬 Support
- Email: support@vocalbridgeai.com
- Dashboard: vocalbridgeai.com/dashboard
- GitHub Issues: [Trail Scout Issues]

### 🧪 Testing Tools
- Test WebRTC: [webRTC.github.io/samples](https://webrtc.github.io/samples)
- Test Microphone: [microphone-test.com](https://microphone-test.com)
- Test Network: [speedtest.net](https://speedtest.net)

---

## Quick Fix Checklist

Before requesting support, try:

- [ ] Refresh browser page (Ctrl+R or Cmd+R)
- [ ] Check API key in backend/.env
- [ ] Run `npm run dev` again
- [ ] Check microphone permissions
- [ ] Check system volume
- [ ] Try different browser
- [ ] Check internet connection
- [ ] Check browser console for errors (F12)
- [ ] Check backend logs
- [ ] Clear browser cache (Ctrl+Shift+Del)

---

💡 **Still stuck?** Check backend logs: `npm run dev 2>&1 | grep -i error`
