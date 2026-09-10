import { WebSocketServer } from "ws";
import http from "http";
import { parse } from "cookie";
import { AccessTokenPayload, verifyAccessToken } from "./jwt";

const httpServer = http.createServer();
const wss = new WebSocketServer({
  noServer: true,
});
httpServer.on("upgrade", (request, socket, head) => {
  try {
    console.log("Request hit")
    const cookies = parse(request.headers.cookie ?? "");
    const accessToken = cookies.accessToken;
    if (!accessToken) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
      return;
    }
    const payload = verifyAccessToken(accessToken);
    console.log("Authenticated user:", payload.userId);
    // http upgrade
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request, payload);
    });
  } catch (error) {
    console.log(error)
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
  }
});

wss.on(
  "connection",
  (socket: WebSocketServer, request: Request, payload: AccessTokenPayload) => {
    console.log("WebSocket connected");
    console.log("User ID:", payload.userId);
  },
);

httpServer.listen(3002, () => {
  console.log("WebSocket server running on port 3002");
});
