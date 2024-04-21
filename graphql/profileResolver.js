const Workspace = require('../models/Workspace')

module.exports = {
    createWorkSpace: async function ({ inputData }, req) {  
        if (!req.auth) {
            const error = new Error("You are not authorized")
            error.code = 401
            throw error
        }
        let User = [], Board = []
        User = inputData.User;
        Board = inputData.Board
        const Title = inputData.Title
        const Admin = inputData.Admin
        isPublic = inputData.isPublic?inputData.isPublic:false
        try {
            let workspace = new Workspace({
                User, Board, Title, Admin, isPublic,
                Creator: req.current.id, Admin: [req.current.id]
            })
            await workspace.save()
            return {...workspace._doc,_id:workspace._id.toString(),Admin: workspace.Admin.toString(),Users:[workspace.Users.toString()], Creator:workspace.Creator.toString()}
        } catch (err) {
            throw err
        }

    }
}