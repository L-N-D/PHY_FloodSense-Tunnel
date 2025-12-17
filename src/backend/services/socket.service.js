import { Server } from "socket.io";
import { chatController } from "../modules/chat/chat.controller.js";
import dotenv from 'dotenv';

dotenv.config();

const clienthttp = process.env.NEXT_PUBLIC_FRONTEND_URL;

let server;

export const initSocket = (httpServer) => {

    server = new Server(httpServer, {
        cors: {
            origin: clienthttp,
            credentials: true,
        },
    });

    server.on('connection', (client) => {
        console.log("Frontend connected:", client.id);
        // create Room
        client.on('Sign_room', ({ type, id }) => {
            // type: room name. Ex: dashboard, log
            console.log(`Signed room: ${type}:${id}`)
            client.join(`${type}:${id}`);
        })

        client.on('Sign_chatbot', (id) => {
            console.log(`Sign chat: ${id}`);
            client.userId = id;
            client.join(id);
        })
        client.on('chatbot:send', (payload) => {
            chatController(client.userId, payload);
        })

        client.on("disconnect", () => {
            console.log("Disconnected:", client.id);
        });
    });

}

export const getSocket = () => {
  if (!server) throw new Error("Socket.io not initialized");
  return server;
};