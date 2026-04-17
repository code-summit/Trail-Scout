# Trail Scout Architecture - Voice Integration

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS' BROWSERS                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                            │   │
│  │  ┌────────────────────────────────────────────────────┐   │   │
│  │  │          React Frontend (Port 3000)                │   │   │
│  │  │  ┌──────────────────────────────────────────────┐  │   │   │
│  │  │  │          VoiceAgent.js Component             │  │   │   │
│  │  │  │  ┌──────────────────────────────────────┐    │  │   │   │
│  │  │  │  │  Vocal Bridge SDK (@vocalbridgeai/   │    │  │   │   │
│  │  │  │  │  react)                               │    │  │   │   │
│  │  │  │  │  ├─ Connect/Disconnect                │    │  │   │   │
│  │  │  │  │  ├─ Microphone Control                │    │  │   │   │
│  │  │  │  │  ├─ Live Transcript                   │    │  │   │   │
│  │  │  │  │  └─ Event Listeners                   │    │  │   │   │
│  │  │  │  └──────────────────────────────────────┘    │  │   │   │
│  │  │  │  ┌──────────────────────────────────────┐    │  │   │   │
│  │  │  │  │    WebRTC                            │    │  │   │   │
│  │  │  │  │  (Peer-to-Peer Voice Connection)     │    │  │   │   │
│  │  │  │  └──────────────────────────────────────┘    │  │   │   │
│  │  │  └──────────────────────────────────────────────┘  │   │   │
│  │  │                                                    │   │   │
│  │  └────────────────────────────────────────────────────┘   │   │
│  │                                                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ↕                                    │
│                    HTTPS/WebSocket/WebRTC                        │
│                              ↕                                    │
└────────────────────────────────────────────────────────────────────┘
            │                                 │
            │                                 │
            ↓                                 ↓
  ┌─────────────────────┐     ┌──────────────────────────┐
  │   YOUR BACKEND      │     │   VOCAL BRIDGE PLATFORM  │
  │  (Port 5000)        │     │  (vocalbridgeai.com)     │
  │                     │     │                          │
  │  ┌───────────────┐  │     │  ┌────────────────────┐  │
  │  │ Express.js    │  │     │  │ Voice Agent:       │  │
  │  │ Server        │  │     │  │ Trail Scout        │  │
  │  │               │  │     │  │                    │  │
  │  │ Routes:       │◄─┼─────┼─►│ • Speech Rec.      │  │
  │  │ ├─ /api/...   │  │     │  │ • Language Model   │  │
  │  │ │             │  │     │  │ • Text-to-Speech   │  │
  │  │ └─ /api/voice/│  │     │  │ • WebRTC Server    │  │
  │  │    token (NEW)│  │     │  │ (LiveKit)          │  │
  │  │               │  │     │  │                    │  │
  │  │ Endpoint:     │  │     │  │ System Prompt:     │  │
  │  │ POST /api/    │  │     │  │ "You are Trail     │  │
  │  │ voice/token   │  │     │  │ Scout..."          │  │
  │  │               │  │     │  │                    │  │
  │  │ Returns:      │  │     │  │ Mode: openai_      │  │
  │  │ • LiveKit URL │  │     │  │ concierge          │  │
  │  │ • JWT Token   │  │     │  └────────────────────┘  │
  │  │ • Room ID     │  │     │                          │
  │  │ • Session ID  │  │     │  ┌────────────────────┐  │
  │  │               │  │     │  │ Call Management    │  │
  │  │               │  │     │  │ • Transcripts      │  │
  │  │               │  │     │  │ • Call Logs        │  │
  │  │               │  │     │  │ • Analytics        │  │
  │  │               │  │     │  │ • Billing          │  │
  │  │               │  │     │  └────────────────────┘  │
  │  │               │  │     │                          │
  │  │ Env Vars:     │  │     │  CLI Tools:            │
  │  │ • VOCAL_      │  │     │  • vb agent            │
  │  │   BRIDGE_...  │  │     │  • vb logs             │
  │  │   API_KEY     │  │     │  • vb prompt           │
  │  │ • VOCAL_      │  │     │  • vb debug            │
  │  │   BRIDGE_...  │  │     │  • vb stats            │
  │  │   API_URL     │  │     │                        │
  │  └───────────────┘  │     │                        │
  │                     │     │                        │
  └─────────────────────┘     └──────────────────────────┘
