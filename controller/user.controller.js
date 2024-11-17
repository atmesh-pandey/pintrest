const userModel = require("../model/users")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");

const newUser = async (req, res) => {
    try {
        const { name, username, email, contact, password } = req.body;

        if (!name && !username && !email && !contact && !password) {
            throw new Error("All fields are mendatory.");
        }
        const hashPass = await CryptoJS.MD5(req.body.password).toString();

        const existingCheck = await userModel.find({ email: email });
        if (existingCheck?.length) {
            const updateResp = await userModel.updateOne({ email: email }, { $set: { name, contact, password } });
            if (updateResp?.length) {
                return res.send({ success: true, message: "user detail updated" });
            }
            return res.status(500).send({ success: false, message: "" })
        }
        const data = new userModel({
            name: name,
            username: username,
            email: email,
            contact: contact,
            password: hashPass,
        });

        await data.save();
        return res.send({ success: true, message: "Registered succesfully" })
    } catch (err) {
        return res.status(500).send({ success: false, error: err?.message })
    }
}

const validateLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashPass = CryptoJS.MD5(password).toString();

        const dbResp = await userModel.find({ email: email, password: hashPass });
        if (dbResp.length) {
            const token = jwt.sign(
                { name: dbResp[0]?._doc?.name, username: dbResp[0]?._doc?.username, email }, // Payload
                process.env.JWT_SECRET,                  // Secret key
                { expiresIn: "1h" }                      // Token expiry
            );
            res.cookie("token", token, {
                httpOnly: true,         // Helps prevent XSS attacks
                secure: process.env.NODE_ENV === "production", // Use secure cookies in production
                maxAge: 3600000,        // Cookie expiry in milliseconds (1 hour)
            });
            return res.send({ success: true, token: token });
        }
        return res.status(403).send({ success: false, message: "user not found" });
    } catch (err) {
        return res.status(500).send({ success: false, error: err?.message })
    }
}

module.exports = { newUser, validateLogin }