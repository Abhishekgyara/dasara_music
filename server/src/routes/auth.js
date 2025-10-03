import express from 'express';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { issueToken } from '../middleware/auth.js';

const router = express.Router();

const signupSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  name: Joi.string().min(2).max(50).required().trim(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required(),
});

router.post('/signup', async (req, res, next) => {
  try {
    const { error, value } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email already in use' 
      });
    }

    const passwordHash = await bcrypt.hash(value.password, 12);
    const user = new User({
      email: value.email,
      name: value.name,
      passwordHash,
      preferences: {
        favoriteGenres: [],
        moodPreferences: []
      }
    });

    await user.save();

    const token = issueToken(user._id.toString());

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: error.details[0].message 
      });
    }

    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const isPasswordValid = await user.verifyPassword(value.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const token = issueToken(user._id.toString());

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
});

// Demo login endpoint for testing
router.post('/demo-login', async (req, res) => {
  try {
    // Find or create demo user
    let demoUser = await User.findOne({ email: 'demo@melodymind.com' });
    
    if (!demoUser) {
      demoUser = new User({
        email: 'demo@melodymind.com',
        name: 'Demo User',
        passwordHash: await bcrypt.hash('demo123', 12),
        preferences: {
          favoriteGenres: ['Pop', 'Rock', 'Jazz'],
          moodPreferences: ['Happy', 'Relaxed', 'Energetic']
        }
      });
      await demoUser.save();
    }

    const token = issueToken(demoUser._id.toString());

    res.json({
      success: true,
      message: 'Demo login successful',
      token,
      user: {
        id: demoUser._id,
        email: demoUser.email,
        name: demoUser.name,
        avatarUrl: demoUser.avatarUrl,
        preferences: demoUser.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Demo login failed'
    });
  }
});

export default router;