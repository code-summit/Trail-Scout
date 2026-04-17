import React, { useState, useEffect, useRef } from 'react';
import './VoiceAgent.css';

function VoiceAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [agentStatus, setAgentStatus] = useState('idle');
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Initialize Voice Agent
  useEffect(() => {
    const initializeVoiceAgent = async () => {
      try {
        // Load Vocal Bridge SDK dynamically from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.vocalbridgeai.com/sdk/vocal-bridge.js';
        script.async = true;
        script.onload = () => {
          console.log('✅ Vocal Bridge SDK loaded');
        };
        script.onerror = () => {
          console.log('Note: Voice SDK not available - but app is functional');
        };
        document.head.appendChild(script);
      } catch (err) {
        console.error('SDK loading info:', err);
      }
    };

    initializeVoiceAgent();
  }, []);

  // Connect to voice agent
  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    setTranscript([]);

    try {
      // Get voice token from backend
      const response = await fetch('/api/voice/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          participantName: 'Trail Scout User'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get voice token');
      }

      const tokenData = await response.json();
      console.log('✅ Voice token received');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      mediaStreamRef.current = stream;

      // Start recording for demo
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Simulate receiving agent response
      setTranscript([
        { role: 'assistant', text: "Hey, Trail Scout here! Planning a hike or adventure? Ask me about trails, conditions, gear, or anything outdoors -- I've got you covered.", timestamp: Date.now() }
      ]);

      setIsConnected(true);
      setIsMuted(false);
      setAgentStatus('listening');
      setIsConnecting(false);

      // Auto-disconnect after demo (30 seconds)
      setTimeout(() => {
        if (isConnected) {
          handleDisconnect();
        }
      }, 30000);

    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      setIsConnecting(false);
      console.error('Connection error:', err);
    }
  };

  // Disconnect from voice agent
  const handleDisconnect = async () => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsConnected(false);
      setAgentStatus('idle');
    } catch (err) {
      setError(`Failed to disconnect: ${err.message}`);
    }
  };

  // Toggle microphone
  const handleToggleMicrophone = async () => {
    try {
      if (mediaStreamRef.current) {
        const audioTracks = mediaStreamRef.current.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = !track.enabled;
        });
        setIsMuted(!isMuted);
        setAgentStatus(isMuted ? 'listening' : 'muted');
      }
    } catch (err) {
      setError(`Failed to toggle microphone: ${err.message}`);
    }
  };

  // Clear transcript
  const handleClearTranscript = () => {
    setTranscript([]);
  };

  // Add demo message on typing
  const handleDemoInput = (message) => {
    if (message.trim()) {
      setTranscript(prev => [
        ...prev,
        { role: 'user', text: message, timestamp: Date.now() },
        { role: 'assistant', text: 'Great question! I found some amazing trails for you. Would you like to know more?', timestamp: Date.now() + 1000 }
      ]);
    }
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
                  handleDemoInput(e.target.value);
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
