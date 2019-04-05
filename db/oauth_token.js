const uid = require('uid-safe');
const pool = require('../database').getPool();

module.exports.getToken = (userId, clientId, token) => {
    return pool.query('SELECT * FROM rest_one.oauth_token WHERE user_id=$1 AND client_id=$2 AND value=$3',
        [userId, clientId, token])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};

module.exports.createToken = (userId, clientId) => {
    return Promise.resolve()
        .then(() => {
            return uid(255);
        })
        .then(value => {
            return pool.query('INSERT * INTO rest_one.oauth_token VALUES (DEFAULT, user_id, client_id, value) RETURNING *',
                [userId, clientId, value])
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};
