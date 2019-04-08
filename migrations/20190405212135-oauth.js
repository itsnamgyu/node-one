'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
    return Promise.resolve()
        .then(() => {
            return db.createTable('oauth_client', {
                id: {
                    type: 'int',
                    primaryKey: true,
                    autoIncrement: true,
                },
                name: {
                    type: 'char',
                    length: 255,
                },
                owner_id: {
                    type: 'int',
                    foreignKey: {
                        name: 'oauth_client_owner_id_fkey',
                        table: 'user',
                        mapping: 'id',
                        rules: {
                            onDelete: 'NO ACTION',
                            onUpdate: 'CASCADE',
                        }
                    }
                },
                redirect_uri: {
                    type: 'string',
                },
                client_id: {
                    type: 'string',
                    notNull: true,
                },
                client_secret: {
                    type: 'string',
                    notNull: true,
                }
            })
        })
        .then(() =>{
            return db.addIndex('oauth_client', 'oauth_client_owner_id_name_key', ['owner_id', 'name'], true)
        })
        .then(() =>{
            return db.createTable('oauth_grant', {
                id: {
                    type: 'int',
                    primaryKey: true,
                    autoIncrement: true,
                },
                client_id: {
                    type: 'int',
                    notNull: true,
                    foreignKey: {
                        name: 'oauth_grant_client_id_fkey',
                        table: 'oauth_client',
                        mapping: 'id',
                        rules: {
                            onDelete: 'NO ACTION',
                            onUpdate: 'CASCADE',
                        },
                    }
                },
                code: {
                    type: 'string',
                    notNull: true,
                },
            })
        })
        .then(() => {
            return db.addIndex('oauth_grant', 'oauth_grant_client_code_key', ['client_id', 'code'], true);
        })
        .then(() => {
            return db.createTable('oauth_token', {
                id: {
                    type: 'int',
                    primaryKey: true,
                    autoIncrement: true,
                },
                client_id: {
                    type: 'int',
                    notNull: false,
                    foreignKey: {
                        name: 'oauth_token_client_id_fkey',
                        table: 'oauth_client',
                        mapping: 'id',
                        rules: {
                            onDelete: 'NO ACTION',
                            onUpdate: 'CASCADE',
                        },
                    }
                },
                user_id: {
                    type: 'int',
                    notNull: true,
                    foreignKey: {
                        name: 'oauth_token_user_id_fkey',
                        table: 'user',
                        mapping: 'id',
                        rules: {
                            onDelete: 'NO ACTION',
                            onUpdate: 'CASCADE',
                        },
                    }
                },
                value: {
                    type: 'string',
                    notNull: true,
                }
            });
        })
        .then(() => {
            return db.addIndex('oauth_token', 'oauth_token_client_id_user_id_value_key', ['client_id', 'user_id', 'value'], true);
        })
        .then(() => {
            return db.addIndex('oauth_token', 'oauth_token_value_key', ['value'], true);
        });
};

exports.down = function(db) {
    return Promise.resolve()
        .then(() => {
            return db.dropTable('oauth_token');
        })
        .then(() => {
            return db.dropTable('oauth_grant');
        })
        .then(() => {
            return db.dropTable('oauth_client');
        });
};

exports._meta = {
    "version": 1
};
