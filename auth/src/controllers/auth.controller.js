const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {

    try {

        const { username, email, password, fullName: { firstName, lastName } } = req.body;

        // console.log("checking existing user")
        const isUserAlreadyExists = await userModel.findOne({
            $or: [   // It return true when either the username or email is available
                { username },
                { email }
            ]
        });

        if (isUserAlreadyExists) {
            console.log("user exists")
            return res.status(409).json({ message: "Username or Email already exists" });
        }

        // console.log('hashing password');    
        const hash = await bcrypt.hash(password, 10);

        // console.log('creating user in DB')
        const user = await userModel.create({
            username,
            email,
            password: hash,
            fullName: {
                firstName,
                lastName
            }
        })
        // console.log('user created with id: ', user._id)

        // if(!process.env.JWT_SECRET) {
        //     console.warn('JWT_SECRET is not set in env');
        // }

        // console.log('signing jwt token') 
        const token = jwt.sign({
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // console.log('sending response')
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                addressed: user.addresses
            }
        })
    }
    catch (error) {
        console.log('Error in registerUser: ', error)
        res.status(500).json({
            message: "Internal server error!!"
        })
    }

};

module.exports = {
    registerUser
};