const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        // 'username' കൂടി ബോഡിയിൽ നിന്ന് എടുക്കുന്നു
        const { username, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }   
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username, // Username സേവ് ചെയ്യുന്നു
            email,
            password: hashedPassword,
            role: role || 'customer'
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

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

        // Token-ൽ 'username' കൂടി ഉൾപ്പെടുത്തുന്നു (അതുകൊണ്ട് Layout-ൽ ഇത് എളുപ്പത്തിൽ കിട്ടും)
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ 
            token, 
            role: user.role,
            username: user.username, // ഫ്രണ്ട്-എൻഡിൽ സ്റ്റോർ ചെയ്യാൻ
            message: 'Login successful' 
        });        
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// getMyProfile, updateProfile, changePassword എന്നിവ അതേപോലെ തുടരാം...
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
        if (mobile) updateData.mobile = mobile;
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
    loginUser, 
    getMyProfile, 
    updateProfile, 
    changePassword 
};