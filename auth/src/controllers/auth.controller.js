const userModel = require('../models/user.model');
const bcrypt = require('bcryptjs');

const registerUser = async (req,res) => {

    const { username, email, password, fullName: { firstName, lastName }} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [   // It return true when either the username or email is available
            { username },
            { email }
        ]
    });

    if(isUserAlreadyExists) {
        return res.status(409).json({ message: "Username or Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username, 
        email,
        password: hash,
        fullName: {
            firstName,
            lastName
        }
    })

};

module.exports = {
    registerUser
};