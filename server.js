const express = require("express");
const app = express();
const WebSocket = require("ws");
const fs = require("fs");

const channels = {
  arrowwood: 137757,
  k0kcakep: 199261,
  archiedos: 187877,
};

app.get("/", (req, res) => {
  fs.readFile("messages.json", "utf-8", function (err, data) {
    res.send(data);
  });
});

const port = parseInt(process.env.PORT) || 80;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
  saveChat();
});

function saveChat() {
  const chatSocket = new WebSocket("wss://chat-1.goodgame.ru/chat2/");

  const fileName = "messages.json";

  chatSocket.addEventListener("open", (event) => {
    const message = {
      type: "join",
      data: {
        // channel_id: channels[currentChannel],
        channel_id: 137757,
        hidden: false,
      },
    };
    chatSocket.send(JSON.stringify(message));
  });

  let messageCounter = 1;
  chatSocket.onmessage = function (event) {
    const message = JSON.parse(event.data);

    if (message.type === "message" || message.type === "remove_message") {
      fs.appendFile(fileName, JSON.stringify(message) + ",", (err) => {
        console.log("Message saved to file " + messageCounter++);
      });
    }
  };
}
