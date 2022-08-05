btnSend = document.getElementById('send-button');
btnLoc = document.getElementById('location-button');
chatDiv = document.querySelector('.chat-block');
inputMessage = document.getElementById('input');

let webSocket;
let isServerOpen = false;

const errorLocation = () => {
  window.alert('Невозможно получить ваше местоположение');
}

const successLocation = (position) => {
  const latitude  = position.coords.latitude;
  const longitude = position.coords.longitude;
  const newMessage = document.createElement("div");
  newMessage.innerHTML = `<a href=https://www.openstreetmap.org/#map=18/${latitude}/${longitude}>Моё местоположение</a>`;
  newMessage.classList.add("message", "client-message");
  chatDiv.appendChild(newMessage);
  chatDiv.scrollTop = chatDiv.scrollHeight - chatDiv.clientHeight;
}

function drawServerMessage(message) {
  if (message) {
  const newMessage = document.createElement("div");
  newMessage.innerHTML = message;
  newMessage.classList.add("message", "server-message");
  chatDiv.appendChild(newMessage);
  chatDiv.scrollTop = chatDiv.scrollHeight - chatDiv.clientHeight;
  }
}

function drawClientMessage(message) {
  if (message) {
  const newMessage = document.createElement("div");
  newMessage.innerHTML = message;
  newMessage.classList.add("message", "client-message");
  chatDiv.appendChild(newMessage);
  chatDiv.scrollTop = chatDiv.scrollHeight - chatDiv.clientHeight;
  }
}

const makeSocket = () => {
    return new Promise((resolve, reject) => {
      webSocket = new WebSocket("wss://echo-ws-service.herokuapp.com");
      webSocket.onclose = function(evt) {
        console.log('Соединение закрыто');
        isServerOpen = false;
      }
      webSocket.onmessage = function(evt) {
        drawServerMessage(evt.data);
      }  
      webSocket.onerror = function(event) {
        console.log('Ошибка соединения');
        reject(evt.data);
      }
      webSocket.onopen = function(evt) {
        console.log('Соединение открыто');
        resolve(true);
      }
    })
}

async function startConnection() {
  message = inputMessage.value;
  inputMessage.value = '';
  if (!(isServerOpen)) {
    isServerOpen = await makeSocket();
  }
  webSocket.send(message);
  drawClientMessage(message);

}

btnSend.addEventListener('click', startConnection);

btnLoc.addEventListener('click', () => {
    if (!navigator.geolocation) {
    window.alert('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(successLocation, errorLocation);
  }
})



