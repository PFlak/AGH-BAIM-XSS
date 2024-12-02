const messagesDiv = document.querySelector('#messages');
const form = document.querySelector('form');
const msgInput = document.querySelector('#message-input');

// form submit handler
form.onsubmit = event => {
    event.preventDefault(); // prevent browser refresh after form submit

    const msg = msgInput.value; // get input value

    if (msg.length === 0) return; // do not send empty messages

    socket.emit('message', msg); // emit message to socket.io server

    const messageObj = {
        clientId: socket.id,
        content: msg,
        timestamp: new Date()
    }; // create message object

    messagesDiv.appendChild(getMessageListItem(messageObj)); // add message element (li) to the DOM

    msgInput.value = ''; // clear input value
};

/**
 * @param messageObj Message object. Consists of clientId, content, timestamp.
 * @return {HTMLLIElement} ListItem (li) HTML element with message.
 */
const getMessageListItem = messageObj => {
    console.log(messageObj)
    const div = document.createElement('div'); div.classList.add('card');
    const body = document.createElement('div'); div.classList.add('card-body');
    const msgAuthorDiv = document.createElement('h5'); msgAuthorDiv.classList.add('card-title');
    const msgContentDiv = document.createElement('p'); msgContentDiv.classList.add('card-text');
    const msgTimestampDiv = document.createElement('h6'); msgTimestampDiv.classList.add('card-subtitle');

    // adding tag content
    msgAuthorDiv.innerHTML = messageObj.clientId !== socket.id ? messageObj.clientId : 'you'; // do not use innerHTML
    msgContentDiv.innerHTML = messageObj.content; // do not use innerHTML
    msgTimestampDiv.innerHTML = formatDate(messageObj.timestamp); // do not use innerHTML


    body.appendChild(msgAuthorDiv);
    body.appendChild(msgTimestampDiv);
    body.appendChild(msgContentDiv);

    div.appendChild(body)

    return div;
};

// fetch new message
socket.on('new-message', messageObj => {
    messagesDiv.appendChild(getMessageListItem(messageObj))
});
