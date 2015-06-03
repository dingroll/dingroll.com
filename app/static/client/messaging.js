/* global client */

var messageArea = document.getElementById('messages');

client.haveMessage = function haveMessage(message){
  var follow = messageArea.scrollHeight ==
    messageArea.scrollTop + messageArea.clientHeight;
  var messageCard = document.createElement('div');
  messageCard.textContent = message.body;
  messageArea.appendChild(messageCard);
  if (follow) messageArea.scrollTop = messageArea.scrollHeight;
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
