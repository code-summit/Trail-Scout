# 🥾 Trail Scout - Quick Start Card

## Get Your Vocal Bridge API Key (2 minutes)

1. Go to **https://vocalbridgeai.com** in your browser
2. Click **"Sign Up"** (top right)
3. Create an account (email + password)
4. Go to **Dashboard**
5. Click **"Create Agent"** → Name: `Trail Scout`
6. Once agent is created, click on it
7. Find **API Key** → Copy it (starts with `vb_`)

**Save this key!** You'll need it in the next step.

---

## Set Up Trail Scout (5 minutes)

### On Windows
```bash
# Open Command Prompt in trail-scout folder
setup-voice.bat
# Paste your API key when prompted
```

### On Mac/Linux
```bash
# Open Terminal in trail-scout folder
bash setup-voice.sh
# Paste your API key when prompted
```

### Manual Setup
1. Open `backend/.env` with Note-pad
2. Find: `VOCAL_BRIDGE_API_KEY=vb_your_api_key_here`
3. Replace with your actual key: `VOCAL_BRIDGE_API_KEY=vb_abc123...`
4. Save file

---

## Start Chatting (1 minute)

### Run the App
```bash
npm run dev
```

### Open in Browser
Open **http://localhost:3000** in your web browser

### Talk to Trail Scout
1. Click **🎤 Start Voice Chat**
2. Grant microphone permission (browser will ask)
3. Say something like:
   - _"What's a good hiking trail for beginners?"_
   - _"I want a 5-mile hike with a waterfall"_
   - _"What do I need to bring on a day hike?"_

**That's it!** 🎉

---

## Try These Questions

### Trail Discovery
- "Find me an easy trail with scenic views"
- "What's the best trail near [city name]?"
- "I want a trail with waterfalls"

### Hiking Prep
- "What gear do I need for a 10-mile hike?"
- "How do I prepare for mountain hiking?"
- "Should I bring trekking poles?"

### Safety & Conditions
- "Tell me about hiking safety"
- "What's the weather like today?"
- "Are there any trail closures?"

---

## Controls During Call

| Button | Action |
|--------|--------|
| 🎤 | **Mute/Unmute** - Stop agent from listening |
| 📞 | **End Call** - Hang up |
| ✖️ | **Clear** - Erase transcript |

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| No microphone sound | Check browser/system volume |
| Microphone blocked | Browser → Settings → Microphone → Allow |
| Failed to connect | Paste correct API key in `.env` |
| Agent not responding | Publish agent in Vocal Bridge Dashboard |
| Can't hear agent | Check speaker volume, browser audio not muted |

**See `VOICE_TROUBLESHOOTING.md` for detailed help**

---

## Share with Friends

Once running, send them:
- **Local**: `http://your-computer-ip:3000`
- **Deployed**: `https://your-deployed-url.com`

They just need to:
1. Click the link
2. Click 🎤 **Start Voice Chat**
3. Grant microphone permission
4. Start talking!

---

## Documentation

- 📖 **README.md** - Project overview
- 🎤 **VOICE_INTEGRATION.md** - Detailed setup
- 🚀 **DEPLOYMENT.md** - Hosting guide
- 🔧 **VOICE_TROUBLESHOOTING.md** - Problem solving

---

## Need Help?

### Quick Checks
1. API key pasted correctly? ✓
2. Backend running? (`npm run dev`) ✓
3. Microphone permission granted? ✓
4. Agent published in Vocal Bridge? ✓

### Get Support
- Vocal Bridge: https://vocalbridgeai.com/docs
- GitHub Issues: [Your Repo]
- Email: support@vocalbridgeai.com

---

**Ready to explore trails by voice?** Let's go hiking! 🥾🎤
