const { register, login } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

async function registerUser(req,res){
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
            
        if (!email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        await register(email,password);
        
        res.json({
            success : true,
            mssg : "User registered",
        })
    } catch (error) {
        res.status(500).json({
            success : false,
            mssg : error.message
        })
    }
}

async function loginUser(req,res){
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        const user = await login(email,password);
        const token = generateToken(user);

        res.json({
            success : true,
            token,
        })
        
    } catch (error) {
        res.status(401).json({
            success : false,
            mssg : error.message
        })
    }
}

module.exports = {
    registerUser,
    loginUser,

}