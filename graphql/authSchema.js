const { buildSchema } = require('graphql');

module.exports= buildSchema(`
    input userInputData {
        username: String!
        email: String!
        password: String!
    }
   type User {
        _id:String!
        Username: String!
        Email: String!
        Password: String
        Profile_Pic: String,
        VerificationCode: String,
        ExpiryVCode: String
    }

    type RootQuery {
        hello:String
    }
    type RootMutation {
        signUp(userInput: userInputData!): String!
        logIn(userInput: userInputData!): User!
        forgetPassword(email: String!): String!
        checkCode(email:String!,code:String!): Boolean!
        resetPassword(email: String!,password: String!, confirmPassword: String!): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }

    
    `
)

