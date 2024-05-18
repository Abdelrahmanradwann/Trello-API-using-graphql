const Workspace = require('../models/Workspace')
const Board = require("../models/Board")
const List = require("../models/List")
const { errorHandle } = require('../util/errorHandling');
const User = require('../models/User')

module.exports = {
    createWorkSpace: async function ({ inputData }, req) {  
          if (!req.auth) {
            const error = errorHandle('Not authenticated', 400);
            throw error;
        }
        let user = [], Board = []
        user = inputData.User;
        Board = inputData.Board
        const Title = inputData.Title
        const Admin = inputData.Admin
        isPublic = inputData.isPublic?inputData.isPublic:false
        try {
            let res = { msg: "", ws: [], status: false };
            let creator = await User.findById(req.current.id);
            let workspace = new Workspace({
                user, Board, Title, Admin, isPublic,
                Creator: req.current.id , Admin: [req.current.id],Users :[req.current.id]
            })
             await workspace.save()
            res._id = workspace._id
            res.Title = Title
            res.Admin = [req.current.id]
            res.Creator = {
                Username: creator.Username,
                Email: creator.Email
            }
            res.Users = [req.current.id]
            res.isPublic = isPublic
            res.msg = "WorkSspace created successfully"
            res.status = true         
            return res
        } catch (err) {
            throw err
        }

    },
    enterWorkSpace: async function ({ id }, req) {
         if (!req.auth) {
            const error = errorHandle('Not authenticated', 400);
            throw error;
        }
        if (!id) {
            const error = new Error("ID is required");
            error.code = 400;
            throw error;
        }
    
        try {
            let res = { msg: "", ws: [], status: false };
            var workspace = await Workspace.findOne({ _id: id }, { inviteLink: 0, LinkExpiryDate: 0 }).populate('Users', 'Username Email').populate('Creator', 'Username Email');
            if (workspace) {
                let stringIds = []
                workspace.Users.forEach(i => {
                    stringIds.push(i._id.toString())
                })
                console.log(workspace)
                if (stringIds.includes((req.current.id))) {
                    res.msg = "Success"
                    res.ws = [workspace]
                    res.status = true
                    return res
                }
            }
            return new Error("Not authorized")
        } catch (err) {
            throw err
        }
     
    },
    chooseBoard: async function ({ id }, req) {
        if (!req.auth) {
            const error = errorHandle('Not authenticated', 400);
            throw error;
        }
        if (!id) {
            const error = new Error("Board ID is required");
            error.code = 400;
            throw error;
        }
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
            const error = errorHandle('Not authenticated', 400);
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
            if (boards) {
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
            }
            else {
                throw new Error("No boards found")
            }

        } catch (error) {
            console.error('Error searching for boards:', error);
            throw new Error('Error searching for boards');
        }
    },
    getWorkSpace: async function (args,req) {
        if (req.auth) {
            let res = { msg: "", ws: [], status: false };
            try {
                let availWorkSpace = await Workspace.find({ Users: { $in: req.current.id } }, { inviteLink: 0, LinkExpiryDate: 0 }).populate('Users', 'Username Email').populate('Creator', 'Username Email');
                if (availWorkSpace) {
                    res.msg = "There are workspaces"
                    res.ws = availWorkSpace
                    res.status = true
                    return res;
                }
                res.msg = "No Workspaces"
                res.ws = {}
                res.status = false
                return res;
            
            
            }
            catch (err) {
            throw new Error(err)
        }
        }
        return new Error("Not auth");
    }
}