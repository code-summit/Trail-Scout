import React, { useState, useEffect, useRef } from 'react';
import { VocalBridge } from '@vocalbridgeai/sdk';
import './VoiceAgent.css';

function VoiceAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [agentStatus, setAgentStatus] = useState('idle');
  const vbRef = useRef(null);

  // Initialize Voice Agent with Vocal Bridge SDK
  useEffect(() => {
    console.log('✅ Vocal Bridge SDK loaded via npm');
  }, []);

  // Connect to voice agent using Vocal Bridge SDK
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setTranscript([]);

    try {
      const backendUrl = process.env.REACT_APP_API_URL || 'https://trail-scout-px9h.onrender.com';

      // Initialize Vocal Bridge with token URL from backend
      const vb = new VocalBridge({
        auth: {
          tokenUrl: `${backendUrl}/api/voice/token`
        },
        participantName: 'Trail Scout User',
        debug: true
      });

      vbRef.current = vb;

      // Handle connection state changes
      vb.on('connectionStateChanged', (state) => {
        console.log('Connection state:', state);
        if (state === 'connected') {
          setIsConnected(true);
          setAgentStatus('listening');
        } else if (state === 'disconnected') {
          setIsConnected(false);
          setAgentStatus('idle');
        } else {
          setAgentStatus('connecting');
        }
      });

      // Handle live transcript
      vb.on('transcript', ({ role, text, timestamp }) => {
        console.log(`[${role}] ${text}`);
        setTranscript(prev => [...prev, { role, text, timestamp }]);
      });

      // Handle errors
      vb.on('error', (err) => {
        console.error('Vocal Bridge error:', err);
        setError(`Connection error: ${err.message || err.code}`);
        setIsConnecting(false);
      });

      // Connect to the agent
      console.log('📞 Connecting to Trail Scout...');
      await vb.connect();
      
      setIsConnecting(false);
      setIsMuted(false);
    } catch (err) {
      console.error('❌ Connection failed:', err);
      setError(`Failed to connect: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Disconnect from agent
  const handleDisconnect = async () => {
    try {
      if (vbRef.current) {
        await vbRef.current.disconnect();
        vbRef.current = null;
      }
      setIsConnected(false);
      setTranscript([]);
      setError(null);
    } catch (err) {
      console.error('Disconnect error:', err);
    }
  };

  // Toggle microphone
  const handleToggleMicrophone = async () => {
    try {
      if (vbRef.current) {
        await vbRef.current.toggleMicrophone();
        setIsMuted(!isMuted);
      }
    } catch (err) {
      console.error('Microphone toggle error:', err);
      setError(`Microphone error: ${err.message}`);
    }
  };

  // Clear transcript
  const handleClearTranscript = () => {
    setTranscript([]);
  };

  return (
    <div className="voice-agent-container">
      {/* Status Header */}
      <div className="voice-header">
        <div className="agent-status-badge">
          <span className={`status-indicator ${agentStatus}`}></span>
          <span className="status-text">
            {isConnected ? (
              <>
                🎤 {isMuted ? 'Muted' : 'Listening'} - Trail Scout
              </>
            ) : isConnecting ? (
              <>⏳ Connecting...</>
            ) : (
              <>⚫ Offline</>
            )}
          </span>
        </div>
      </div>

      {/* Main Voice Interface */}
      <div className="voice-interface">
        {/* Large Voice Icon / Status */}
        <div className={`voice-icon-container ${isConnected ? 'active' : ''}`}>
          {isConnecting ? (
            <div className="connecting-animation">
              <div className="pulse"></div>
              <div className="pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : isConnected ? (
            <div className="listening-animation">
              🎤
            </div>
          ) : (
            <div className="idle-icon">🎙️</div>
          )}
        </div>

        {/* Agent Greeting / Instructions */}
        {!isConnected && !error && (
          <div className="agent-greeting">
            <h2>Trail Scout Voice Agent</h2>
            <p className="greeting-text">
              "Hey, Trail Scout here! Planning a hike or adventure? Ask me about trails, conditions, gear, or anything outdoors -- I've got you covered."
            </p>
            <p className="hint-text">Tap below to start a conversation</p>
          </div>
        )}

        {/* Transcript Display */}
        {transcript.length > 0 && (
          <div className="transcript-container">
            <div className="transcript-header">
              <h3>Conversation</h3>
              <button className="clear-btn" onClick={handleClearTranscript}>
                Clear
              </button>
            </div>
            <div className="transcript-messages">
              {transcript.map((msg, idx) => (
                <div key={idx} className={`transcript-msg msg-${msg.role}`}>
                  <span className="msg-role">
                    {msg.role === 'user' ? '👤 You' : '🥾 Trail Scout'}
                  </span>
                  <p className="msg-text">{msg.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Demo Input */}
        {isConnected && (
          <div className="demo-input-container">
            <input 
              type="text"
              placeholder="Type what you'd say (demo mode)..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Just for testing - in production use voice
                  const message = e.target.value;
                  if (message.trim()) {
                    setTranscript(prev => [
                      ...prev,
                      { role: 'user', text: message, timestamp: Date.now() }
                    ]);
                  }
                  e.target.value = '';
                }
              }}
              className="demo-input"
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="voice-controls">
        {!isConnected ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleConnect}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <>⏳ Connecting...</>
            ) : (
              <>🎤 Start Voice Chat</>
            )}
          </button>
        ) : (
          <>
            <button
              className={`btn btn-icon ${isMuted ? 'muted' : ''}`}
              onClick={handleToggleMicrophone}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? '🔇' : '🎤'}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDisconnect}
            >
              📞 End Call
            </button>
          </>
        )}
      </div>

      {/* Info Section */}
      {!isConnected && (
        <div className="voice-info">
          <h4>What can Trail Scout help you with?</h4>
          <ul>
            <li>🥾 Trail recommendations by difficulty and distance</li>
            <li>🌤️ Current trail conditions and weather</li>
            <li>🎒 Gear and equipment advice</li>
            <li>⚠️ Safety tips and best practices</li>
            <li>📍 Route planning and navigation</li>
            <li>📋 Permit and access information</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default VoiceAgent;
