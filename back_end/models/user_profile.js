const mongoose = require('mongoose');
const options = { discriminatorKey: 'role' };

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength:6
  },
  profileImage: {
    type: String, // Store the Cloudinary URL for the user's profile image
  },
}, options);

const SimpleUserSchema = new mongoose.Schema({}, options);
const AdminSchema = new mongoose.Schema({}, options);

const User = mongoose.model('User', userSchema);
const SimpleUser = User.discriminator('SimpleUser', SimpleUserSchema);
const Admin = User.discriminator('Admin', AdminSchema);

module.exports = { User, SimpleUser, Admin };
