const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

/**
 * Generate a LiveKit access token for the Vocal Bridge voice agent
 * This endpoint should be called by the frontend to establish voice agent connection
 */
router.post('/token', async (req, res) => {
  try {
    const apiKey = process.env.VOCAL_BRIDGE_API_KEY;
    const agentId = '2c2ecc6d-ed81-4967-83e3-7f35e8327bc7'; // Trail Scout Agent ID
    const apiUrl = 'https://vocalbridgeai.com/api/v1/token';

    console.log('🔍 Voice token request:', { apiUrl, hasApiKey: !!apiKey, agentId });

    if (!apiKey) {
      return res.status(500).json({
        error: 'Voice agent not configured',
        message: 'VOCAL_BRIDGE_API_KEY is missing in environment variables'
      });
    }

    // Get the participant name from request or use default
    const participantName = req.body?.participantName || req.user?.name || 'Guest User';

    // Call Vocal Bridge API - account-scoped keys require X-Agent-Id header
    console.log('📞 Calling Vocal Bridge:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'X-Agent-Id': agentId,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        participant_name: participantName
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.text();
      console.error('Vocal Bridge API error (status:', response.status, '):', error);
      return res.status(response.status).json({
        error: 'Failed to generate voice token',
        message: error,
        status: response.status
      });
    }

    const tokenData = await response.json();
    console.log('✅ Voice token generated successfully');

    res.json({
      success: true,
      livekit_url: tokenData.livekit_url,
      token: tokenData.token,
      room_name: tokenData.room_name,
      participant_identity: tokenData.participant_identity,
      expires_in: tokenData.expires_in
    });
  } catch (error) {
    console.error('❌ Voice token error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Health check for voice agent connection
 */
router.get('/health', (req, res) => {
  const isConfigured = !!process.env.VOCAL_BRIDGE_API_KEY;
  res.json({
    status: isConfigured ? 'configured' : 'not_configured',
    message: isConfigured ? 'Voice agent is ready' : 'Voice agent API key not configured'
  });
});

module.exports = router;
