import { WebSocketServer } from "ws"
import { prisma } from "db/client"

const server = new WebSocketServer()

server.on("connection", (socket) => {
  
})