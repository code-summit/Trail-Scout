import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

const VoiceAgentContext = createContext();

export function useVoiceAgent() {
  const context = useContext(VoiceAgentContext);
  if (!context) {
    throw new Error('useVoiceAgent must be used within VoiceAgentProvider');
  }
  return context;
}

export function VoiceAgentProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [error, setError] = useState(null);
  const vbRef = useRef(null);

  const connect = useCallback(async () => {
    if (!vbRef.current) {
      setError('Voice agent not initialized');
      return false;
    }

    setIsConnecting(true);
    setError(null);
    setTranscript([]);

    try {
      await vbRef.current.connect();
      setIsConnected(true);
      setIsMuted(false);
      return true;
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      setIsConnecting(false);
      return false;
    }
  }, []);

  const disconnect = useCallback(async () => {
    if (!vbRef.current) return false;

    try {
      await vbRef.current.disconnect();
      setIsConnected(false);
      return true;
    } catch (err) {
      setError(`Failed to disconnect: ${err.message}`);
      return false;
    }
  }, []);

  const toggleMicrophone = useCallback(async () => {
    if (!vbRef.current) return false;

    try {
      await vbRef.current.toggleMicrophone();
      setIsMuted(prev => !prev);
      return true;
    } catch (err) {
      setError(`Failed to toggle microphone: ${err.message}`);
      return false;
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript([]);
  }, []);

  const addTranscriptMessage = useCallback((role, text, timestamp) => {
    setTranscript(prev => [...prev, { role, text, timestamp }]);
  }, []);

  const setVocalBridge = useCallback((vb) => {
    vbRef.current = vb;
  }, []);

  const value = {
    isConnected,
    isConnecting,
    isMuted,
    transcript,
    error,
    vbRef,
    connect,
    disconnect,
    toggleMicrophone,
    clearTranscript,
    addTranscriptMessage,
    setVocalBridge,
    setError
  };

  return (
    <VoiceAgentContext.Provider value={value}>
      {children}
    </VoiceAgentContext.Provider>
  );
}
