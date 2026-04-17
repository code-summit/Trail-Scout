#!/bin/bash
# Voice Setup Script for Trail Scout

echo "🎤 Trail Scout Voice Agent Setup"
echo "=================================="
echo ""

# Check if Vocal Bridge API key is set
if [ -z "$VOCAL_BRIDGE_API_KEY" ]; then
    echo "⚠️  VOCAL_BRIDGE_API_KEY not found in environment"
    echo ""
    echo "To set up voice agent:"
    echo "1. Create account at vocalbridgeai.com"
    echo "2. Create a 'Trail Scout' agent"
    echo "3. Copy your API key from the dashboard"
    echo ""
    read -p "Enter your Vocal Bridge API key (vb_...): " api_key
    export VOCAL_BRIDGE_API_KEY=$api_key
fi

# Update .env file
if [ -f "backend/.env" ]; then
    if grep -q "VOCAL_BRIDGE_API_KEY" backend/.env; then
        echo "✅ VOCAL_BRIDGE_API_KEY already configured in .env"
    else
        echo "VOCAL_BRIDGE_API_KEY=$VOCAL_BRIDGE_API_KEY" >> backend/.env
        echo "✅ Added VOCAL_BRIDGE_API_KEY to backend/.env"
    fi
else
    cp backend/.env.example backend/.env
    echo "VOCAL_BRIDGE_API_KEY=$VOCAL_BRIDGE_API_KEY" >> backend/.env
    echo "✅ Created backend/.env with API key"
fi

echo ""
echo "🚀 Voice agent is ready!"
echo ""
echo "Next steps:"
echo "1. npm run dev"
echo "2. Open http://localhost:3000"
echo "3. Click 'Start Voice Chat' and grant microphone permission"
echo "4. Say: 'Hello, what trails would you recommend?'"
echo ""
