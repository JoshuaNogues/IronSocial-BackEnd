var express = require('express');
var router = express.Router();

const Post = require('../models/Post.model');
const { findById, findByIdAndUpdate } = require('../models/User.model');
const User = require('../models/User.model')

router.get('/', (req, res, next) => {
  Post.find()
    .populate('contributor')
    .sort({createdAt: -1})
    .then((foundPosts) => {
        console.log(foundPosts)
        res.json(foundPosts)
    })
    .catch((err) => {
        console.log(err)
    })
});


router.post('/create-post/:userId', (req, res, next) => {
console.log(req.body.postText)
    let newPost = {
        post: req.body.postText,
        photo: req.body.photo,
        contributor: req.params.userId,
    }

    Post.create(newPost)
.then((createdPost) => {
    User.findByIdAndUpdate({_id: req.params.userId}, {
        $push: {posts: createdPost._id}
    },{new: true})
    .then((updatedUser)=> {
        return updatedUser.populate('posts');
    })
    .then((populated) => {
        res.json(populated)
    })
    .catch((err) => {
        console.log(err)
    })

})
.catch((err) => {
    console.log(err)
})
})

router.get('/edit-post/:postId', (req, res, next) => {

    Post.findById(req.params.postId
        )
        .populate("contributor")
        .then((foundPost) => {
            console.log(foundPost)
            res.json(foundPost)
        })
        .catch((err) => {
            console.log(err)
        })

})

router.post('/edit-post/:postId', (req, res, next) => {

    Post.findByIdAndUpdate(req.params.postId, 
        {
        post: req.body.post,
        }, 
        {new: true}
        )
        .then((updatedPost) => {
            console.log(updatedPost)
            res.json(updatedPost)
        })
        .catch((err) => {
            console.log(err)
        })

})

router.get('/delete-post/:postId/:userId', (req, res, next) => {
    User.findById(req.params.userId)
        .then((foundUser) => {
            if (foundUser.posts.includes(req.params.postId)) {
                Post.findByIdAndDelete(req.params.postId)
                    .then((deletedPost) => {
                        res.json(deletedPost)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                res.json({message: "You can't delete this post"})
            }
        })
        .catch((err) => {
            console.log(err)
        })
})

module.exports = router;