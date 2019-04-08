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
         db.createTable('post', {
             'id': {
                 type: 'int',
                 autoIncrement: true,
                 primaryKey: true,
             },
              'user_id': {
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
              },
              'title': 'string',
              'content': {
                  type: 'string',
              },
          })
      });
};

exports.down = function(db) {
    return db.dropTable('post');
};

exports._meta = {
    "version": 1
};
