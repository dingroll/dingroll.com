/* global client */

var messageArea = document.getElementById('messages');

client.haveMessage = function haveMessage(message){
  var messageCard = document.createElement('div');
  messageCard.textContent = message.body;
  messageArea.appendChild(messageCard);
};

var filterInput = document.getElementById('filterinput');
var msgForm = document.getElementById('entrybox');
var msgInput = document.getElementById('msginput');

filterInput.addEventListener('input', function setAdHocFilter() {
  var card = messageArea.lastChild;
  while (card) {
    messageArea.removeChild(card);
    card = messageArea.lastChild;
  }
  client.setAdHocFilter(filterInput.value);
});

msgForm.addEventListener('submit', function sendMessage(evt){
  client.createMessage({body: msgInput.value});
  msgInput.value = '';
  return evt.preventDefault();
});
