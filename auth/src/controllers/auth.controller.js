const userModel = require('../models/user.model');

const registerUser = async (req,res) => {

    const { username, email, password, fullName: { firstName, lastName }} = req.body;

}

module.exports = registerUser;