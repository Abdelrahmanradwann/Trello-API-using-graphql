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


app.use('/graphql/auth', graphqlHTTP({
    schema: authSchema,
    rootValue: authResolver,
    customFormatErrorFn(err) {
        if (err.originalError) {
            const error = {
                code: err.originalError.code || 400,
                msg: err.originalError.message
            }
            return error
        }
        return err
    }
}))


app.listen(process.env.PORT, () => {
    console.log("Conntected to port")
})