const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email Registration
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: 'email'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ token, user });
  } catch (error) {
    next(error);
  }
};

// Email Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, provider: 'email' });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

// Google Authentication
exports.googleAuth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const { sub, email, name, picture } = ticket.getPayload();
    
    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    
    if (!user) {
      user = await User.create({
        googleId: sub,
        email,
        name,
        avatar: picture,
        provider: 'google'
      });
    } else if (!user.googleId) {
      // Merge accounts if email exists but not Google ID
      user.googleId = sub;
      user.avatar = picture;
      user.provider = 'google';
      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

// Session Check
exports.checkSession = (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.json({ valid: false });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    res.json({ valid: !err });
  });
};