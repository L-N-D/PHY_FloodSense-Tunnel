import { getSocket } from "../../services/socket.service.js";
import { chatService } from "./chat.service.js";

export const chatController = async (id, payload) => {

    const {message} = payload;

    const reply = await chatService(message, id);

    const socket = getSocket();

    socket.to(id).emit('chatbot:reply', reply);

}