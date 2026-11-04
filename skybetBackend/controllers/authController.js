import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate short-lived Access Token
export const generateAccessToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
  const expiry = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id, role }, secret, { expiresIn: expiry });
};

// Generate long-lived Refresh Token
export const generateRefreshToken = (id, role) => {
  const secret = process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET || 'your_jwt_secret_key_here'}_refresh_key`;
  const expiry = process.env.JWT_REFRESH_EXPIRE || '30d';
  return jwt.sign({ id, role }, secret, { expiresIn: expiry });
};

// Backward compatibility helper
const generateToken = generateAccessToken;

// 1. Register a new user
export const register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Save refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: accessToken, // Backward compatibility
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Save/update refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: accessToken, // Backward compatibility
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Refresh Access Token using Refresh Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || `${process.env.JWT_SECRET || 'your_jwt_secret_key_here'}_refresh_key`;

    // Verify refresh token signature & expiry
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid or expired refresh token. Please login again.' });
    }

    // Check if user exists and token matches database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token is no longer valid or has been revoked.' });
    }

    // Generate brand new access token
    const newAccessToken = generateAccessToken(user._id, user.role);

    // Optionally generate a rotated refresh token
    const newRefreshToken = generateRefreshToken(user._id, user.role);
    user.refreshToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      message: 'Token refreshed successfully',
      token: newAccessToken,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Logout (Revoke Refresh Token)
export const logout = async (req, res) => {
  try {
    const { refreshToken, userId } = req.body;
    const targetUserId = req.user?._id || userId;

    if (targetUserId) {
      await User.findByIdAndUpdate(targetUserId, { refreshToken: null });
    } else if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    res.status(200).json({ message: 'Logged out successfully, refresh token revoked' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
