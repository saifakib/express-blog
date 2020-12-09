const Flash = require('../utils/Flash');
const { validationResult } = require('express-validator');
const errorFormatter = require('../utils/validationErrorFormatter');
const readingTime = require('reading-time');
const Post = require('../models/Post')
const Profile = require('../models/Profile')
const fs = require('fs')

exports.getAllPost = async(req, res,next) => {
    try{
        const posts =await Post.find({ author: req.user._id })
        res.render('pages/dashboard/post/posts', {
            title : 'Your Created Posts',
            flashMessage : Flash.getMessage(req),
            posts
        })
    } catch(err) {
        next(err)
    }
}


exports.createPostController = (req, res, next) => {
    res.render('pages/dashboard/post/create_post.ejs', {
        title: 'Create Post',
        flashMessage: Flash.getMessage(req),
        error: {},
        value: {}
    })
}

exports.createPostPostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    const { title, body, tags } = req.body;

    if (!errors.isEmpty()) {
        req.flash('fail', 'Post does not created')
        res.render('pages/dashboard/post/create_post.ejs',
            {
                title: 'Create New Post',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                value: {
                    title, body, tags
                }
            });
    }
    if (tags) {
        tags_trim = tags.split(',').map(item => item.trim())
    }
    let readTime = readingTime(body).text;

    const post = new Post({
        title,
        body,
        author: req.user._id,
        tags: tags_trim,
        thumbnail: '',
        readTime,
        likes: [],
        dislikes: [],
        comments: []
    })
    if (req.file) {
        post.thumbnail = `/uploads/${req.file.filename}`
    }

    try {
        let createPost = await post.save()
        const _id = req.user._id;
        await Profile.findOneAndUpdate(
            { user: _id },
            { $push: { 'posts': createPost._id } }
        )
        req.flash('success', 'Post Created Succesfully !!')
        return res.redirect(`/post/update/${createPost._id}`)
    } catch (e) {
        next(e)
    }

}

exports.editPostupdateGetController = async (req, res, next) => {
    const postId = req.params.postId;
    try {
        let post = await Post.findOne({ author: req.user._id, _id: postId });
        if (!post) {
            let error = new Error('404 page not found')
            error.status = 404
            throw error
        }
        res.render('pages/dashboard/post/edit_post', {
            title: 'Edit Post',
            flashMessage: Flash.getMessage(req),
            error: {},
            post
        })
    } catch (e) {
        next(e)
    }
}

exports.editPostupdatePostController = async (req, res, next) => {
    const _id = req.params.postId;
    const errors = validationResult(req).formatWith(errorFormatter);
    const { title, body, tags } = req.body;

    try {
        let post = await Post.findById({ _id })
        if (!post) {
            let error = new Error("404 page not found")
            error.status = 404
            throw error
        }
        if (!errors.isEmpty()) {
            res.flash('fail', 'Something error in validaton')
            res.render('pages/dashboard/post/edit_post', {
                title: 'Edit Post Again',
                flashMessage: Flash.getMessage(req),
                error: errors.mapped(),
                post
            })
        }
        if (tags) {
            tags_trim = tags.split(',').map(item => item.trim())
        }
        let thumbnail = post.thumbnail;
        if (req.file) {
            fs.access(`public${post.thumbnail}`, fs.F_OK, (err) => {
                if (err) {
                    next(err)
                }
                fs.unlink(`public${post.thumbnail}`, () => {
                    thumbnail = `/uploads/${req.file.filename}`
                })
            })
            thumbnail = `/uploads/${req.file.filename}`
        }

        await Post.findByIdAndUpdate(
            { _id },
            { $set: { title, body, tags, thumbnail } },
            { new: true }
        )
        req.flash('success', 'Post Update Successfully !!!')
        res.redirect(`/post/update/${_id}`)
    } catch (e) {
        next(e)
    }
}

exports.deletePostController = async (req, res, next) => {
    const _id = req.params.postId;

    try {
        let post = await Post.findById({ _id })
        if (!post) {
            let error = new Error("404 page not found")
            error.status = 404
            throw error
        }
        await Post.findByIdAndDelete({ _id });
        await Profile.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { 'posts': _id } }
        )
        req.flash('success', 'Post remove succesfully!!')
        res.redirect('/post')
    } catch(err) {
        next(err)
    }
}