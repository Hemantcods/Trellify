import { WebSocketServer } from "ws";
import http from "http";
import { parse } from "cookie";
import { verifyAccessToken } from "./jwt";
import { WebSocket } from "ws";
import { findUser } from "./services/user.service";

const httpServer = http.createServer();
const wss = new WebSocketServer({
  noServer: true,
});
httpServer.on("upgrade", async (request, socket, head) => {
  try {
    console.log("Request hit");
    const cookies = parse(request.headers.cookie ?? "");
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const payload = verifyAccessToken(accessToken);
    console.log("Authenticated user:", payload.userId);
    // get the name
    const user = await findUser(payload.userId);
    if (!user) return;
    // http upgrade
    wss.handleUpgrade(request, socket, head, (ws) => {
      const AuthenticatedWebSocket = ws as AuthenticatedWebSocket;
      AuthenticatedWebSocket.userId = payload.userId;
      AuthenticatedWebSocket.name = user.name;
      wss.emit("connection", AuthenticatedWebSocket, request);
    });
  } catch (error) {
    console.log(error);
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

export interface AuthenticatedWebSocket extends WebSocket {
  name: string;
  userId: string;
  boardId?: string;
}
type RoomUser = {
  name: string;
  socket: AuthenticatedWebSocket;
};
const ROOMS: Record<string, RoomUser[]> = {};
wss.on("connection", (socket: AuthenticatedWebSocket, request: Request) => {
  console.log("WebSocket connected");
  console.log("User name:", socket.name);
  socket.on("message", async (data) => {
    try {
      const parsedData = JSON.parse(data.toString());
      switch (parsedData.type) {
        case "join":
          await joinBoard(socket, parsedData.boardId);
          break;
        case "leave":
          if (socket.boardId) {
            leaveBoard(socket, socket.boardId);
          }
          break;
        default:
          socket.send(
            JSON.stringify({
              type: "error",
              message: "unknown event",
            }),
          );
      }
    } catch (error) {
      console.error("Websocket message error", error);
      socket.send(
        JSON.stringify({
          type: "error",
          message: "Invalid message",
        }),
      );
    }
  });
  socket.on("close", () => {
    if (socket.boardId) {
      leaveBoard(socket, socket.boardId);
    }
    console.log("Websocket connection closed", socket.name);
  });
});

httpServer.listen(3002, () => {
  console.log("WebSocket server running on port 3002");
});

async function joinBoard(socket: AuthenticatedWebSocket, boardId: string) {
  if (!ROOMS[boardId]) {
    ROOMS[boardId] = [];
  }
  // check if already joined
  const alreadyJoined = ROOMS[boardId].some((user) => user.socket == socket);
  if (alreadyJoined) {
    return;
  }
  // notify the other users
  ROOMS[boardId].forEach(({ socket: userSocket }) => {
    userSocket.send(
      JSON.stringify({
        type: "join",
        name: socket.name,
      }),
    );
  });
  // add the user
  ROOMS[boardId].push({
    name: socket.name,
    socket,
  });
  // send viewers to the newly joined user
  socket.send(
    JSON.stringify({
      type: "initial_state",
      users: ROOMS[boardId].map(({ name }) => name),
    }),
  );
}
function leaveBoard(socket: AuthenticatedWebSocket, boardId: string) {
  const room = ROOMS[boardId];
  if (!room) return;
  const user = room.find((user) => user.socket === socket);
  if (!user) return;
  ROOMS[boardId] = room.filter((user) => user.socket !== socket);
  // notify other users
  ROOMS[boardId].forEach((user) => {
    user.socket.send(
      JSON.stringify({
        type: "leave",
        userId: socket.name,
      }),
    );
  });
  // delete the empy room
  if (ROOMS[boardId].length === 0) {
    delete ROOMS[boardId];
  }
  socket.boardId = undefined;
}
