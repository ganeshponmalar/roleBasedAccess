import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,

  // ✅ For Google OAuth users
  googleId: String,
  name: String,

  roles: {
    type: [String],
    default: ['User']
  },
  active: {
    type: Boolean,
    default: true
  }
})

export default mongoose.model('User', userSchema)
