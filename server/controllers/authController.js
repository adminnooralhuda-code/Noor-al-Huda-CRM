const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        // 'role' കൂടി ബോഡിയിൽ നിന്ന് എടുക്കുന്നു (ഡിഫോൾട്ട് 'customer')
        const { email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        user = new User({
            email,
            password: hashedPassword,
            verificationToken,
            role: role || 'customer' // റോൾ സെറ്റ് ചെയ്യുന്നു
        });
        await user.save();

        const verificationLink = `http://localhost:3000/api/auth/verify?token=${user.verificationToken}`;        
        const message = `Please verify your email by clicking the following link: ${verificationLink}`;
        await sendEmail(email, 'Email Verification', message);

        res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
 

/*const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};*/

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            token, 
            role: user.role,
            message: 'Login successful' 
        });        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "വിവരങ്ങൾ ലഭിച്ചില്ല!" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        const userId = req.user.id;

        const updateData = {};
        if (mobile) updateData.mobile = mobile; // mobile ഉണ്ടെങ്കിൽ മാത്രം അപ്‌ഡേറ്റ്
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        await User.findByIdAndUpdate(userId, updateData);
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "പഴയ പാസ്‌വേഡ് തെറ്റാണ്!" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "പാസ്‌വേഡ് വിജയകരമായി മാറ്റി!" });
    } catch (error) {
        res.status(500).json({ message: "സെർവർ പിശക്!" });
    }
};

module.exports = { 
    registerUser, 
  //  verifyEmail, 
    loginUser, 
    getMyProfile, 
    updateProfile, 
    changePassword 
};