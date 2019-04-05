const uid = require('uid-safe');
const pool = require('../database').getPool();

module.exports.getGrantById = (id) => {
    return pool.query('SELECT * FROM rest_one.oauth_grant WHERE id=$1', [id])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};

module.exports.getGrantByClientAndCode = (clientId, code) => {
    return pool.query('SELECT * FROM rest_one.oauth_grant WHERE id=$1 AND code=$2',
        [clientId, code])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
};

module.exports.createGrant = (clientId) => {
    return uid(20)
        .then(code => {
            pool.query('INSERT INTO rest_one.oauth_grant VALUES (DEFAULT, $1, $2) RETURNING *', [clientId, code]);
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                throw new Error('Failed to create grant');
            }
        });
};
