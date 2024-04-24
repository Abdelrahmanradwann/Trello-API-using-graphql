const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    input inputWorkSpaceData {
        User: [String]
        Board: [String]
        Title: String!
        Admin: String!
        isPublic: Boolean
    }

    type returnWorkSpace {
        _id: String!
        Title: String!
        Admin: String!
        Users: [String!]!
        Creator: String
        isPublic: Boolean
    }

    type rootQuery {
        hello: String
    }

    type rootMutation {
        createWorkSpace(inputData: inputWorkSpaceData!) : returnWorkSpace
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }



`)