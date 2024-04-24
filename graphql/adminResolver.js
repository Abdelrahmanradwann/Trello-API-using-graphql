const Workspace = require('../models/Workspace')
const board = require('../models/Board');
const { ObjectId } = require('mongodb');
const{ errorHandle } = require('../util/errorHandling');
const Board = require('../models/Board');

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
    }
}