```

---

## Data Flow - Voice Conversation

```
1. USER CONNECTS
   ┌──────────────┐
   │ Click START  │
   └──────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Frontend requests token:                 │
   │ POST /api/voice/token                    │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Backend calls Vocal Bridge API:          │
   │ POST vocalbridgeai.com/api/v1/token      │
   │ (sends API_KEY in headers)               │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Vocal Bridge returns:                    │
   │ • LiveKit URL                            │
   │ • JWT Token                              │
   │ • Room ID                                │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Frontend connects to LiveKit via WebRTC  │
   │ using token + room ID                    │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Trail Scout agent joins room             │
   │ Sends greeting via agent voice           │
   └──────────────────────────────────────────┘
           │
           ↓
   ✅ CONNECTED & READY TO CHAT

2. USER SPEAKS
   ┌──────────────────┐
   │ User says query  │
   └──────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Browser captures audio (microphone)      │
   │ Sends via WebRTC to agent                │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Agent receives audio + transcribes       │
   │ (Speech-to-Text: what user said)         │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Live Transcript Event:                   │
   │ { role: "user", text: "...", ... }       │
   │ Sent to browser immediately              │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Frontend displays in real-time:          │
   │ 👤 You: [spoken text appears]            │
   └──────────────────────────────────────────┘

3. AGENT RESPONDS
   ┌──────────────────────────────────────────┐
   │ Agent LLM processes query:               │
   │ (OpenAI model with Trail Scout prompt)   │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Agent generates response text            │
   │ (e.g., "I recommend Devil's Lake...")    │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Agent converts to speech (Text-to-Speech)│
   │ Using natural voice synthesis            │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Live Transcript Event:                   │
   │ { role: "assistant", text: "...", ... }  │
   │ Sent to browser immediately              │
   └──────────────────────────────────────────┘
           │
           ↓
   ┌──────────────────────────────────────────┐
   │ Frontend displays:                       │
   │ 🥾 Trail Scout: [response appears]       │
   │ + Audio plays to user                    │
   └──────────────────────────────────────────┘
           │
           ↓
   ✅ CONVERSATION CONTINUES
      (User can speak again, mute, etc.)
```

---

## Component Hierarchy

```
App.js
└── VoiceAgent.js (Main Component)
    ├── Vocal Bridge SDK
    │   ├── WebRTC Connection
    │   ├── Microphone Control
    │   └── Transcript Handler
    │
    ├── UI Elements
    │   ├── Header (Status Badge)
    │   ├── Voice Icon Container (Animated)
    │   ├── Greeting/Instructions
    │   ├── Transcript Display
    │   │   └── Message List
    │   │       ├── User Messages
    │   │       └── Assistant Messages
    │   ├── Error Banner
    │   └── Controls
    │       ├── Start/End Buttons
    │       ├── Mute Button
    │       ├── Clear Button
    │       └── Info Section
    │
    └── State Management
        ├── isConnected
        ├── isConnecting
        ├── isMuted
        ├── transcript[]
        └── error
