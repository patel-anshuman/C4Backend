const {Router} = require('express');
const {PostModel} = require('../models/post.model');

const postRouter = Router();

//Create a post
postRouter.post('/add', async (req,res) => {
    const payload = req.body;
    try {
        const data = new PostModel(payload);
        await data.save;
        res.status(200).send({"msg": "A new post created."});
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
});

//Get posts min & max, pagination
postRouter.get('/', async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const {min, max, device} = req.query;
    const {page} = req.query;
    const limit = 3;
    let skip = (Number(page)-1)*limit;
    const decoded = jwt.verify(token, 'tony');
    try {
        if(device){
            if(decoded){
                const data = PostModel.find({$and:[{userID:decoded.userID},{no_of_comments:{$gte:min}},{no_of_comments:{$lte:max}},{device:device}]}).skip(skip).limit(limit);
                if(data.length>0){
                    res.status(200).send(data);
                } else {
                    res.status(400).send({"msg": "No data found"});
                }
            }
        } else {
            if(decoded){
                const data = PostModel.find({$and:[{userID:decoded.userID},{no_of_comments:{$gte:min}},{no_of_comments:{$lte:max}}]}).skip(skip).limit(limit);
                if(data.length>0){
                    res.status(200).send(data);
                } else {
                    res.status(400).send({"msg": "No data found"});
                }
            }
        }
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
})

//Get max comment posts, pagination
postRouter.get('/top', async (req,res) => {
    const token = req.headers.authorization.split(" ")[1];
    const {page, device} = req.query;
    const limit = 3;
    let skip = (Number(page)-1)*limit;
    const decoded = jwt.verify(token, 'tony');
    try {
        if(device){
            if(decoded){
                const data = PostModel.find({$and:[{userID:decoded.userID},{device:device}]}).sort({no_of_comments: -1}).skip(skip).limit(limit);
                if(data.length>0){
                    res.status(200).send(data);
                } else {
                    res.status(400).send({"msg": "No data found"});
                }
            }
        } else {
            if(decoded){
                const data = PostModel.find({$and:[{userID:decoded.userID},{device:device}]}).sort({no_of_comments: -1}).skip(skip).limit(limit);
                if(data.length>0){
                    res.status(200).send(data);
                } else {
                    res.status(400).send({"msg": "No data found"});
                }
            }
        }
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
})

//Update data
postRouter.patch('/update/:noteID', async (req,res) => {
    const id = req.params.noteID;
    const payload = req.body;
    try {
        await PostModel.findByIdAndUpdate({_id:id},{update:payload});
        res.status(200).send({"msg": "The post has been updated."});
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
});

//Delete data
postRouter.delete('/delete/:noteID', async (req,res) => {
    const id = req.params.noteID;
    const payload = req.body;
    try {
        await PostModel.findByIdAndDelete({_id:id});
        res.status(200).send({"msg": "The post has been deleted."});
    } catch (err) {
        res.status(400).send({"msg": err.message});
    }
});

//Export router
module.exports = postRouter;