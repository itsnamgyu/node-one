const pool = require('../database').getPool();

function getPostById(id) {
    return Promise.resolve()
        .then(() => {
            return pool.query('SELECT * FROM rest_one.post WHERE id=$1', [id])
        })
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                return null;
            }
        });
}

function getPostsByUser(userId) {
    return Promise.resolve()
        .then(() => {
            return pool.query('SELECT * FROM rest_one.post WHERE user_id=$1', [userId])
        })
        .then(q => {
            return q.rows;
        });
}

function createPost(userId, title, content) {
    return pool.query('INSERT INTO rest_one.post VALUES (DEFAULT, $1, $2, $3) RETURNING *', [userId, title, content])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                console.trace();
                console.log('could not create post');
                return null;
            }
        })
        .catch(e => {
            console.trace();
            console.error(e);
            return null;
        })
}

function updatePost(post) {
    const q = 'UPDATE rest_one.post SET title = $1, content = $2 WHERE id=$3 RETURNING *';
    return pool.query(q, [post.title, post.content, post.id])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                console.trace();
                console.log('could not update post');
                return null;
            }
        })
        .catch(e => {
            console.trace();
            console.error(e);
            return null;
        })
}

function deletePost(id) {
    return pool.query('DELETE FROM rest_one.post WHERE id=$1 RETURNING *', [id])
        .then(q => {
            if (q.rowCount > 0) {
                return q.rows[0];
            } else {
                console.trace();
                console.log('could not delete post');
                return null;
            }
        })
        .catch(e => {
            console.trace();
            console.error(e);
            return null;
        })
}

module.exports = {
    getPostById,
    getPostsByUser,
    createPost,
    updatePost,
    deletePost,
};
