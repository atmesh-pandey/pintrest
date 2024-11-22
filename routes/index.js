var express = require('express');
var router = express.Router();
var userModel = require('../model/users');
var postModel = require('../model/post');
const { uploadImage } = require("../helper/imgbb")
const { newUser, validateLogin } = require("../controller/user.controller")
const authorizeUser = require("../middleware/auth")
const jwt = require("jsonwebtoken");

router.get('/', function (req, res) {
  res.send('server is started.');
});

router.post('/register', newUser);
router.post('/login', validateLogin);

router.post('/createpost', authorizeUser, async function (req, res) {
  try {
    const user = await userModel.findOne({ username: req.token?.username });
    const imgResp = await uploadImage(req.body.image)
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: imgResp?.data?.display_url
    });
    user.posts.push(post._id);
    await user.save();
    res.send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, error: err?.message })
  }
});

router.post('/editprofile', authorizeUser, async function (req, res) {
  const user = await userModel.findOne({ username: req.token?.username });

  if (req?.body?.image) {
    const imgResp = await uploadImage(req.body.image)
    user.profileImage = imgResp?.data?.display_url;
  }
  user.name = req.body.name;
  user.username = req.body.username;
  user.email = req.body.email;

  await user.save();

  res.send({ success: true });
});


router.post('/fileupload', authorizeUser, async function (req, res) {
  // res.send('uploaded');
  const user = await userModel.findOne({ username: req.token?.username });
  if (req?.body?.image) {
    const imgResp = await uploadImage(req.body.image)
    user.profileImage = imgResp?.data?.display_url;
  }
  await user.save();
  res.send({ success: true });
});

router.post('/logout', authorizeUser, async function (req, res) {
  try {
      // Clear the token from cookies
      res.clearCookie('token', {
          httpOnly: true, // Prevent access via JavaScript
          secure: process.env.NODE_ENV === 'production', // Only allow cookies over HTTPS in production
          sameSite: 'strict', // Protect against CSRF
      });

      // Send a success message
      return res.status(200).json({ message: 'Logout successful.' });
  } catch (error) {
      console.error("Logout Error:", error.message);
      return res.status(500).json({ message: 'Internal server error during logout' });
  }
});


module.exports = router;
