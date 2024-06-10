const { buildSchema } = require('graphql')



// Manage users in workspace
// add, remove
module.exports = buildSchema(`



    input userBoardInput {
        userId: String!
        role: String!
    }
    input board {
        id:String!
        Users: [userBoardInput!]
        Lists: [String!]
        Title: String!
        LinkExpiryDate: String
    }
    input inputBoard {
        Creator: String!
        Title: String!
    }
    type outputBoard {
        _id: String
        Title: String!
        Creator: String!
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
    type boardResponse {
        msg: String!
        board: returnBoard
        status: Boolean!
    }    
     type Board {
        _id: String!
        lists: [String!]
        tasks: [String!]
        Creator: String!
        Title: String!
    }


    input inputWorkSpaceData {
        User: [String]
        Board: [String]
        Title: String!
        Admin: String!
        isPublic: Boolean
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
    type workspaceResponse {
        msg: String!
        ws: [returnWorkSpace]
        status: Boolean!
    }





    input inputList {
        Title: String!
        transition: [ID!]
        tasks: [ID!]
        workSpaceId: String!
        boardId: String!
        allowedRoles:[String]
    }
    type list {
        Title: String!
        Transition: [ID!]
        Creator: String!
        Tasks: [ID!]
        AllowedRoles: [String]!
    }
    type listResponse {
        msg: String!
        lst: list
        status: Boolean!
    }


    input task {
        Title: String!
        Deadline: String
        Cur_list: ID!   
        AssignedUsers: [ID!]
        Description: String
    }
    type returnTask {
        Title: String!
        Deadline: String
        Cur_list: ID!   
        AssignedUsers: [ID!]
        Description: String
    }
    type taskResponse {
        msg: String!
        task: returnTask
        status: Boolean!
    }


    type rootQuery {
        enterWorkSpace(id:String!): workspaceResponse!
        chooseBoard(id:String!): Board
        searchBoard(boardName:String!,workSpaceId:String!): [Board!]
        getWorkSpace: workspaceResponse
    }

    type rootMutation {
        addUser(userId: String!, workSpaceId: String!):String!
        removeUser(userId: String!, workSpaceId: String!): String!
        inviteUser(workSpaceId: String!, email:String!): Boolean!
        acceptInvitation(workSpaceId:String!, date:String!): Boolean!
        createBoard(inputData: inputBoard!, workspaceId: String!): outputBoard!
        createWorkSpace(inputData: inputWorkSpaceData!) : workspaceResponse
        addList(inputList: inputList!): boardResponse!
        removeList(workSpaceId: String, listId: String!): Boolean!
        modifyList(inputList: inputList!,lstId:String!): listResponse!
        modifyBoard(inputBoard: board!): boardResponse!
        deleteBoard(workSpaceId: String!, boardId: String!): Boolean!
        addTask(workSpaceId: String!, boardId: String!, listId: String!, taskData: task): taskResponse!
        modifyTask(workSpaceId: String!, boardId: String!, moveTask: Boolean!, Title:String, Deadline:String, AllowedUsers:[ID!], toListId: String, taskId: String!): taskResponse!
        addComment(taskId:String!, content:String!): taskResponse!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }

`)