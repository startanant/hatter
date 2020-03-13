require('dotenv').config(); // --> process.env

const multer  = require('multer');
const { uuid } = require('uuidv4');

const path = require('path');
let filepath;
let fileNameExt;
let uploadFolder = 'uploads/';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    console.log("File= ", file);
    
    fileNameExt = uuid() + path.extname(file.originalname);
    filepath = uploadFolder+fileNameExt;
    console.log(filepath);
    cb(null, fileNameExt) //Appending extension
  }
});

const upload = multer({ storage });
//const upload = multer({ dest: 'public/uploads/' })

const express = require('express');
//const bodyParser = require('body-parser')

const orm = require('./orm');
const bcrypt = require ('bcrypt');
const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
 
// parse application/json
app.use(express.json())


app.use(express.static('public'));



PORT  = 3000;


app.post('/api/addHatt',async ( req,res)=>{
    // console.log(req.body);
    const result = await orm.addHatt(req.body);
    // res.json.end(JSON.stringify({response:"added"}))
    res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
})

app.delete('/api/deleteHatt',async ( req, res )=>{
    console.log('calling delete hatt api',req.body);
    const result = await orm.deleteHatt(req.body);
    // res.json.end(JSON.stringify({response:"deleted"}))
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}))
})

const saltRounds = 10;

app.post('/api/addUser', upload.single('avatar'), async ( req,res )=>{
    //console.log('api addUser called...');
    console.log("File = ", req.file);
    console.log("Body: ", req.body);
    //console.log("Body: ", req.body.myUser);
    //const result = await orm.addUser(req.body);
    // console.log('result from addUser:',result);
    //res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
    const result = await bcrypt.hash(req.body.password, saltRounds, function(err,hash){
        orm.addUser({name:req.body.name,
            email:req.body.email,
            password:hash,
            location: req.body.location,
            picture_path: filepath
        }).then (function(data){
            // console.log(hash);
            if (data != 'ER_DUP_ENTRY'){
                res.json({response:"OK",id:data.insertId});
            }
            else res.json({response:"DUPLICATED USER"});
        })
    })
    
});

app.post('/api/auth', async( req, res ) => {
    console.log(req.body);
    const user = await orm.authUser(req.body);
    //console.log(user[0].id);
    
    
    
    if (user[0]) {
        bcrypt.compare(req.body.password, user[0].password, async function(err, result) {
            if (result == true) {
                const followers = await orm.getFollowers(user[0].id);
                const following = await orm.getFollowing(user[0].id);
                const hatts = await orm.getHatts(user[0].id);
                //console.log("followers:", followers);
                
                const userInfo = {
                    id: user[0].id,
                    name: user[0].name,
                    email: user[0].email,
                    password: user[0].password,
                    location: user[0].location,
                    picture_path: user[0].picture_path,
                    followers: followers[0].numOfFollowers,
                    following: following[0].numFollowing,
                    hatts: hatts[0].numOfHatts
                };
                res.json({response:"OK", user: userInfo});
            } else {
                res.json({response: "Incorrect password. Try again?"});
            }
        })
    } else {
        res.json({response: "Email not found. Try again?"});
    }
    
});

app.post('/api/update', async( req, res ) => {
    console.log('calling api/update');
    //console.log(req.body);
    const user = await orm.authUser(req.body);
    //console.log(user);
    if (user[0]) {
        const followers = await orm.getFollowers(user[0].id);
        const following = await orm.getFollowing(user[0].id);
        const hatts = await orm.getHatts(user[0].id);

        const userInfo = {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            password: user[0].password,
            location: user[0].location,
            picture_path: user[0].picture_path,
            followers: followers[0].numOfFollowers,
            following: following[0].numFollowing,
            hatts: hatts[0].numOfHatts
        };
        res.json({response:"OK", user: userInfo});
    } else {
        res.json({response: "Unable to update. Try again?"});
    }
});


app.delete('/api/deleteUser',async ( req,res )=>{
    // console.log('api deleteUser called...');
    // console.log(req.body);
    const result = await orm.deleteUser(req.body);
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}));
});

app.post('/api/addFollower',async ( req,res)=>{
    console.log('logging addFollower API', req.body);
    const result = await orm.addFollower(req.body);
    res.json({response:"OK"});
})

app.post('/api/addComment', async ( req, res)=>{
    console.log('api addComment called...');
    console.log(req.body);
    const result = await orm.addComment(req.body);
    // console.log('result from add comment',result);
    res.json({response:"OK",id:result.insertId});
    // res.end(JSON.stringify({response:"OK",id:result.insertId}));
})

app.get ('/api/getRecentHatts', async ( req,res ) => {
    console.log('call to getRecentHatts api...');
    const result = await orm.getRecentHatts(req.body);
    res.json(result);
})

app.get('/api/getNoOfCommentsPerHatt', async ( req, res) => {
    console.log('calling api for getNoOfCommentsPerHatt');
    const result = await orm.getNoOfCommentsPerHatt();
    res.json(result);
})

app.get('/api/getTop5Followed',async (req,res) => {
    console.log('calling api for getTop5Followed');
    const result = await orm.getTop10Followed();
    res.json(result);
})



app.delete('/api/deleteComment', async ( req, res )=>{
    // console.log(`api deleteComment called...`);
    // console.log(req.body);
    const result = await orm.deleteComment(req.body);
    res.json({response:"OK"});
    // res.end(JSON.stringify({response:"OK"}));
})

app.post('/api/getUserHatts', async ( req, res)=>{
    console.log(`api getUserHatts called ...`);
    console.log(req.body);
    const result = await orm.getUserHatts(req.body);
    res.json(result);
})

app.get('/api/getProfilePic/:userId', async ( req, res)=>{
    console.log(`api getProfilePic called ...`);
    console.log(req.params.userId);
    const result = await orm.getProfilePic(req.params.userId);
    // res.json({response:"OK", path: 'uploads/02ad92f3-272c-434a-a9cb-6d6abf55cec3.jpg'});
    res.json({response:"OK", path: result[0].picture_path});
})

// connection.query('select * from hatts',function(error,results,fields){
//     console.log(results);
// })

app.listen(PORT,()=>{
    console.log(`listening on ${PORT} ...`);
})