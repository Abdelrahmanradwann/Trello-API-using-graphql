const mongoose = require('mongoose');
const express = require('express')
const app = express();
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const authSchema = require('./graphql/authSchema')
const authResolver = require('./graphql/authResolver')
const groupSchema = require('./graphql/groupSchema')
const groupResolver = require('./graphql/groupResolver')
const jwt = require('jsonwebtoken')

const url = process.env.URL;

mongoose.connect(url).then(() => {
    console.log('Connected to DB');
})


app.use((req, res, next) => {
    const authtoken = req.headers['authorization'] || req.headers['Authorization'];
    if (authtoken) {
        const token = authtoken.split(' ')[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        try {
            const curuser = jwt.verify(token, SECRET_KEY);
            req.current = curuser;
            req.auth = true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            } else {
                return res.status(401).json({ error: 'Authentication failed' });
            }
        }
    }
    next();
});



function handleError(err) {
        if (err.originalError) {
        const error = {
            code: err.originalError.code || 400,
            msg: err.originalError.data || err.originalError.message
        }
        return error
    }
    return err
}

app.use('/graphql/auth', graphqlHTTP({
    schema: authSchema,
    rootValue: authResolver,
    customFormatErrorFn(err) {
       return handleError(err)
    }
}))

app.use('/graphql/admin', graphqlHTTP({
    schema: groupSchema,
    rootValue: groupResolver,
    customFormatErrorFn(err) {
        return handleError(err)
    }
}))






app.listen(process.env.PORT, () => {
    console.log("Conntected to port")
})