const express = require('express');
const _ = require('underscore');

const router = express.Router();
const Users = require('../user');

router.route('/')
    .get((req, res) => {
        Users.getAll()
            .then((users) => {
                res.json(_.values(users));
            })
            .catch((e) => {
                console.log(e.stack);
                res.sendStatus(500);
            });
    })
    .post((req, res) => {
        const user = req.body;

        if (!Users.validateUser(user)) {
            console.log('invalid!');
            res.status(400).json({
                'error_message': 'invalid user schema',
            });
            return;
        }

        Users.getAll()
            .then((users) => {
                users[user.id] = user;
                return users;
            })
            .then((updatedUsers) => {
                Users.saveAll(updatedUsers)
                    .then(() => {
                        res.json(user);
                    });
            })
            .catch((e) => {
                console.log(e.stack);
                res.sendStatus(500);
            })
    });

router.route('/:userId')
    .get((req, res) => {
        const id = req.params.userId;

        Users.getAll()
            .then((users) => {
                if (id in users) {
                    res.json(users[id]);
                } else {
                    res.status(400).json({
                        'error_message': 'could not find user',
                    });
                }
            })
    })
    .put((req, res) => {
        const user = req.body;

        if (!Users.validateUser(user)) {
            res.status(400).json({
                'error_message': 'invalid user schema',
            });
            return;
        }

        if (!('id' in user)) {
            res.status(400).json({
                'error_message': 'user does not exist',
            })
        }

        Users.getAll()
            .then((users) => {
                users[user.id] = user;
                return users;
            })
            .then((updatedUsers) => {
                Users.saveAll(updatedUsers)
                    .then(() => {
                        res.json(user);
                    });
            })
            .catch((e) => {
                console.log(e.stack);
                res.sendStatus(500);
            });
    })
    .delete((req, res) => {
        const id = req.params.userId;
        Users.getAll()
            .then((users) => {
                if (!(id in users)) {
                    res.status(400).json({
                        'error_message': 'could not find user',
                    });
                    return;
                }
                const userString = JSON.stringify(users[id]);
                delete users[id];
                Users.saveAll(users)
                    .then(() => {
                        res.send(userString);
                    });
            })
            .catch((e) => {
                console.log(e.stack);
                res.status(500);
            });
    });

module.exports = router;