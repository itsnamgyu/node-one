const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const User = require('../db/user');
const Post = require('../db/post');

router.route('/new')
    .get(ensureLoggedIn('/user/login'),
        (req, res) => {
            res.render('post/new.html', {
                user: req.user,
            });
        })
    .post(ensureLoggedIn('/user/login'),
        (req, res) => {
        Post.createPost(req.user.id, req.body.title, req.body.content)
            .then(post => {
                if (post) {
                    res.redirect('/post/' + post.id)
                } else {
                    res.send('Could not create post');
                }
            });
    });

router.route('/:postId')
    .get((req, res) => {
        let _post = null;
        return Promise.resolve()
            .then(() => {
                return Post.getPostById(req.params.postId)
            })
            .then(post => {
                if (post == null) {
                    res.send('Post not found');
                    return Promise.reject(null);
                } else {
                    _post = post;
                    return User.findUserById(post.user_id);
                }
            })
            .then(user => {
                if (user == null) {
                    console.error('author of post does not exist');
                } else {
                    res.render('post/details.html', {
                        user: req.user,
                        author: user,
                        post: _post,
                    });
                }
            })
            .catch(e => {
                if (e) {
                    console.trace();
                    throw e;
                }
            })
    });

module.exports = router;
