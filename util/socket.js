const { getPayLoad } = require('../Middleware/authValidation')

let io;

exports.init = server => {
    io = require('socket.io')(server);
    io.userSocket = new Map();
    io.socketToUser = new Map();
    return io;
}
exports.getIO = () => {
    return io;
}

exports.onConnection = socket => {
    socket.on('addUser', stream => {
        if (stream.token) {   
            let userId = getPayLoad({ Authorization: stream.token });
            if (!userId) {
                throw (new Error())
            }
            io.userSocket[userId] = socket.id;
            io.socketToUser[socket.id] = userId;
        }
    });
    socket.on('disconnect', () => {
        io.userSocket.delete(io.socketToUser[socket.id]);
        io.socketToUser.delete(socket.id);
    });
}
