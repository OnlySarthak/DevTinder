const express = require('express');

const app = express();

app.use('/get-test', (req,res,next)=>{
    // res.send("use test");
    console.log("1");
    
    next();
},(req,res,next)=>{
    console.log("2");
    // res.send("use test");
    next();
},(req,res)=>{
    console.log("3");
    res.send("use test");
    // next();
},);


// app.get('/get-test', (req,res)=>{
//     res.send("get test");
// });
// app.post('/get-test', (req,res)=>{
//     res.send("post test with get-test");
// });
// app.post('/post-test', (req,res)=>{
//     res.send("post test",req);
// });
// app.use('/get-test', (req,res)=>{
//     res.send("use test with get-test, it will catch the extensions of /get-test at the end of file");
// });


app.listen(3000);
