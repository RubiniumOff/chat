const socket = io();
let sender = prompt('Ваш ник-нейм', '');
let room_id = prompt('ID комнаты', '')
socket.emit('chat_info', {sender, intaker: 'Денис Чашников', room_id});

const message_input = document.querySelector('#message_input');
const message_send = document.querySelector('#message_send');
const chat_display = document.querySelector('.chat-display');

message_send.onclick = () => { sendMessage() }

socket.on('incoming message', (data) => {
    createMessage(data.msg, 'incoming');
})

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && !e.shiftKey && message_input == document.activeElement) {
        e.preventDefault()
        sendMessage();
    }
})

function sendMessage() {
    let msg = message_input.value;
    if (msg != '') {
        socket.emit('user write msg', {'msg': msg, 'room_id': 1});
        createMessage(msg, 'my');
        message_input.value = '';
        message_input.focus();
        chat_display.scrollTo(0, document.body.scrollHeight, 'smooth')
    }
}

function createMessage(msg, adress) {
    let edited_msg = msg.replace(/\n/g, '<br>');
    let msg_node = `<p class="message-body ${adress} invisible">${edited_msg}</p>`;
    chat_display.innerHTML += msg_node;
    chat_display.scrollTo(0, document.body.scrollHeight, 'smooth')
    setTimeout(() => {
        let inv = document.querySelector('.message-body.invisible');
        inv.classList.remove('invisible')
    }, 100)
}