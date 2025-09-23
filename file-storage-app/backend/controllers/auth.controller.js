const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.googleSignIn = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (user) {
      // User exists, update their info if necessary
      user.name = name;
      user.profilePicture = picture;
      user.googleId = googleId;
      await user.save();
    } else {
      // User doesn't exist, create a new one
      user = new User({
        googleId,
        name,
        email,
        profilePicture: picture,
      });
      await user.save();
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid Google token' });
  }
};
