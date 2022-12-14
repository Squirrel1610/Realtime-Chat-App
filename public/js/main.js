const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

//get usernam and room from url
const {username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
})

const socket = io.connect("wss://realtime-chat-app-eosin.vercel.app", {
    transports: ['websocket']
})
// const socket = io();

//join room
socket.emit("joinRoom", {username, room});

//get room and users in that room
socket.on("roomUsers", ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

//message from server
socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//message submit
chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;
    msg = msg.trim();

    //emit to server
    socket.emit("chatMessage", msg);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

//output message to DOM
function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    // const p = document.createElement("p");
    // p.classList.add("meta");
    // p.innerText
    div.innerHTML = `<p class="meta">${message.username}<span> - ${message.time}</span></p>
                    <p class="text">
                        ${message.text}
                    </p>`
    
    chatMessages.appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}
  
//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `${users.map((user) => `<li>${user.username}</li>`).join("")}`;
}