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
    const apiUrl = process.env.VOCAL_BRIDGE_API_URL || 'http://vocalbridgeai.com/api/v1';

    if (!apiKey) {
      return res.status(500).json({
        error: 'Voice agent not configured',
        message: 'VOCAL_BRIDGE_API_KEY is missing in environment variables'
      });
    }

    // Get the participant name from request or use default
    const participantName = req.body?.participantName || req.user?.name || 'Guest User';

    // Call Vocal Bridge API to get token
    const response = await fetch(`${apiUrl}/token`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        participant_name: participantName
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Vocal Bridge API error:', error);
      return res.status(response.status).json({
        error: 'Failed to generate voice token',
        message: error
      });
    }

    const tokenData = await response.json();

    res.json({
      success: true,
      livekit_url: tokenData.livekit_url,
      token: tokenData.token,
      room_name: tokenData.room_name,
      participant_identity: tokenData.participant_identity,
      expires_in: tokenData.expires_in
    });
  } catch (error) {
    console.error('Voice token error:', error);
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
