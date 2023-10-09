const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/model');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, error: 'Empty credentials supplied' });
        }

        const user = await db.User.findOne({ email });

        if (!user) {
            return res.status(400).json({ status: false, error: 'Invalid email entered!' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ status: false, error: 'Invalid password entered!' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.AUTH_PRIVATE_KEY,
            { expiresIn: '48h' }
        );

        return res.status(200).json({
            status: true,
            message: `You have successfully logged in as ${user.role}`,
            token,
            information: {
                _id: user._id,
                role: user.role,
                username: user.username,
                picture: user.profileImage,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            message: 'An error occurred during login.',
            error: error.message,
        });
    }
};

const signup = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await db.User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ status: false, error: 'User with this email or username already exists' });
        }
        if (password.length < 6) {
            return res.status(400).json({ status: false, error: 'Password must be at least 6 characters long' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role !== 'SimpleUser' && role !== 'Admin') {
            return res.status(400).json({ status: false, error: 'Invalid role. Must be SimpleUser or Admin' });
        }
        if (role === 'Admin') {
            const adminExists = await db.Admin.findOne();
            if (adminExists) {
                return res.status(400).json({ status: false, error: 'An admin already exists' });
            }
        }
        let newUser;

        // Create user based on the role
        switch (role) {
            case 'SimpleUser':
                newUser = new db.SimpleUser({
                    username,
                    email,
                    password: hashedPassword,
                });
                break;
            case 'Admin':
                newUser = new db.Admin({
                    username,
                    email,
                    password: hashedPassword,
                });
                break;
        }
        if (req.file) {
            newUser.profileImage = req.file.filename;
        }
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role: newUser.role },
            process.env.AUTH_PRIVATE_KEY,
            { expiresIn: '48h' }
        );

        res.status(201).json({
            status: true,
            message: `User registered as ${role}`,
            token,
            information: {
                _id: newUser._id,
                role: newUser.role,
                username: newUser.username,
                picture:newUser.profileImage
            },
        });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({
            status: false,
            message: 'An error occurred during signup.',
            error: error.message,
        });
    }
}

module.exports = {
    login,
    signup
};

