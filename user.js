/*
    user.js

    - Handles reading, loading of filesystem data (users.json for now).
    - Probably does not follow JS best practices
    - Based on promises, cuz, why not?

    * Note that id (pk) is not managed by the server for simplicity sake.
 */

const fs = require('fs');
const path = require('path');
const ajv = require('ajv')({allErrors: true});

const userJson = path.join(__dirname, 'user.json');
const userSchema = {
    "properties": {
        "id": { "type": "number" },
        "name": { "type": "string" },
        "email": { "type": "string" },
    }
};

const validateUser = ajv.compile(userSchema);

if (!fs.existsSync(userJson)) {
    console.log('Creating user file: ' + userJson);
    fs.writeFileSync(userJson, JSON.stringify({}));
}

function getAll() {
    return new Promise((resolve, reject) => {
        fs.readFile(userJson, (e, data) => {
            if (e) {
                reject(e);
                return;
            }
            resolve(JSON.parse(data.toString()));
        })
    });
}

function saveAll(data) {
    return new Promise((resolve, reject) => {
        const string = JSON.stringify(data);
        if (string === undefined) {
            reject('data is invalid');
            return;
        }
        console.log('Saving: ' + string);
        fs.writeFile(userJson, string, (e) => {
            if (e) {
                reject(e);
            } else{
                resolve();
            }
        });
    });
}

module.exports = {
    getAll,
    saveAll,
    validateUser,
};
