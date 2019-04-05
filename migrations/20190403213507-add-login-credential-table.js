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
    return db.createTable('login_credential', {
        id: {
            type: 'string',
            length: 1023,
            notNull: true,
        },
        provider: {
            type: 'string',
            length: 255,
            notNull: true,
        },
        user_id: {
            type: 'int',
            notNull: true,
            foreignKey: {
                table: 'user',
                mapping: 'id',
                rules: {
                    onDelete: 'NO ACTION',
                    onUpdate: 'CASCADE',
                }
            }
        }
    });
};

exports.down = function(db) {
    return db.dropTable('login_credential');
};

exports._meta = {
  "version": 1
};
