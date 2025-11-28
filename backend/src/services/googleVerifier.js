const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (idToken) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID is not configured in environment variables');
  }

  if (!idToken) {
    throw new Error('ID token is required');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    if (!payload.email) {
      throw new Error('Email not found in Google token');
    }

    return {
      email: payload.email,
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      googleId: payload.sub,
    };
  } catch (error) {
    if (error.message.includes('Token used too early')) {
      throw new Error('Token is not yet valid');
    }
    if (error.message.includes('Token used too late')) {
      throw new Error('Token has expired');
    }
    if (error.message.includes('Invalid token signature')) {
      throw new Error('Invalid token signature - check GOOGLE_CLIENT_ID');
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
};

module.exports = { verifyGoogleToken };

