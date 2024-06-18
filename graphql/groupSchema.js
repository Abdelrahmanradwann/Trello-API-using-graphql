const { buildSchema } = require('graphql')



// Manage users in workspace
// add, remove
module.exports = buildSchema(`



    input userBoardInput {
        userId: String!
        role: String!
    }
    input boardData {
        id:String
        Users: [userBoardInput!]
        Lists: [String!]
        Title: String
        LinkExpiryDate: String
        Creator: String
    }
    type UserBoard {
        userId: ID!
        role: String!
    }  
    type Board {
        _id: ID!
        Users: [UserBoard!]
        Lists: [ID!]
        Creator: ID!
        Title: String!
        expiryDate: String
    }
    type BoardResponse {
        msg: String!
        board: Board
        status: Boolean!
    }    
   


    input workSpaceData {
        User: [String]
        Board: [String]
        Title: String!
        Admin: String!
        isPublic: Boolean
    }
    type UserWorkSpace {
        Username: String!
        Email: String!
    }
    type WorkSpace {
        _id: ID!
        Title: String!
        Admin: [ID!]
        Users: [UserWorkSpace!]
        Creator: UserWorkSpace
        isPublic: Boolean
        Boards: [String]
    }
    type WorkspaceResponse {
        msg: String!
        ws: [WorkSpace]
        status: Boolean!
    }



    input listData {
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


    input taskData {
        Title: String!
        Deadline: String
        Cur_list: ID!   
        AssignedUsers: [ID!]
        Description: String
    }
    type Task {
        Title: String!
        Deadline: String
        Cur_list: ID!   
        AssignedUsers: [ID!]
        Description: String
    }
    type TaskResponse {
        msg: String!
        task: Task
        status: Boolean!
    }




    type rootQuery {
        enterWorkSpace(id:String!): WorkspaceResponse!
        chooseBoard(id:String!): Board
        searchBoard(boardName:String!,workSpaceId:String!): [Board!]
        getWorkSpace: WorkspaceResponse
        getTasks(boardId:String,taskId:String):[TaskResponse!]
    }

    type rootMutation {
        addUser(userId: String!, workSpaceId: String!):String!
        removeUser(userId: String!, workSpaceId: String!): String!
        inviteUser(workSpaceId: String!, email:String!): Boolean!
        acceptInvitation(workSpaceId:String!, date:String!): Boolean!
        createBoard(inputData: boardData!, workspaceId: String!): BoardResponse!
        createWorkSpace(inputData: workSpaceData!) : WorkspaceResponse!
        addList(inputList: listData!): BoardResponse!
        removeList(workSpaceId: String, listId: String!): Boolean!
        modifyList(inputList: listData!,lstId:String!): listResponse!
        modifyBoard(inputBoard: boardData!): BoardResponse!
        deleteBoard(workSpaceId: String!, boardId: String!): Boolean!
        addTask(workSpaceId: String!, boardId: String!, listId: String!, taskData: taskData): TaskResponse!
        modifyTask(workSpaceId: String!, boardId: String!, moveTask: Boolean!, Title:String, 
        Deadline:String, AllowedUsers:[ID!], toListId: String, taskId: String!): TaskResponse!
        deleteTask(boardId:String!, taskId:String):Boolean!
        addComment(taskId:String!, content:String!): TaskResponse!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }

`)