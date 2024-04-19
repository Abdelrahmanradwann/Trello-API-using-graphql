const yup = require('yup');
const jwt = require('jsonwebtoken');

const registerSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters long').required("Password is required")
});

const loginSchema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required')
});

const token = async (payload ) => {
    const SECRET_KEY = process.env.SECRET_KEY
    const token = await jwt.sign(payload , SECRET_KEY, { expiresIn: '720h' });
    return token;
}

module.exports = {
    registerSchema,
    token,
    loginSchema
}
