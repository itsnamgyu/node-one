/*
    user.js

    - Handles reading, loading of filesystem data (users.json for now).
    - Probably does not follow JS best practices
    - Based on promises, cuz, why not?

    * Note that id (pk) is not managed by the server for simplicity sake.
 */

const ajv = require('ajv')({ allErrors: true, removeAdditional: true, });

const fullUserSchema = {
    "properties": {
        "id": {
            "type": [ "integer", "string" ],
            "pattern": "^\\d+$"
        },
        "name": { "type": "string" },
        "email": { "type": "string" },
    },
    "required": [
        "id", "name", "email",
    ],
};
const newUserSchema = {
    "properties": {
        "id": {
            "type": [ "integer", "string" ],
            "pattern": "^\d+$"
        },
        "name": { "type": "string" },
        "email": { "type": "string" },
    },
    "required": [
        "name", "email",
    ],
};

const validateNewUser = ajv.compile(newUserSchema);
const validateFullUser = ajv.compile(fullUserSchema);

module.exports = {
    validateNewUser,
    validateFullUser,
};
