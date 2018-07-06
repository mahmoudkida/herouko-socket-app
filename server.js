'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const apiai = require('apiai')('bccb47faa1144397aad612f4acf8f88e');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
    socket.on('chat message', (text) => {

        // Get a reply from API.AI
        console.log("client text: " + text);

        let apiaiReq = apiai.textRequest(text, {
            sessionId: Math.random() * 1000
        });

        apiaiReq.on('response', (response) => {
            let aiText = response.result.fulfillment.speech;
            console.log("bot text: " + aiText);
            socket.emit('bot reply', aiText); // Send the result back to the browser!
        });

        apiaiReq.on('error', (error) => {
            console.log(error);
        });

        apiaiReq.end();

    });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

