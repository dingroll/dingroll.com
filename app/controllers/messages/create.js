var r = require('rethinkdb');

module.exports = function messageCreator(pool) {
  return function(message) {
    return pool.runQuery(r.table('messages').insert({
      body: message.body,
      creation: r.now()
    }));
  };
};
