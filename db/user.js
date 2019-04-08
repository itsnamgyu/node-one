const pool = require('../database').getPool();
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
        })
        .catch(e => {
            console.stack();
            console.log(e);
        });
}

function findUserById(id) {
    return findUserBy('id', id);
}

function findUserByEmail(email) {
    return findUserBy('email', email);
}

function findCredential(id, provider) {
    return pool.query('SELECT user_id FROM rest_one.login_credential WHERE id=$1 AND provider=$2', [id, provider]);
}

function addCredential(userId, id, provider) {
    return pool.query('INSERT INTO rest_one.login_credential (id, provider ,user_id) VALUES ($1, $2, $3)',
        [id, provider, userId]);
}

function findUserByCredential(id, provider) {
    return findCredential(id, provider)
        .then(q => {
            if (q.rowCount > 0) {
                const userId = q.rows[0]['user_id'];
                return pool.query('SELECT * FROM rest_one.user WHERE id=$1', [userId]);
            } else {
                throw null;
            }
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                console.trace();
                console.error('[critical] Found login_credential but no associated user');
                return null;
            }
        })
        .catch(e => {
            if (e == null) {
                return null;
            }
            throw e;
        })
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
            const user = {
                email: email,
                hash: null,
                name: name,
            };

            if (password) {
                return bcrypt.hash(password, 10)
                    .then((hash) => {
                        user.hash = hash;
                        return user;
                    });
            } else {
                return user;
            }
        })
        .then(user => {
            return _createUser(user);
        });
}

function getAllUsers() {
    return pool.query('SELECT id, name, email FROM rest_one.user')
        .then(q => {
            return q.rows;
        })
        .catch(e => {
            console.error(e);
            console.trace();
            throw e;
        })
}

function updateUser(user) {
    const q = 'UPDATE rest_one.user SET name = $1, email = $2 WHERE id=$3 RETURNING *';
    return pool.query(q, [user.name, user.email, user.id])
        .then(user => {
            return user;
        })
        .catch(e => {
            console.trace();
            console.error(e);
            return null;
        })
}

function deleteUser(id) {
    return pool.query('DELETE FROM rest_one.user WHERE id=$1 RETURNING *', [id])
        .then(user => {
            if (user) {
                return user;
            } else {
                console.trace();
                console.error('error deleting user');
                return null;
            }
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
    addCredential,
    findUserByCredential,
    getAllUsers,
    updateUser,
    deleteUser,
};
