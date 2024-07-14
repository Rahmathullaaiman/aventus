const users = require('../SCHEMAS/userschema');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
require('dotenv').config();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const user = new users({ username, profile: "", email, password: hashedPassword, about: "", otp });
        await user.save();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP for verification',
            text: `Your OTP is: ${otp}`
        };
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await users.findOne({ email, otp });

        if (!user) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        user.verified = true;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(404).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: existingUser._id },'secretkey', { expiresIn: '1h' });

        res.status(200).json({
            user: existingUser,
            token
        });
    } catch (err) {
        res.status(401).json({ error: `Login request failed due to ${err}` });
    }
};

exports.editprofile = async (req, res) => {
    const { id } = req.params
    const { username, email, password } = req.body
    const uploadedimage = req.file ? req.file.filename : profile

    try {
        const update = await users.findByIdAndUpdate({ _id: id }, {
            username, profile: uploadedimage, email, password
        }, { new: true })

        await update.save()
        res.status(200).json(update)
    } catch (error) {
        res.status(401).json(error)
    }
}