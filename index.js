const mongoose = require('mongoose');
const express = require('express')
const app = express();
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const authSchema = require('./graphql/authSchema')
const authResolver = require('./graphql/authResolver')

const url = process.env.URL;

mongoose.connect(url).then(() => {
    console.log('Connected to DB');
})

app.use((req,res,next) => {
    const authtoken = req.headers["Authorization"] || req.headers["authorization"]
    if (authtoken) {
        const token = authtoken.split(' ')[1]
        const SECRET_KEY = process.env.SECRET_KEY
        const curuser = jwt.verify(token,SECRET_KEY)
        req.current = curuser
        req.auth = true
    }
    next()
})


app.use('/graphql/auth', graphqlHTTP({
    schema: authSchema,
    rootValue: authResolver,
    customFormatErrorFn(err) {
        if (err.originalError) {
            const error = {
                code: err.originalError.code || 400,
                msg: err.originalError.data
            }
            return error
        }
        return err
    }
}))


app.listen(process.env.PORT, () => {
    console.log("Conntected to port")
})