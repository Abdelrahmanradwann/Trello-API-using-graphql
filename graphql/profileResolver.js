const Workspace = require('../models/Workspace')
const Board = require("../models/Board")
const List = require("../models/List")

module.exports = {
    createWorkSpace: async function ({ inputData }, req) {  
        if (!req.auth) {
            const error = new Error("You are not authenticated")
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

    },
    enterWorkSpace: async function ({ id }, req) {
        if (!req.auth) {
            const error = new Error("You are not authenticated")
            error.code = 401
            throw error
        }
        if (!id) {
            const error = new Error("ID is required");
            error.code = 400;
            throw error;
        }
    
        try {
            var workspace = await Workspace.findOne({ _id: id });
            if (workspace.Users.includes(req.current.id)) {
                return { ...workspace._doc, _id: workspace._id.toString(), Admin: workspace.Admin.toString(), Users: [workspace.Users.toString()], Creator: workspace.Creator.toString(), Boards: [workspace.Boards.toString()] }
            }
            return new Error("Not authorized")
        } catch (err) {
            throw err
        }
     
    },
    chooseBoard: async function ({ id }, req) {
        if (!req.auth) {
            const error = new Error("You are not authenticated")
            error.code = 401
            throw error
        }
        if (!id) {
            const error = new Error("Board ID is required");
            error.code = 400;
            throw error;
        }
        console.log(id)
        try {
            const board = await Board.findOne({ _id: id }).
                populate({
                    path: 'Lists',
                    select: 'Creator Tasks',
                    populate: {
                        path: 'Creator',
                        select: 'username'
                    },
                    populate: {
                        path: 'Tasks',
                        select: 'Title'
                    },
            
                });
            if (Board) {
                return { ...board._doc, _id: board._id?.toString(), lists: board.Lists._id?.toString(), tasks: board.Lists.Title, Creator: board.Creator.toString(), Title: board.Title }
            }
            else {
                throw new Error("Board doesnot exist");
            }
        } catch (err) {
            throw err;
        }
    
    },
    searchBoard: async function ({ boardName, workSpaceId }, req) {
        if (!req.auth) {
            const error = new Error("You are not authenticated");
            error.code = 401;
            throw error;
        }
        if (!boardName) {
            const error = new Error("Board name is required");
            error.code = 400;
            throw error;
        }

        try {
            let boards = await Board.find({
            Title: { $regex: `^${boardName}`, $options: 'i' } // Prefix search with case-insensitive option
            });
            const ws = await Workspace.findOne({ _id: workSpaceId });
            boards = boards.filter(i => {   
                if (ws.Boards.includes(i._id)) return true;
                else return false
            })
            const result = boards.map(board => ({
                _id: board._id.toString(),
                lists: board.Lists.map(list => list._id.toString()), 
                tasks: board.Lists.Title, 
                Creator: board.Creator.toString(), 
                Title: board.Title  
            }));

        return result;

        } catch (error) {
            console.error('Error searching for boards:', error);
            throw new Error('Error searching for boards');
        }
     }
}