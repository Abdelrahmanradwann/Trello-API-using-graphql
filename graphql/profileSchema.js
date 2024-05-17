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
        Board: [String]
    }

    type Board {
        _id: String!
        lists: [String!]
        tasks: [String!]
        Creator: String!
        Title: String!
    }

    type rootQuery {
        enterWorkSpace(id:String!): returnWorkSpace!
        chooseBoard(id:String!): Board
        searchBoard(boardName:String!,workSpaceId:String!): [Board!]
    }

    type rootMutation {
        createWorkSpace(inputData: inputWorkSpaceData!) : returnWorkSpace
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }



`)