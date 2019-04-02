const fs = require('fs');
const Pool = require('pg').Pool;

let pool = null;

function init(env='dev') {
    try {
        const string = fs.readFileSync(__dirname + '/database.json').toString();
        const json = JSON.parse(string);
        const conf = json[env];
        pool = new Pool({
            user: conf.user,
            host: conf.host,
            database: conf.database,
            password: conf.password,
            port: conf.port,
        });
    } catch (e) {
        console.log('Misconfigured database.json');
        throw e;
    }
}

function getPool() {
    if (!pool) {
        console.log('Did not explicitly call init. Initializing in dev mode');
        init('dev');
    }
    return pool;
}

module.exports = {
    init,
    getPool,
};
