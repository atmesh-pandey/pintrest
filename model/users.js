const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: []
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }]
})

module.exports = mongoose.model("user", userSchema)