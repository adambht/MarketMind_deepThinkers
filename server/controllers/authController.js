
const axios = require('axios'); // Add this line

const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require('bcryptjs'); // Use bcryptjs instead




// Email Registration
exports.register = async (req, res, next) => {
    try {

      const { name, email, password, birthDate, phone } = req.body;
  
      // Validate required fields for email registration
      if (!name || !email || !password || !birthDate || !phone) {
        return res.status(400).json({ 
          success: false,
          message: 'All fields are required for email registration' 
        });
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: 'Email already exists' 
        });
      }
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(password, salt);


      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        birthDate,
        phone,
        provider: 'email'
      });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
  
      // Remove sensitive data before sending response
      user.password = undefined;
  
      res.status(201).json({ 
        success: true,
        token, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      next(error);
    }
  };


// Example login logic
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Debug logs
    console.log('Login attempt for:', email);
    console.log('Password received:', password);

    // Find user and explicitly include password
    const user = await User.findOne({ email, provider: 'email' })
        .select('+password +isVerified');

    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        success: false,
        message: "No account found with this email"
      });
    }

    // Debug log the stored hash
    console.log('Stored hash:', user.password);

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }
  
      // 5. Generate Token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
  
      // 6. Prepare Response
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider
      };
  
      res.json({
        success: true,
        token,
        user: userData
      });
  
    } catch (error) {
      console.error("Login error:", error);
      next(error);
    }
  };



exports.googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    // Validate credential exists
    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: 'Missing Google ID token'
      });
    }

    const { data } = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: { Authorization: `Bearer ${access_token}` }
        }
    );

    const { sub: googleId, email, name, picture, email_verified } = data;

    if (!email || !email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Google email not verified'
      });
    }

    // Rest of your existing user handling logic...
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture,
        provider: 'google',
        isVerified: true
      });
    }
      // User exists but hasn't logged in with Google before - merge accounts
      else if (!user.googleId) {
        // Prevent account takeover by checking if email exists with different provider
        if (user.provider !== 'google' && user.provider !== 'email') {
          return res.status(409).json({
            success: false,
            message: `Account exists with ${user.provider} provider`
          });
        }

        user.googleId = googleId;
        user.avatar = picture || user.avatar; // Keep existing avatar if no Google picture
        user.provider = 'google';
        user.isVerified = true;
        await user.save();
      }

      // Generate JWT token
      const token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
      );

      // Return response
      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider
        }
      });



  } catch (error) {
    console.error('Google auth error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
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