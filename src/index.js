const express = require('express');
const userRoute = require('../routes/user.route');
const postRoute = require('../routes/post.route');
const {auth} = require('../middlewares/auth.middleware');
const { connection } = require('../database/db');
const port = process.env.PORT;
require('dotenv').config();


const app = express();
app.use(express.json());

app.use('/users',userRoute);
app.use(auth);
app.use('/posts',postRoute);

app.listen(port, async () => {
    try {
        await connection;
        console.log("Connected to Mongo DB Atlas");
    } catch (err) {
        console.log("Couldn't connect to Database");
    }
    console.log(`Server is running at port ${port}`);
})

module.exports = app;