const express = require('express');

const app = express();

app.get('/get-test', (req,res)=>{
    res.send("get test");
});
app.post('/get-test', (req,res)=>{
    res.send("post test with get-test");
});
app.post('/post-test', (req,res)=>{
    res.send("post test",req);
});
app.use('/get-test', (req,res)=>{
    res.send("use test with get-test, it will catch the extensions of /get-test at the end of file");
});


app.listen(3000);
