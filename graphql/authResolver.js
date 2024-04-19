const authValidation = require('../Middleware/authValidation')
const bcrypt = require('bcrypt')
const generate = require('../Middleware/authValidation')
const User = require('../models/User')

module.exports = {
    signUp: async function ({ userInput }, req ) {
        const username = userInput.username;
        const email = userInput.email;
        const password = userInput.password
        const obj = {
            username,
            email,
            password
        };
        try {   
            await authValidation.registerSchema.validate(obj)     
         }
        catch (err) {  
            err.code = 400
            throw new Error(err);
        }
        const retrieveUser = await User.findOne({ Email:email })
        if (retrieveUser) {
            const error = new Error("Email already exists");
            error.code = 400;
            throw error
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            Username: username,
            Password: hashedPassword,
            Email: email
    })

        try {
            const token = await generate.token({ id: newUser._id, email: newUser.Email });
        } catch (err) {
            throw err
        }
    // const check = await mail.confirmSignUp(email, username);
    // if (check == "error") {
    //     const error = new Error("error in signing up");
    //     error.statusCode = 400;
    //     throw error;
        // }
        
        await newUser.save()
        return("User is added successfully")
    },
    logIn: async function ({ userInput }, req) {
        const username = userInput.username;
        const email = userInput.email;
        const password = userInput.password
        const obj = {
            username,
            email,
            password
        };
        try {   
              
            await authValidation.loginSchema.validate(obj)     
         }
        catch (err) {  
            err.code = 400
            throw new Error(err);
        }
     
        const retrieveUser = await User.findOne({ Email: email })
        if (!retrieveUser) {
            const error = new Error("Email is not correct");
            error.code = 400;
            throw error
        }
        const hashedPassword = retrieveUser.Password;
        const checkSimilarity = await bcrypt.compare(password, hashedPassword);
        if (!checkSimilarity) {
            const error = new Error("Password is not correct");
            error.code = 400;
            throw error
        }

        const token = await generate.token({id:retrieveUser._id,email:retrieveUser.Email});
        await retrieveUser.save();
  
        return {
            ...retrieveUser._doc, _id: retrieveUser._id.toString(),
            ResetPwExpiryDate : retrieveUser.ResetPwExpiryDate?retrieveUser.ResetPwExpiryDate.toString():null 
        }
    }

}