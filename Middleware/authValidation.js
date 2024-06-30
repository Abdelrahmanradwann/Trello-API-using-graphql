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

const verifyToken = (req, res, next) => {
    const authtoken = req.headers["Authorization"] || req.headers["authorization"];
    if (!authtoken) {
        res.StatusCode = 400;
        throw new Error('Unauthorized: No token provided');
    }   
     const token = authtoken.split(' ')[1];
     const SECRET_KEY = process.env.SECRET_KEY
      try{
          const curuser = jwt.verify(token,SECRET_KEY);
          req.current = curuser
          next();     
      }
      catch (err) {
        res.StatusCode = 400;
        throw new Error("error decoted token");
      }
}

const getPayLoad = function(req){
    const authtoken = req.Authorization
    if (!authtoken) {
        res.StatusCode = 400;
        throw new Error('Unauthorized: No token provided');
    }   
     const SECRET_KEY = process.env.SECRET_KEY
      try{
          const curuser = jwt.verify(authtoken,SECRET_KEY);
          req.current = curuser
          return req.current.id;
      } catch (err) {
          return null
      }
     
}


module.exports = {
    registerSchema,
    token,
    loginSchema,
    verifyToken,
    getPayLoad
}
