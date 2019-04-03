const pool = require('./database').getPool();
const bcrypt = require('bcrypt');


class AuthenticationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthenticationError";
    }
}

class UserNotFoundError extends AuthenticationError {
    constructor(identifier) {
        super('User ' + identifier + ' not found');
        this.name = "UserNotFoundError";
    }
}

class PasswordIncorrectError extends AuthenticationError {
    constructor(message) {
        if (message === undefined) {
            message = 'Password is incorrect';
        }
        super(message);
        this.name = "PasswordIncorrectError";
    }
}

class UserAlreadyExistsError extends Error {
    constructor(id) {
        super('User ' + id + ' already exists');
        this.name = "UserAlreadyExistsError";
    }
}

function findUserBy(key, value) {
    return pool.query('SELECT * FROM rest_one.user WHERE ' + key + '=$1', [value])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
}

function findUserById(id) {
    return findUserBy('id', id);
}

function findUserByEmail(email) {
    return findUserBy('email', email);
}

function saveUser(user) {
    return findUserById(user.id)
        .then(user => {
            if (user == null) {
                throw new UserNotFoundError(user.id);
            }
            return user;
        })
        .then(user => {
            return pool.query('UPDATE rest_one.user SET email=$1 name=$2 hash=$3 WHERE id=$4',
                [user.email, user.name, user.hash, user.id]);
        });
}

function loginUser(email, password) {
    return findUserByEmail(email)
        .then(user => {
            if (user == null) {
                throw new UserNotFoundError(email);
            }
            return user;
        })
        .then(user => {
            return bcrypt.compare(password, user.hash)
                .then(match => {
                    if (match) {
                        return user;
                    } else {
                        throw new PasswordIncorrectError();
                    }
                })
        });
}

function _createUser(user) {
    return pool.query('INSERT INTO rest_one.user (email, name, hash) VALUES ($1, $2, $3) RETURNING *',
        [user.email, user.name, user.hash])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                throw new Error('User create failed');
            }
        });
}

function createUser(email, password, name) {
    return findUserByEmail(email)
        .then(user => {
            if (user != null) {
                throw new UserAlreadyExistsError(email);
            }
        })
        .then(() => {
            return bcrypt.hash(password, 10)
                .then((hash) => {
                    const user = {
                        email: email,
                        hash: hash,
                        name: name,
                    };
                    return _createUser(user);
                });
        });
}


module.exports = {
    UserNotFoundError,
    AuthenticationError,
    PasswordIncorrectError,
    UserAlreadyExistsError,
    findUserBy,
    findUserById,
    findUserByEmail,
    loginUser,
    createUser,
    saveUser,
};
