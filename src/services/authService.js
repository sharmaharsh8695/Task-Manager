const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../repositories/userRepository');

async function register(email,password){
    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await createUser(email, encryptedPassword);
}  

async function login(email,password){
    user = await findUserByEmail(email);
    if(!user)throw new Error("No User found");

    const Matched = await bcrypt.compare(password,user.password);
    if(!Matched)throw new Error("Invalid credentials");

    return user;
}

module.exports = {
    register,
    login,

}