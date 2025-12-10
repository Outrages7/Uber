const { validationResult } = require("express-validator");
const UserModel = require("../Model/UserModel");
const userService = require("../Services/UserService"); 

module.exports.registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        const isUserAlready = await UserModel.findOne({ email });
        if (isUserAlready) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedPassword = await UserModel.hashPassword(password);

        const user = await userService.createUser({
            fullname: {
                firstname: fullname.firstname,
                lastname: fullname.lastname
            },
            email,
            password: hashedPassword
        });

        const token = user.generateAuthToken();

        return res.status(201).json({ token, user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports.loginUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = user.generateAuthToken();

        // Remove password from user before sending response
        user.password = undefined;

        return res.status(200).json({ token, user });

    } catch (error) {
        console.log("LOGIN ERROR →", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};
