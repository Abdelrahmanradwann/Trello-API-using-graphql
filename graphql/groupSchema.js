const { buildSchema } = require('graphql')



// Manage users in workspace
// add, remove
module.exports = buildSchema(`

    input inputBoard {
        Creator: String!
        Title: String!
    }

    type outputBoard {
        _id: String
        Title: String!
        Creator: String!
    }


    input inputWorkSpaceData {
        User: [String]
        Board: [String]
        Title: String!
        Admin: String!
        isPublic: Boolean
    }

    input inputList {
        Title: String!
        transition: [ID!]
        tasks: [ID!]
        workSpaceId: String!
        boardId: String!
        allowedRoles:[String]
    }

    type User {
        Username: String!
        Email: String!
    }

    type returnWorkSpace {
        _id: ID!
        Title: String!
        Admin: [ID!]
        Users: [User!]
        Creator: User
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

    type userBoard {
        userId: ID!
        role: String!
    }

    type returnBoard {
        _id: ID!
        Users: [userBoard!]
        Lists: [ID!]!
        Creator: ID!
        Title: String!
        expiryDate: String
    }

    type workspaceResponse {
        msg: String!
        ws: [returnWorkSpace]
        status: Boolean!
    }

    type boardResponse {
        msg: String!
        board: returnBoard
        status: Boolean!
    }    



    type rootQuery {
        enterWorkSpace(id:String!): workspaceResponse!
        chooseBoard(id:String!): Board
        searchBoard(boardName:String!,workSpaceId:String!): [Board!]
        getWorkSpace: workspaceResponse
    }

    type rootMutation {
        addUser(userId: String!, workSpaceId: String!, usingLink: Boolean!):String!
        removeUser(userId: String!, workSpaceId: String!): String!
        createBoard(inputData: inputBoard!, workspaceId: String!): outputBoard!
        createWorkSpace(inputData: inputWorkSpaceData!) : workspaceResponse
        addList(inputList: inputList!): boardResponse!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }

`)