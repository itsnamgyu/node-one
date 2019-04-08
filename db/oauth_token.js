const uid = require('uid-safe');
const pool = require('../database').getPool();

module.exports.getTokenByValue = (token) => {
    return pool.query('SELECT * FROM rest_one.oauth_token WHERE value=$1', [token])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};

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

module.exports.createToken = (clientId, userId) => {
    return Promise.resolve()
        .then(() => {
            return uid(40);
        })
        .then(value => {
            return pool.query('INSERT INTO rest_one.oauth_token VALUES (DEFAULT, $1, $2, $3) RETURNING *',
                [clientId, userId, value])
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        })
        .catch(e => {
            console.error(e);
            console.trace();
            throw e;
        });
};
