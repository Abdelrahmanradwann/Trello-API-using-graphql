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
        ResetPassword: String,
        ResetPwExpiryDate: String
    }

    type RootQuery {
        hello:String
    }
    type RootMutation {
        signUp(userInput: userInputData): String!
        logIn(userInput: userInputData): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }

    
    `
)

