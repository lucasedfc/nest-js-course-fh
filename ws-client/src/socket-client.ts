import { Manager, Socket } from 'socket.io-client';

let socket: Socket;
export const connectToServer = (token: string) => {
  // http://localhost:3000/socket.io/socket.io.js
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
      extraHeaders: {
          authentication: token
      }
  });

  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListeners();
};

const addListeners = () => {
  const serverStatusLabel = document.querySelector('#server-status')!;
  const clientsUl = document.querySelector('#clients-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'online';
  });
  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'offline';
  });

  socket.on('clients-updated', (clients: string[]) => {
    let clientsHtml = '';
    clients.forEach((clientId) => {
      clientsHtml += `<li>${clientId}</li>`;
    });
    clientsUl.innerHTML = clientsHtml;
  });

  socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
    messagesUl.innerHTML += `<li>
                                <strong>${payload.fullName}</strong> 
                                <span> ${payload.message} </span>
                            </li>`;

  })

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;
    
    socket.emit('message-from-client', {id: '1', message: messageInput.value});
    messageInput.value = '';

  });

};
