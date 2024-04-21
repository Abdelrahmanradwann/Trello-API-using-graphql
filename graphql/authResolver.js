const authValidation = require('../Middleware/authValidation')
const bcrypt = require('bcrypt')
const generate = require('../Middleware/authValidation')
const User = require('../models/User')
const { sendResetEmail } = require('../Middleware/sendMail')

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
        try {
            const retrieveUser = await User.findOne({ Email: email }, { Username: false, Password: false, Profile_Pic: false,VerificationCode: false, ExpiryVCode: false })
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
                var token = await generate.token({ id: newUser._id, email: newUser.Email });
            } catch (err) {
                throw err
            }
            const check = await sendResetEmail(email, `
                Dear ${username},
                Your account has been created successfully!
                Get started
                `
                , 'Sign up successfully');
            
            if (check == "error") {
                const error = new Error("error in signing up");
                error.statusCode = 400;
                throw error;
            }   
            newUser.token = token 
            await newUser.save()
            return ("User is added successfully")
        } catch (err) {
            throw err
        }
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
        try {
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
           
            const token = await generate.token({ id: retrieveUser._id, email: retrieveUser.Email });
            retrieveUser.token = token
            await retrieveUser.save();
            return {
                ...retrieveUser._doc, _id: retrieveUser._id.toString()
            }
        } catch (err) {
            throw err
        }
    },
    forgetPassword: async function ({ email }, req ) {
        const user = await User.findOne({ Email: email })
        if (!user) {
            const error = new Error("Email was not found")
            error.code = 404
            throw error
        }
        const code = Math.floor(Math.random() * 900000) + 100000;
        user.VerificationCode = code
        let currentDate = new Date()
        let expiryDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
        user.ExpiryVCode = expiryDate
        await user.save()
        const subject = 'Email Verification'
        await sendResetEmail(email, `Please enter this verification code ${code.toString()}`, subject)
        return 'Verification is sent'
    },
    checkCode: async function ({ email, code }, req) {
        try {
            const user = await User.findOne({ Email: email, VerificationCode: code }, { Profile_Pic: false, Password: false, Email: false, VerificationCode: false })
            if (!user) {
                const error = new Error('Email and code are not correct')
                error.code = 400
                throw error
            }
            const date = new Date();
            if (user.ExpiryVCode > date.getTime()) {
                return true
            }
            return false
        } catch(err) {
             throw err
        }
    },
    resetPassword: async function({ email, password, confirmPassword }, req) {
        try {
            let errors = []
            const user = await User.findOne({ Email: email })
            if (!user) {
                errors.push('Email is not correct')
            }
            if (password != confirmPassword) {
                errors.push('Passwords do not match')
            }
            if (password.length < 6) {
                errors.push('Password length must be at least 6')
            }
            if (errors.length) {
                const error = new Error()
                error.code = 400
                error.data = errors
                throw error
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            user.Password = hashedPassword
            user.VerificationCode = user.ExpiryVCode = undefined
            await user.save()     
            return { ...user._doc, _id: user._id.toString()}
        } catch (err) {
            throw err
        }
    }


}