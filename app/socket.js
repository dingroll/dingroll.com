var r = require('rethinkdb');

function socketAppCtor(cfg, pool) { return function socketApp(socket) {

  // just listen for changes in sidebar filter status -
  // report every new message in active filters
  var filters;
  function reportError(err){
    socket.write({
      type: 'error',
      err: err
    });
  }

  function haveMessage(message){
    socket.write({
      type: 'haveMessage',
      message: message
    });
  }

  var adHocFilterCursor = null;

  function closeAdHocFilterCursor() {
    if (adHocFilterCursor) {
      adHocFilterCursor.close();
      adHocFilterCursor = null;
    }
  }

  function setAdHocFilterCursor(cursor) {
    return adHocFilterCursor = cursor;
  }

  function setAdHocFilter(filter) {
    closeAdHocFilterCursor();
    pool.runQuery(r.table('messages')
      .filter(r.row('body').match(filter)))
      .then(setAdHocFilterCursor)
      .then(function(){
        adHocFilterCursor.each(function (err, message) {
          if (err) return reportError(err);
          haveMessage(message);
        }, switchToChangefeed);
      });

    function switchToChangefeed() {
      closeAdHocFilterCursor();
      pool.runQuery(r.table('messages')
        .filter(r.row('body').match(filter)).changes())
        .then(setAdHocFilterCursor)
        .then(function(){
          adHocFilterCursor.each(function (err, changes) {
            if (err) return reportError(err);
            haveMessage(changes.new_val);
          });
        });
    }
  }

  socket.on('data', function(data){
    if (data.type == 'error') return console.error(data);
    else if (data.type == 'createMessage') {
      pool.runQuery(r.table('messages').insert(data.message));
    } else if (data.type == 'setAdHocFilter') {
      setAdHocFilter(data.filter);
    } else {
      console.error('Unrecognized message type', data);
    }
  });
}}

module.exports = socketAppCtor;
