/* global client */

var messageArea = document.getElementById('messages');

client.haveMessage = function haveMessage(message){
  var messageCard = document.createElement('div');
  var messageBody = document.createElement('span');
  messageBody.className = 'msg-body';
  messageBody.textContent = message.body;
  messageCard.appendChild(messageBody);
  messageCard.appendChild(document.createTextNode(' '));
  var messageScope = document.createElement('span');
  messageScope.className = 'msg-scope';
  messageScope.textContent = message.scope;
  messageCard.appendChild(messageScope);

  var follow = messageArea.scrollHeight ==
    messageArea.scrollTop + messageArea.clientHeight;
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
  client.createMessage({
    body: msgInput.value,
    scope: filterInput.value
  });
  msgInput.value = '';
  return evt.preventDefault();
});
