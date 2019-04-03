const express = require('express');

const router = express.Router();
const Database = require('../database');

const pool = Database.getPool();

router.route('/')
    .get((req, res) => {
        pool.query('SELECT * FROM rest_one.user')
            .then((users) => {
                res.json(users.rows);
            })
            .catch((e) => {
                console.log(e.stack);
                res.sendStatus(500);
            });
    })
    .post((req, res) => {
        const user = req.body;

        console.log(Object.keys(user).join(','));
        console.log(Object.values(user).join(','));
        pool.query('INSERT INTO rest_one.user (name, email) VALUES ($1, $2) RETURNING *', [user.name, user.email])
            .then((result) => {
                console.log('POSTED user:');
                console.log(result.rows[0]);
                res.json(result.rows[0]);
        });
    });

router.route('/:userId')
    .get((req, res) => {
        const id = req.params.userId;

        pool.query('SELECT * FROM rest_one.user WHERE id=$1', [id])
            .then((result) => {
                if (result.rowCount === 0) {
                    res.status(404).json({
                        'error_message': 'user not found',
                    });
                } else {
                    res.json(result.rows[0]);
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

        pool.query('SELECT * FROM rest_one.user WHERE id=$1', [id])
            .then((result) => {
                if (result.rowCount === 0) {
                    res.status(404).json({
                        'error_message': 'user not found',
                    });
                }
            });

        const q = 'UPDATE rest_one.user SET name = $1, email = $2 WHERE id=$3 RETURNING *';
        pool.query(q, [user.name, user.email, id])
            .then((result) => {
                res.json(result.rows[0]);
            });
    })
    .delete((req, res) => {
        const id = req.params.userId;

        pool.query('DELETE FROM rest_one.user WHERE id=$1 RETURNING *', [id])
            .then((result) => {
                res.json(result.rows[0]);
            });
    });

module.exports = router;