const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const user = require('./routes/user-router');
const mongoose = require('mongoose');
app.use(express.json())
port = process.env.port;
app.use('/user',user)

//db connection

mongoose.connect(process.env.DBURL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
 })
    .then(()=>{
        console.log("database connected");
    })

    .catch(()=>{
        console.log(err);
    })
     

app.listen(port, ()=>{
    console.log(`servet created at ${port}`);
})