var selectedChat = "general"

class Event {
    constructor(type, payload) {
        this.type = type;
        this.payload = payload;
    }
}
class SendMessageEvent {
    constructor(message, from) {
        this.message = message;
        this.from = from;
    }
}
class NewMessageEvent {
    constructor(message, from, sent) {
        this.message = message;
        this.from = from;
        this.sent = sent;
    }
}
class ChangeChatRoomEvent {
    constructor(name) {
        this.name = name
    }
}
function changeChatRoom() {
    var newChat = document.getElementById("chatroom")
    if (newChat != null && newChat.value != selectedChat) {
        selectedChat = newChat.value
        header = document.getElementById("chat-header").innerHTML = "Currently in: " + selectedChat;

        let changeEvent = new ChangeChatRoomEvent(selectedChat);

        sendEvent("change_room", changeEvent)
        textarea = document.getElementById("chatmessages");
        textarea.innerHTML = `You changed room into ${selectedChat}`;
    }
    return false;
}

function routeEvent(event) {
    if (event.type === undefined) {
        alert("type is undefined")
    }
    switch (event.type) {
        case "new_message":
            const messageEvent = Object.assign(new NewMessageEvent, event.payload)
            appendChatMessage(messageEvent)
            break;
        default:
            alert("unsupported message type")
    }
}
function appendChatMessage(messageEvent) {
    var date = new Date(messageEvent.sent);
    const formattedMessage = `${date.toLocaleString()}: ${messageEvent.message}`

    textarea = document.getElementById("chatmessages");
    textarea.innerHTML = textarea.innerHTML + "\n" + formattedMessage
    textarea.scrollTop = textarea.scrollHeight;
}

function sendEvent(eventName, payload) {
    const event = new Event(eventName, payload)
    conn.send(JSON.stringify(event))
}

function sendMessages() {
    var newMessage = document.getElementById("message")
    if (newMessage != null && newMessage.value != null) {
        let outGoingEvent = new NewMessageEvent(newMessage.value, "quack");
        console.log(newMessage.value);

        // sending message to the websocket
        sendEvent("send_message", outGoingEvent)
    }
    return false
}
function login() {
    let formData = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }
    fetch("login", {
        method: "post",
        body: JSON.stringify(formData),
        mode: "cors"
    }).then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw "unauthorized"
        }
    }).then((data) => {
        // we are authenticated
        connectWebsocket(data.otp);
    }).catch((e) => alert(e))
    return false;
}
function connectWebsocket(otp) {
    if (window["WebSocket"]) {
        console.log("Support WebSocket!");

        // connect to ws
        conn = new WebSocket("wss://" + document.location.host + "/socket?otp=" + otp);

        conn.onopen = function () {
            document.getElementById("connection-header").innerHTML = "connected to websocket: true 🚀"
        }

        conn.onclose = function () {
            document.getElementById("connection-header").innerHTML = "connected to websocket: false 😶‍🌫️"
            // reconnection
        }

        conn.onmessage = function (evt) {
            const eventData = JSON.parse(evt.data);
            const event = Object.assign(new Event, eventData);
            routeEvent(event)

        }
    } else {
        alert("Browser doesn't support WebSocket!")
    }
}

window.onload = function () {
    document.getElementById("chatroom-selection").onsubmit = changeChatRoom;
    document.getElementById("chatroom-messages").onsubmit = sendMessages;
    document.getElementById("login-form").onsubmit = login;
}