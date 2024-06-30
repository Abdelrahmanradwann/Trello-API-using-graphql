const mongoose = require('mongoose');
const express = require('express')
const path = require('path');
const app = express();
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();
const authSchema = require('./graphql/authSchema')
const authResolver = require('./graphql/authResolver')
const groupSchema = require('./graphql/groupSchema')
const groupResolver = require('./graphql/groupResolver')
const jwt = require('jsonwebtoken')
const validate = require('./Middleware/authValidation')
const User = require('./models/User')
const Workspace = require('./models/Workspace')
const { preRequiredInfo } = require('./Middleware/fileUpload')
const multer = require("multer");
const io = require('./util/socket')

const url = process.env.URL;




app.use("/api/uploads/profilePicture", validate.verifyToken,(req, res, next) => {
  res.setHeader("Content-Type", "image/jpeg") 
  next()
}, express.static("uploads/profilePicture"));

app.use("/api/uploads/voice",  validate.verifyToken, (req, res, next) => {
  res.setHeader("Content-Type", "audio/mp3");
  next()
}, express.static("uploads/voice"));




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    let destinationFolder = '';
    const fileType = file.mimetype.split('/')[0];
    if (fileType === 'image') {
      destinationFolder = path.join('uploads','image')
    } else if (fileType === 'audio') {
      destinationFolder = path.join('uploads','voice')
    } else {
      return cb(new Error('Unsupported file type'), null);
    }
    cb(null, destinationFolder);
    },
    

    filename: async (req, file, cb) => {

       const ext = file.mimetype.split('/')[1];
       let filename = file.mimetype.split('/')[0];
       const curData = new Date().getTime();
       if (filename == "image" && req.current.id) {
           if (req.body.dest == 'profile') {
               filename = `${req.current.id}.${ext}`;
               const user = await User.findById(req.current.id);
               user.Profile_Pic = filename;
               await user.save();
           }
           else if (req.body.dest == 'workspace' && req.body.workspaceId && await Workspace.findById(req.body.workspaceId), { $in: { Users: req.current.id } }) {
               filename = `${req.workspaceId}.${req.current.id}.${curData}.${ext}`;
           }
           else {
               return cb('Not authorized');
           }
    } 
    else if (filename == 'audio') {
        const ws = await Workspace.findOne({ _id: req.body.workspaceId })
        if (!ws || ws.Users.findIndex(i => i._id.toString() == req.current.id.toString()) == -1) {
              return cb('Unauthorized');
        }
        else {
            filename = `${req.body.workspaceId}.${req.current.id}.${curData}.${ext}`; 
        }
    
    } else {
        return cb(new Error('Invalid file name'))
    }
    cb(null, filename); 
    },
});


const fileFilter = (req, file, cb) => {
    const fileType = file.mimetype.split("/")[0];
  if (fileType === "image" || fileType === "audio") {
    return cb(null, true);
  } else {
    return cb(new Error("Invalid file type"), false);
  }
};

const upload = multer({
    storage:storage,
    fileFilter
})




app.post('/api/file', validate.verifyToken ,upload.single('avatar'), preRequiredInfo ,(req, res) => {
    return res.status(200).send('File uploaded successfully')
})



function handleError(err) {
        if (err.originalError) {
        const error = {
            code: err.originalError.code || 400,
            msg: err.originalError.data || err.originalError.message
        }
        return error
    }
    return err
}

app.use((req, res, next) => {
    const authtoken = req.headers['authorization'] || req.headers['Authorization'];
    if (authtoken) {
        const token = authtoken.split(' ')[1];
        const SECRET_KEY = process.env.SECRET_KEY;
        try {
            const curuser = jwt.verify(token, SECRET_KEY);
            req.current = curuser;
            req.auth = true;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            } else {
                return res.status(401).json({ error: 'Authentication failed' });
            }
        }
    }
    next();
});

app.use('/graphql/auth', graphqlHTTP({
    schema: authSchema,
    rootValue: authResolver,
    customFormatErrorFn(err) {
       return handleError(err)
    }
}))

app.use('/graphql/admin', graphqlHTTP({
    schema: groupSchema,
    rootValue: groupResolver,
    customFormatErrorFn(err) {
        return handleError(err)
    }
}))






mongoose.connect(url).then(() => {
    console.log('Connected to DB');
    let server = app.listen(process.env.PORT);
    io.init(server);
    io.getIO().on('connection', io.onConnection);
})

// app.listen(process.env.PORT, () => {
//     console.log("Conntected to port")
// })