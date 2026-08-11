import { WebSocketServer } from "ws";
import { prisma } from "db/client";
import WebSocket from "ws";

const server = new WebSocketServer({ port: 3002 });

const ROOMS: Record<string, { id: Number; socket: WebSocket }[]> = {};

server.on("connection", (socket) => {
  socket.on("message", (data) => {
    const parsedData = JSON.parse(data);
    
    if (parsedData.type === "join") {
      const boardId = parsedData.boardId;
      if (!ROOMS[boardId]) {
        ROOMS[boardId] = [];
      }
      const userId = Math.random();
      // tell exh joined ROOMS
      ROOMS[boardId].forEach(({ socket }) =>
        socket.send(
          JSON.stringify({
            type: "join",
            userId,
          }),
        ),
      );
      ROOMS[boardId].push({ id: userId, socket: socket });
      // send the ROOMS other ROOMS
      socket.send(
        JSON.stringify({
          type: "initial_state",
          users: ROOMS[boardId].map((u) => u.id),
        }),
      );
    }
  });
  socket.on('close', () => {
    Object.entries(ROOMS).map(([roomId, users]) => {
      const userExists=users.find(u => u.socket === socket)
      if (userExists){
        ROOMS[roomId]=ROOMS[roomId].filter(x=>x.socket!=socket)
        users.forEach(({socket}) => {
          socket.send(JSON.stringify({
            type: "leave",
            userId:userExists.id
          }))
        })
      }
    })
  })
});
