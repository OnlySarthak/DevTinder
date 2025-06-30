const express = require('express');

const app = express();

app.use('/test', (req,res)=>{
    res.send("hello from  test");
});

app.listen(3000);
