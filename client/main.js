var ws = new WebSocket("ws://127.0.0.1:3333/");

document.addEventListener('keypress', (e) => {
    if (e.key == "Enter") {
        newMessage();
    }
});

function newMessage() {
    var message = document.createElement("li");
    var messageValue = document.getElementById("message").value;
    var content = document.createTextNode(messageValue);
    message.appendChild(content);
    if (messageValue === '') {
        alert("Você precisa digitar alguma coisa!");
    } else {
        document.getElementById("chatUL").appendChild(message);
        ws.send(messageValue.toLowerCase());
    }
    document.getElementById("message").value = "";
}

ws.onmessage = function (event) {
    var message = document.createElement("li");
    message.className = 'botLI'
    message.innerHTML = event.data;
    document.getElementById("chatUL").appendChild(message);
};
