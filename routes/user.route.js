const {Router} = require('express');
const {UserModel} = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRouter = Router();

//Register
userRouter.post('/register', async (req,res) => {
    const {name, email, gender, password, age, city, is_married} = req.body;
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({name, email, gender, password:hash, age, city, is_married});
            await user.save();
            res.status(200).send({"msg": "User registration successful"});
        })
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
});

//Login
userRouter.post('/login', async (req,res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email:email, password:password});
        if(user){
            bcrypt.compare(password, user.password, (err, result) => {
                if(result){
                    res.status(200).send({
                        "msg": "Login Successful",
                        "token": jwt.sign({ "userID": user._id }, 'tony')
                    });
                } else {
                    res.status(400).send({"msg":`Wrong credentials: ${err.message}`});
                }
            });
        } else {
            res.status(400).send({"msg":"No user found!! Register first"});
        }
    } catch (err) {
        res.status(400).send({"msg":err.message});
    }
});

//Export router
module.exports = userRouter;