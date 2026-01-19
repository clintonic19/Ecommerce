const express = require("express")
const router = express.Router();

const {registerUser, loginUser, logoutUser } = require('../controllers/auth/auth.controller');
const { authMiddleware } = require("../middlewares/authHandler");
const User = require("../models/User.model");


router.post('/register',  registerUser );
router.post('/login', loginUser );
router.post('/logout', logoutUser );

router.get('/check-auth', authMiddleware, async (req, res) =>{
    // const user = req.userId;
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json({
        success: true,
        message: 'User Authenticated',
        user,
    })
});

module.exports = router;
