const express = require('express');
const bodyParser = require('body-parser')
const orm = require('./orm');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

PORT  = 3000;


app.post('/api/addHatt',async ( req,res)=>{
    console.log(req.body);
    const result = await orm.addHatt(req.body);
    // res.json.end(JSON.stringify({response:"added"}))
    res.end(JSON.stringify({response:"added"}));
})

app.delete('/api/deleteHatt',async ( req, res )=>{
    console.log(req.body);
    const result = await orm.deleteHatt(req.body);
    // res.json.end(JSON.stringify({response:"deleted"}))
    res.end(JSON.stringify({response:"deleted"}))
})

app.post('/api/addUser', async ( req,res )=>{
    console.log('api addUser called...');
    // console.log(req.body);
    const result = await orm.addUser(req.body);
    // console.log('result from addUser:',result);
    res.end(JSON.stringify({response:"user added",id:result.insertId}));
});

app.delete('/api/deleteUser',async ( req,res )=>{
    console.log('api deleteUser called...');
    console.log(req.body);
    const result = await orm.deleteUser(req.body);
    res.end(JSON.stringify({response:"user deleted"}));
});

app.post('/api/addComment', async ( req, res)=>{
    console.log('api addComment called...');
    console.log(req.body);
    const result = await orm.addComment(req.body);
    console.log('result from add comment',result);
    res.end(JSON.stringify({response:"comment added",id:result.insertId}));
})

app.delete('/api/deleteComment', async ( req, res )=>{
    console.log(`api deleteComment called...`);
    console.log(req.body);
    const result = await orm.deleteComment(req.body);
    res.end(JSON.stringify({response:"comment deleted"}));
})

app.get('/api/getUserHatts', async ( req, res)=>{
    console.log(`api getUserHatts called ...`);
    console.log(req.body);
    const result = await orm.getUserHatts(req.body);
    res.json(result);
})


// connection.query('select * from hatts',function(error,results,fields){
//     console.log(results);
// })

app.listen(PORT,()=>{
    console.log(`listening on ${PORT} ...`);
})