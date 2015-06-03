/* global Primus */

var client = {};

(function(){
  var socket = new Primus();

  client.setAdHocFilter = function setAdHocFilter(filter) {
    return socket.write({type:'setAdHocfilter', filter: filter});
  };

  client.addPeripheralFilter = function addPeripheralFilter(filter) {
    return socket.write({type:'addPeripheralFilter', filter: filter});
  };

  client.createMessage = function createMessage(message) {
    return socket.write({type:'createMessage', message: message});
  };

  // receiveMessage and co. are created in messaging.js
  socket.on("data", function(data) {
    if (data.type == 'error') return console.error(data);
    else if (data.type == 'createMessage') {
      return client.haveMessage && client.haveMessage(data.message);
    } else {
      console.error('Unrecognized message type', data);
    }
  });
})();
