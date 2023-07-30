var selectedChat = "general"

function changeChatroom() {
    var newChat = document.getElementById("chatroom")
    if (newChat != null && newChat.value != selectedChat) {
        console.log(newChat.value);
    }
    return false;
}
function sendMessages() {
    var newMessage = document.getElementById("message")
    if (newMessage != null && newMessage.value != null) {
        console.log(newMessage.value);

        // sending message to the websocket
        conn.send(newMessage.value);
    }
    return false
}
window.onload = function () {
    document.getElementById("chatroom-selection").onsubmit = changeChatroom;
    document.getElementById("chatroom-messages").onsubmit = sendMessages;

    if (window["WebSocket"]) {
        console.log("Support WebSocket!");

        // connect to ws
        conn = new WebSocket("ws://" + document.location.host + "/socket");
        conn.onmessage = function(evt){
            console.log(evt);
        }
    } else {
        alert("Browser doesn't support WebSocket!")
    }
}