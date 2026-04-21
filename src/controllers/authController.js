const { register, login } = require("../services/authService");
const { generateToken } = require("../utils/jwt");

async function registerUser(req,res){
    try {
        await register(req.body.email,req.body.password);
        
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
        const user = await login(req.body.email,req.body.password);
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