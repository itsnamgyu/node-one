const express = require('express');
const router = express.Router();
const passport = require('../../passport').passport;

const User = require('../../db/user');
const Post = require('../../db/post');

router.route('/')
    .get((req, res) => {
        Post.getAllPosts()
            .then(posts => {
                res.json(posts);
            });
    })
    .post(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Promise.resolve()
                .then(() => {
                    if ('title' in req.body && 'content' in req.body) {
                        return Post.createPost(req.user.id, req.body.title, req.body.content);
                    } else {
                        res.json({
                            'error_message': 'invalid request'
                        });
                    }
                })
                .then(post => {
                    if (post == null) {
                        console.trace();
                        console.error('could not create post');
                        res.json({
                            'error_message': 'internal server error'
                        });
                    } else {
                        res.json(post);
                    }
                });
        });

router.route('/:postId')
    .get((req, res) => {
        Promise.resolve()
            .then(() => {
                return Post.getPostById(req.params.postId);
            })
            .then(post => {
                if (post == null) {
                    res.json({
                        'error_message': 'not found'
                    });
                    throw null;
                }
                res.json(post);
            })
            .catch(e => {
                if (e) {
                    console.error(e);
                    console.trace();
                    res.json({
                        'error_message': 'internal server error'
                    });
                }
            })
    })
    .put(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Promise.resolve()
                .then(() => {
                    return Post.getPostById(req.params.postId);
                })
                .then(post => {
                    if (post == null) {
                        res.json({
                            'error_message': 'not found'
                        });
                        throw null;
                    }
                    if (req.user.id === post.user_id) {
                        return post;
                    } else {
                        res.json({
                            'error_message': 'unauthorized'
                        });
                        throw null;
                    }
                })
                .then(post => {
                    if ('title' in req.body && 'content' in req.body) {
                        post.title = req.body.title;
                        post.content = req.body.content;
                        return Post.updatePost(post);
                    } else {
                        res.json({
                            'error_message': 'invalid request'
                        });
                    }
                })
                .then(post => {
                    if (post == null) {
                        console.trace();
                        console.error('could not update post');
                        res.json({
                            'error_message': 'internal server error'
                        });
                    } else {
                        res.json(post);
                    }
                })
                .catch(e => {
                    if (e) {
                        console.error(e);
                        console.trace();
                        res.json({
                            'error_message': 'internal server error'
                        });
                    }
                })
        })
    .delete(
        passport.authenticate('bearer', { session: false }),
        (req, res) => {
            Promise.resolve()
                .then(() => {
                    return Post.getPostById(req.params.postId);
                })
                .then(post => {
                    if (post == null) {
                        res.json({
                            'error_message': 'not found'
                        });
                        throw null;
                    }
                    if (req.user.id === post.user_id) {
                        return post;
                    } else {
                        res.json({
                            'error_message': 'unauthorized'
                        });
                        throw null;
                    }
                })
                .then(post => {
                    return Post.deletePost(post.id)
                })
                .then(post => {
                    if (post == null) {
                        console.trace();
                        console.error('could not delete post');
                        res.json({
                            'error_message': 'internal server error'
                        });
                    } else {
                        res.json(post);
                    }
                })
                .catch(e => {
                    if (e) {
                        console.error(e);
                        console.trace();
                        res.json({
                            'error_message': 'internal server error'
                        });
                    }
                })
        });

module.exports = router;
