const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateToken, attachAuthCookie, clearAuthCookie } = require('../services/tokenService');
const { verifyGoogleToken } = require('../services/googleVerifier');

const router = express.Router();

const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const validationResp = handleValidation(req, res);
    if (validationResp) return validationResp;

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const user = await User.create({ name, email, password, provider: 'local' });
      const token = generateToken(user);
      attachAuthCookie(res, token);
      res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Registration failed', error: err.message });
    }
  }
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6 })],
  async (req, res) => {
    const validationResp = handleValidation(req, res);
    if (validationResp) return validationResp;

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      attachAuthCookie(res, token);
      res.json({ user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Login failed', error: err.message });
    }
  }
);

router.post('/google', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ message: 'idToken required' });
  }

  try {
    const profile = await verifyGoogleToken(idToken);
    if (!profile || !profile.email) {
      return res.status(400).json({ message: 'Invalid Google token - no email found' });
    }

    let user = await User.findOne({ email: profile.email });
    
    if (!user) {
      // Create new user with Google provider
      user = await User.create({
        name: profile.name,
        email: profile.email,
        provider: 'google',
        googleId: profile.googleId,
      });
    } else {
      // Update existing user if they don't have Google ID
      if (!user.googleId) {
        user.googleId = profile.googleId;
        if (user.provider !== 'google') {
          user.provider = 'google';
        }
        await user.save();
      }
    }

    const token = generateToken(user);
    attachAuthCookie(res, token);
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('Google auth error:', err);
    const errorMessage = err.message || 'Google authentication failed';
    res.status(500).json({ 
      message: 'Google auth failed', 
      error: errorMessage 
    });
  }
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('name email provider');
  res.json({ user });
});

router.post('/logout', auth, (req, res) => {
  clearAuthCookie(res);
  res.json({ message: 'Logged out' });
});

module.exports = router;

