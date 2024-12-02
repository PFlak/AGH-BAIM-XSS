const socket = io(CONFIG.SOCKETIO_SERVER);

const socketStatusDiv = document.querySelector('#socketStatus');
let reconnectAttempt = 0;

const setConnectionInfo = () => {
    if (socketStatusDiv == null) {
        console.error('DOM element with ID=\'socketStatus\' does not exist');
        return;
    }

    socketStatusDiv.textContent = socket.connected ?
        `ID: ${socket.id}` :
        `Connecting`;
};

setConnectionInfo();

socket.on('connect', () => {
    console.log('[socket.io] connected to server');
    reconnectAttempt = 0;
    setConnectionInfo();
});

socket.on('disconnect', () => {
    console.log('[socket.io] disconnected from server');
    setConnectionInfo();
});

socket.on('error', () => console.log(`[socket.io] error: ${error}`));

// socket.on('connect_error', error => console.error(`[socket.io] connect error due to ${error.message}`));

socket.io.on('error', error => console.error(`[socket.io] error due to ${error.message}`));

socket.io.on('reconnect', attemptNumber => {
    reconnectAttempt = 0;
    setConnectionInfo();
    console.log(`[socket.io] reconnected on attempt: ${attemptNumber}`);
});

socket.io.on('reconnect_attempt', attemptNumber => {
    reconnectAttempt = attemptNumber;
    setConnectionInfo();
    console.log(`[socket.io] reconnect attempt: ${attemptNumber}`);
});

socket.io.on('reconnect_error', error => console.error(`[socket.io] reconnect error: ${error}`));

socket.io.on('reconnect_failed', () => console.log('[socket.io] reconnect failed'));
