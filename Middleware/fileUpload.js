const Workspace = require('../models/Workspace')
const fs = require('fs');

const preRequiredInfo = async (req, res, next) => {
    if (req.body.dest == 'workspace') {
        try {
           const member = await Workspace.findOne({ _id: req.body.workspaceId, Users: { $in: [req.current.id] } });
            if (!member) {
                const error = new Error('Not authorized');
                throw(error)
            }
            next();
        } catch (err) {
            deleteFile(req.file.path)
            next(err);
        }
    } else if (req.body.dest == 'profile') {
        if (!req.current.id) {
            deleteFile(req.file.path)
            next(new Error('Not authenticated'));
        }
        next();
    }
    else {
          // Delete the file
        deleteFile(req.file.path)
        next(new Error('Invalid destination'));
    }
}

function deleteFile(path){
    fs.unlink(path, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err}`);
        } else {
            console.log(`File was deleted successfully`);
        }
    })
}

module.exports = {preRequiredInfo}