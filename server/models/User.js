const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Common fields
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Email authentication fields
  password: {
    type: String,
    select: false // Won't return in queries by default
  },
  birthDate: {
    type: Date,
    required: function() { return this.provider === 'email'; }
  },
  phone: {
    type: String,
    required: function() { return this.provider === 'email'; }
  },
  
  // Google authentication fields
  googleId: String,
  avatar: String,
  provider: {
    type: String,
    enum: ['email', 'google'],
    required: true,
    default: 'email'
  },
  
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) {
    console.error('No password hash available for comparison');
    return false;
  }

  // Debug the exact values being compared
  console.log('Candidate password (raw):', candidatePassword);
  console.log('Candidate password (length):', candidatePassword.length);
  console.log('Stored hash:', this.password);
  const testHash = await bcrypt.hash(candidatePassword, 12);
  console.log("Original passwoooooooooooooord:", testHash);



  try {
    // Compare using bcryptjs
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Comparison error:', error);
    return false;
  }
};
module.exports = mongoose.model('User', UserSchema);