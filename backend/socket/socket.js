import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
    cors:{
        origin:(process.env.CLIENT_URL || 'http://localhost:3000').split(','),
        methods:['GET', 'POST'],
        credentials: true,
    },
});

export const getReceiverSocketId = (receiverId) => {
    return [...(userSocketMap.get(String(receiverId)) || [])];
}

// A user can have more than one tab/device connected at the same time.
const userSocketMap = new Map(); // Map<userId, Set<socketId>>


io.on('connection', (socket)=>{
    const userId = String(socket.handshake.query.userId || '');
    if (userId) {
        const sockets = userSocketMap.get(userId) || new Set();
        sockets.add(socket.id);
        userSocketMap.set(userId, sockets);
    }

    io.emit('getOnlineUsers', [...userSocketMap.keys()]);

    socket.on('disconnect', ()=>{
        const sockets = userSocketMap.get(userId);
        if (sockets) {
            sockets.delete(socket.id);
            if (!sockets.size) userSocketMap.delete(userId);
        }
        io.emit('getOnlineUsers', [...userSocketMap.keys()]);
    })

})

export {app, io, server};
