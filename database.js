const fs = require('fs');
const Pool = require('pg').Pool;

let pool = null;

function getPool() {
    if (!pool) {
        try {
            const string = fs.readFileSync(__dirname + '/database.json').toString();
            const json = JSON.parse(string);
            const conf = json.dev;
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
    return pool;
}

module.exports = {
    getPool,
};
