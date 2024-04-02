const Post = require("../models/Posts.model")
const { request } = require('express')
const PostsRouter = require('express').Router()
const SubGreddit = require("../models/SubGreddit.model")

PostsRouter.post('/', async (request, response) => {
    console.log(request.body)
    const { Text,
        In,
        By } = request.body
    const date = Date.parse(request.body.date)
    if (!Text) {
        return response.status(400).json({
            error: 'Text is empty in Post Creation'
        })
    }
    if (!In || !By) {
        return response.status(400).json({
            error: 'Some Fields are empty in Post Creation'
        })
    }
    const timeseconds = Date.now()
    const post = new Post({
        Text,
        Upvotes: 0,
        Downvotes: 0,
        In,
        By,
        Comments: [],
        date,
        BlockedUser: false,
        creationdate:timeseconds
    })
    const savedpost = await post.save()
    const currentsubgreddit = await SubGreddit.findById(In)
    currentsubgreddit.Post = currentsubgreddit.Post.concat(savedpost._id)
    const DATE = new Date()
    currentsubgreddit.PostGrowthData = currentsubgreddit.PostGrowthData.concat({ date: DATE, Post: savedpost._id })
    const savedsubgreddit = await currentsubgreddit.save()
    console.log(savedpost)
    response.status(201).json(savedpost)
})

PostsRouter.get('/', async (request, response) => {
    const AllPosts = await Post
        .find({}).populate('In').populate('By').populate('Comments.commented')
    response.json(AllPosts)
})

PostsRouter.get('/:id', async (request, response) => {
    const ID = request.params.id
    const post = await Post
        .findById(ID).populate('In').populate('By').populate('Comments.commented')
    console.log(post)
    response.json(post)
})

PostsRouter.get('/SubGreddit/:id', async (request, response) => {
    const ID = request.params.id
    const allpost = await Post
        .find({}).populate('In').populate('By').populate('Comments.commented')
    const myposts = allpost.filter(element => element.In._id == ID)
    console.log(myposts)
    response.json(myposts)
})

PostsRouter.put('/upvotes/:id', async (request, response) => {
    console.log(request.body)
    const { Upvotes } = request.body
    if (!Upvotes) {
        return response.status(400).json({
            error: 'Upvotes are empty in upvotes'
        })
    }
    const post = await Post.findById(request.params.id)
    console.log(post)
    post.Upvotes = Number(Upvotes)
    const updatedpost = await post.save()
    console.log(post)
    response.status(201).json(post)
})

PostsRouter.put('/downvotes/:id', async (request, response) => {
    console.log(request.body)
    const { Downvotes } = request.body
    if (!Downvotes) {
        return response.status(400).json({
            error: 'Downvotes are empty in downvotes'
        })
    }
    const post = await Post.findById(request.params.id)
    post.Downvotes = Number(Downvotes)
    const updatedpost = await post.save()
    console.log(post)
    response.status(201).json(post)
})

PostsRouter.put('/comments/:id', async (request, response) => {
    console.log(request.body)
    const { Comments } = request.body
    if (!Comments) {
        return response.status(400).json({
            error: 'Comments are empty in comments'
        })
    }
    const post = await Post.findById(request.params.id)
    post.Comments = Comments
    const updatedpost = await post.save()
    console.log(post)
    response.status(201).json(post)
})

// ! Delete the Report as well
PostsRouter.delete('/:id', async (request, response) => {
    const ID = request.params.id
    const DeletePost = await Post.findByIdAndDelete(ID)
    response.json(DeletePost)
})

PostsRouter.delete('/NonReport/:id', async (request, response) => {
    const ID = request.params.id
    const DeletePost = await Post.findByIdAndDelete(ID)
    response.json(DeletePost)
})

module.exports = PostsRouter
