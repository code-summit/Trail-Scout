import React, { useState, useEffect, useRef } from 'react';
import './VoiceAgent.css';

function VoiceAgent() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const [agentStatus, setAgentStatus] = useState('idle');
  const vbRef = useRef(null);

  // Initialize Vocal Bridge Voice Agent
  useEffect(() => {
    const initializeVoiceAgent = async () => {
      try {
        // Dynamically import Vocal Bridge SDK
        const { VocalBridge } = await import('@vocalbridgeai/react');

        // Initialize but don't connect yet
        const vb = new VocalBridge({
          auth: { tokenUrl: '/api/voice/token' },
          participantName: 'Trail Scout User'
        });

        // Set up event listeners
        vb.on('transcript', ({ role, text, timestamp }) => {
          setTranscript(prev => [...prev, { role, text, timestamp }]);
        });

        vb.on('agentAction', ({ action, payload }) => {
          console.log('Agent action:', action, payload);
        });

        vb.on('error', (err) => {
          console.error('Voice agent error:', err);
          setError(err.message);
          setIsConnected(false);
          setIsConnecting(false);
        });

        vbRef.current = vb;
      } catch (err) {
        console.error('Failed to load Vocal Bridge SDK:', err);
        // Fallback: Show mock transcripts for demo
        setError('Voice SDK not available - running in demo mode');
      }
    };

    initializeVoiceAgent();
  }, []);

  // Connect to voice agent
  const handleConnect = async () => {
    if (!vbRef.current) {
      setError('Voice agent not initialized');
      return;
    }

    setIsConnecting(true);
    setError(null);
    setTranscript([]);

    try {
      await vbRef.current.connect();
      setIsConnected(true);
      setIsMuted(false);
      setAgentStatus('listening');
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      setIsConnecting(false);
    }
  };

  // Disconnect from voice agent
  const handleDisconnect = async () => {
    if (!vbRef.current) return;

    try {
      await vbRef.current.disconnect();
      setIsConnected(false);
      setAgentStatus('idle');
    } catch (err) {
      setError(`Failed to disconnect: ${err.message}`);
    }
  };

  // Toggle microphone
  const handleToggleMicrophone = async () => {
    if (!vbRef.current) return;

    try {
      await vbRef.current.toggleMicrophone();
      setIsMuted(!isMuted);
      setAgentStatus(isMuted ? 'listening' : 'muted');
    } catch (err) {
      setError(`Failed to toggle microphone: ${err.message}`);
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
