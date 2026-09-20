import { useEffect, useState } from "react";

type PresenceUser = {
  name: string;
};
type PresenceState = {
  users: PresenceUser[];
  connected: boolean;
};
export function useBoardPresence(boardId: string) {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!boardId) return;
    const wsURL = import.meta.env.VITE_WS_URL;
    if (!wsURL) {
      console.error("VITE_WS_URL is not configured");
      return;
    }
    const socket = new WebSocket(wsURL);
    socket.onopen = () => {
      console.log("Websocket connected sucessfully");
      setConnected(true);
      socket.send(
        JSON.stringify({
          type: "join",
          boardId,
        }),
      );
    };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Message")
        switch (data.type) {
          case "initial_state": {
            const initialUsers: PresenceUser[] = (data.users ?? []).map(
              (name: string) => ({ name }),
            );
            setUsers(initialUsers);
            break;
          }
          case "join": {
            setUsers((currentUsers) => {
              const alreadyexists = currentUsers.some(
                (user) => user.name === data.name,
              );
              if (alreadyexists) return currentUsers;
              return [...currentUsers, { name: data.name }];
            });
            break;
          }
          case "leave": {
            setUsers((currentUsers) =>
              currentUsers.filter((user) => user.name !== data.name),
            );
            break;
          }
          case "error": {
            console.error("WebSocket error:", data.message);
            break;
          }
          default:
            console.warn("Unknown WebSocket event:", data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      setConnected(false);
    };
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "leave",
          }),
        );
      }
      socket.close();
    };
  }, [boardId]);
  return {
    users,
    connected,
  } satisfies PresenceState;
}
