        const userName = document.getElementById("userName");
        const userList = document.getElementById("userList");
        const state = document.getElementById("state");
        const sendMessage = document.getElementById("sendMessage");
        const chatLog = document.getElementById("chatLog");
        const connectButton = document.getElementById("connectButton");
        const sendButton = document.getElementById("sendButton");
        const closeButton = document.getElementById("closeButton");
        var socket;

        console.log(userName.value);
        const connectionUrl = "ws://localhost:5000/ws?username=";
        function updateState() {
            function disable() {
                sendMessage.disabled = true;
                sendButton.disabled = true;
                closeButton.disabled = true;
                userList.disabled = true;
            }
            function enable() {
                sendMessage.disabled = false;
                sendButton.disabled = false;
                closeButton.disabled = false;
                userList.disabled = false;
            }
            connectButton.disabled = true;
            userName.disabled = true;
            if (!socket) {
                disable();
            } else {
                switch (socket.readyState) {
                    case WebSocket.CONNECTING:
                        state.innerHTML = "Verbindung wird hergestellt...";
                        disable();
                        break;
                    case WebSocket.OPEN:
                        state.innerHTML = "Verbunden";
                        enable();
                        break;
                    case WebSocket.CLOSING:
                        state.innerHTML = "Verbindung wird geschlossen...";
                        disable();
                        break;    
                    case WebSocket.CLOSED:
                        state.innerHTML = "Verbdinung geschlossen";
                        disable();
                        connectButton.disabled = false;
                        userName.disabled = false;
                        break;
                    default:
                        state.innerHTML = "Unbekannter Status: " + htmlEscape(socket.readyState);
                        disable();
                        break;
                }
            }
        }
        connectButton.onclick = function () {
            state.innerHTML = "Verbinden";
            socket = new WebSocket(connectionUrl + userName.value);
            socket.onopen = function (event) {
                updateState();
                console.log("socket verbunden", event);
            };
            socket.onclose = function (event) {
                updateState();
                chatLog.innerHTML += '<p>Keine Verbidnung: ' + htmlEscape(event.reason) + '</p>';
            };
            socket.onerror = updateState;
            socket.onmessage = function (event) {
                let json;
                console.log(event.data);
                const receivedMessage = JSON.parse(event.data);
                if (receivedMessage.Content) {
                    chatLog.innerHTML += '<p>' + htmlEscape(receivedMessage.Content) + '</p>';
                }
                if (receivedMessage.Type === "CONNECTION" && receivedMessage.Users) {
                    userList.options.length = 0;;
                    const cFirst = document.createElement("option");
                    cFirst.value = "";
                    cFirst.text = "Alle"
                    userList.add(cFirst);
                    receivedMessage.Users.forEach((user) => {
                        const c = document.createElement("option");
                        c.value = user;
                        c.text = user;
                        userList.options.add(c);
                    });
                }
            };
        };
        sendButton.onclick = function () {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                alert("Socket ist nicht verbunden");
            }
            const data = sendMessage.value;
            const message = {};
            message.Type = "chat";
            message.Sender = userName.value;
            message.Content = data;
            message.Receiver = userList.value;
            message.IsPrivate = false;
            console.log(JSON.stringify(message));
            socket.send(JSON.stringify(message));
            sendMessage.value = "";
        };
        closeButton.onclick = function () {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                alert("Socket ist nicht verbunden");
            }
            socket.close(1000, "Vom Benutzer geschlossen");
        };
        function htmlEscape(str) {
            return str.toString()
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }
