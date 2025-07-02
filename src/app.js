const express = require('express');
const auth = require('./middleware/auth')

const app = express();

app.use('/profile',auth); 

app.get('/profile/get-data', (req,res,)=>{
    res.send("data fetched");
});

app.post('/profile/put-data', (req,res,)=>{
    res.send("data added");
});

app.listen(3000);
