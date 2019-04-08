const express = require('express');
const router = express.Router();

const User = require('../../db/user');

router.route('/')
    .get((req, res) => {
        User.getAllUsers()
            .then((users) => {
                res.json(users);
            })
            .catch((e) => {
                console.log(e.stack);
                res.sendStatus(500);
            });
    })
    .post((req, res) => {
        const user = req.body;
        User.createUser(user.email, null, user.name)
            .then((user) => {
                console.log('Created user:');
                console.log(user);
                res.json(user);
            });
    });

router.route('/:userId')
    .get((req, res) => {
        const id = req.params.userId;

        User.findUserById(id)
            .then(user => {
                if (user == null) {
                    res.status(404).json({
                        'error_message': 'user not found',
                    });
                } else {
                    res.json(user);
                }
            });
    })
    .put((req, res) => {
        const id = req.params.userId;
        const user = req.body;

        if (user.id !== id) {
            res.status(400).json({
                'error_message': 'user id invalid',
            });
            return;
        }

        User.findUserById(id)
            .then(user => {
                if (user == null) {
                    res.status(404).json({
                        'error_message': 'user not found',
                    });
                }
            });

        User.updateUser(user)
            .then(user => {
                res.json(user);
            });
    })
    .delete((req, res) => {
        const id = req.params.userId;

        User.deleteUser(id)
            .then(user => {
                res.json(user);
            });
    });

module.exports = router;