```

---

## Environment Configuration

```
┌─────────────────────────────────────────────────────────────┐
│                    backend/.env                             │
├─────────────────────────────────────────────────────────────┤
│ PORT=5000                                                   │
│ MONGODB_URI=...                                             │
│ JWT_SECRET=...                                              │
│ NODE_ENV=production                                         │
│ FRONTEND_URL=http://localhost:3000                          │
│                                                             │
│ ✨ NEW VOICE VARS:                                          │
│ VOCAL_BRIDGE_API_KEY=vb_your_api_key_here    ⚠️ SECRET    │
│ VOCAL_BRIDGE_API_URL=http://vocalbridgeai... ⚠️ REQUIRED  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  frontend/.env                              │
├─────────────────────────────────────────────────────────────┤
│ REACT_APP_API_URL=http://localhost:5000                     │
│                                                             │
│ Note: Token URL is hardcoded to /api/voice/token           │
│       (no env var needed for frontend)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Model

```
┌────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Layer 1: API Key Protection                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • Stored only on backend (.env)                      │ │
│  │ • Never exposed to frontend code                     │ │
│  │ • Uses environment variables                         │ │
│  │ • Rotates via Vocal Bridge Dashboard                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Layer 2: Token Generation                                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • Backend only issues tokens                         │ │
│  │ • Tokens expire after 1 hour                         │ │
│  │ • New token per session                              │ │
│  │ • Signed JWT format                                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Layer 3: WebRTC Encryption                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • DTLS-SRTP encryption in transit                    │ │
│  │ • Peer-to-peer connection (no middleman)             │ │
│  │ • TLS for control channel                            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Layer 4: User Privacy                                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ • No cloud storage of voice data (P2P)               │ │
│  │ • Transcripts can be cleared                         │ │
│  │ • Opt-in to voice permissions                        │ │
│  │ • No tracking of conversations                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Example)

```
                    🌍 INTERNET 🌍

    ┌──────────────────────────────────────┐
    │      Users' Devices                  │
    │  https://trail-scout.example.com     │
    │  (React SPA - Static Web Apps)       │
    └────────────────┬─────────────────────┘
                     │
                     ↓ HTTPS + WebSocket
          
    ┌──────────────────────────────────────┐
    │      Backend API Server              │
    │  https://api.trail-scout.example.com │
    │  (Express.js on App Service)         │
    │  ├─ /api/trails                      │
    │  ├─ /api/users                       │
    │  ├─ /api/voice/token ←── Generates   │
    │  │  ↓                    LiveKit      │
    │  │  ↓ (HTTPS)           tokens       │
    │  └─ /api/voice/health                │
    └────────────────┬─────────────────────┘
                     │
         ┌───────────┴──────────────┐
         │                          │
         ↓ HTTPS                    ↓ WebRTC
                                   (P2P)
    ┌──────────────────────┐
    │  MongoDB Atlas       │
    │  (Cloud Database)    │
    │  Trail data, users   │
    └──────────────────────┘

                            ┌─────────────────────────────────┐
                            │  Vocal Bridge Platform          │
                            │  (vocalbridgeai.com)            │
                            │                                 │
                            │  • Trail Scout Agent            │
                            │  • LiveKit Server (WebRTC)      │
                            │  • Speech Recognition (STT)     │
                            │  • LLM Processing (GPT)         │
                            │  • Text-to-Speech (TTS)         │
                            │  • Call Management              │
                            │  • Analytics & Logging          │
                            └─────────────────────────────────┘
```

---

## Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React 18 | UI Framework |
| **Voice SDK** | @vocalbridgeai/react | Voice integration |
| **WebRTC** | LiveKit | Real-time communication |
| **Backend** | Express.js | API server |
| **Database** | MongoDB | Trail data storage |
| **Auth** | JWT | Request validation |
| **Voice AI** | OpenAI GPT + Vocal Bridge | Trail Scout agent |
| **Hosting** | Azure (example) | Cloud deployment |

---

This architecture provides:
- ✅ **Real-time voice communication**
- ✅ **Secure token-based auth**
- ✅ **Low latency** (P2P WebRTC)
- ✅ **High availability** (cloud-hosted)
- ✅ **Scalability** (microservices-ready)
- ✅ **Privacy** (encrypted connections)
