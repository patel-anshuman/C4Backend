const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title : String,
    body : String,
    device : String,     //"Laptop", "Tablet", "Mobile"
    no_of_comments : Number
});

const PostModel = mongoose.model('post',postSchema);

//Export model
module.exports = { PostModel };