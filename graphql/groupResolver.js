const Workspace = require('../models/Workspace')
const board = require('../models/Board');
const { ObjectId } = require('mongodb');
const{ errorHandle } = require('../util/errorHandling');
const Board = require('../models/Board');
const List = require('../models/List');

module.exports = {
    addUser: async function ({ userId, workSpaceId, usingLink }, req) {
        const workspace = await Workspace.findOne({ _id: workSpaceId });
        if (!workSpaceId) {
            const error = new Error();
            error.data = 'Workspace does not found';
            error.code = 404;
            throw error;
         }
        if (!usingLink) {
            if (!req.auth) {
                const error = new Error();
                error.data = 'Not authenticated';
                error.code = 401;
                throw error;
            }
            if (!workspace.Admin.includes(req.current.id)) {
                const error = new Error();
                error.data = 'Not authorized';
                error.code = 401;
                throw error;
            }
        } else {
            const date = new Date();
            if (!workspace.LinkExpiryDate || workspace.LinkExpiryDate > date.getTime() || !workspace.isPublic) {
                const error = new Error();
                error.data = 'Link has expired, Try contact the admin';
                error.code = 400;
                throw error;
            }         
        }
        console.log(userId)
            const user = workspace.Users.includes(userId);
            if (user) {
                const error = new Error()
                error.data = 'User already exists'
                error.code = 400
                throw error
            }
            try {
                const objId = ObjectId.createFromHexString(userId);
                workspace.Users.push(objId)
                await workspace.save();
                return 'User added to workspace successfully';
            } catch (err) {
                throw err
            }
    },
    removeUser: async function ({ userId, workSpaceId }, req) {
        if (!req.auth) {
            const error = new Error();
            error.data = 'Not authenticated';
            error.code = 401;
            throw error;
        }
        try {
            const workspace = await Workspace.findById(workSpaceId);
            if (!workspace) {
                const error = new Error();
                error.data = 'Workspace does not found';
                error.code = 404;
                throw error;
            }
            if (!workspace.Users.includes(userId)) {
                const error = errorHandle('User already does not exist in this workspace',404)
                throw error;
            }
            if (!workspace.Admin.includes(req.current.id) || workspace.Creator==userId) {
                const error = errorHandle('Not authorized', 401);
                throw error;
            }
            await Workspace.updateOne({ _id: workSpaceId }, { $pull: { Users: userId, Admin: userId } })
            return 'User removed successfully from workspace'
        } catch (err) {
            throw err;
        }
    },
    createBoard: async function ({ inputData , workspaceId }, req) {
        const Title = inputData.Title;
        const Creator = inputData.Creator;
        if (!req.auth) {
            const error = errorHandle('Not authenticated', 400);
            throw error;
        }
        try {
            const workspace = await Workspace.findOne({ _id: workspaceId, Admin: { $in: req.current.id } });
            if (!workspace) {
                throw errorHandle('Workspace not found or User is not an admin in this WS', 404);
            }
            let boards = await Workspace.findOne({ _id: workspaceId }).populate({ path: 'Boards', select: 'Title' });
            for (var i of boards.Boards) {
                if (i.Title == Title) {
                    throw errorHandle('This board name already used in this workspace');
                }
            }
            let board = new Board({
                Title: Title, Creator: Creator
            })
            board = await board.save();
            workspace.Boards.push(board._id);
            await workspace.save();
            return board
        } catch (err) {
            throw err;
        }
    },  createWorkSpace: async function ({ inputData }, req) {  
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
    },
    addList: async function ({ inputList }, req) {
        if (req.auth) {
            let res = { msg: 'Missing fields', board: {}, status: false };
            if (inputList.workSpaceId && inputList.boardId) {
                try {
                    const workspace = await Workspace.findById(inputList.workSpaceId);
                    if (workspace) {
                        if (!workspace.Admin.includes(req.current.id)) {
                            throw errorHandle('Not authorized, only admins can add list', 400)
                        }
                        if (workspace.Boards.includes(inputList.boardId)) {
                            const lists = await Board.findById(inputList.boardId).select('Lists')
                                .populate('Lists', 'Title Transition AllowedRoles');
                            // console.log(lists)
                            lists.Lists.forEach(i => {
                                if (i.Title == inputList.Title) {
                                    throw errorHandle('Please select another Title for list', 400)
                                }
                            })
                            let board = await Board.findById(inputList.boardId)
                            // console.log(inputList.transition)
                            if (inputList.transition) {
                                inputList.transition.forEach(i => {
                                    if (!board.Lists.includes(i)) {
                                       throw errorHandle('Error while adding the transition of list')
                                   }
                               })
                            }
                            const list = new List({
                                Title: inputList.Title,
                                Transition: inputList.transition,
                                Creator: req.current.id,
                                Tasks: [],
                                AllowedRoles: []
                            })
                            await list.save();
                            board = await Board.findByIdAndUpdate(
                                inputList.boardId,
                                { $push: { Lists: list._id } },
                                { new: true}
                            )
                            await board.save();
                            res.board = board;
                            res.msg = 'List added to board successfully'
                            res.status = true
                            return res
                        }
                        const error = errorHandle('No Board found', 404);
                        throw error;
                    }
                    const error = errorHandle('No workspace found', 404);
                    throw error;
                } catch (err) {
                    throw err;
                }
            } else {
                
                return res;
            }
            
        } else {
            const error = errorHandle('Not authenticated', 400);
            throw error;
        }
    }
}