const { buildSchema } = require('graphql')



// Manage users in workspace
// add, remove
module.exports = buildSchema(`



    type rootQuery {
        _root: String!
    }
    type rootMutation {
        addUser(userId: String!, workSpaceId: String!, usingLink: Boolean!):String!
        removeUser(userId: String!, workSpaceId: String!): String!
    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }

`)