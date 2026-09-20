import { useEffect, useRef, useState, useCallback } from "react";

type PresenceUser = {
  name: string;
};

type BoardSocketState = {
  users: PresenceUser[];
  connected: boolean;
  send: (message: object) => void;
  subscribe: (listener: (data: any) => void) => () => void;
};

export function useBoardSocket(boardId: string): BoardSocketState {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const listenersRef = useRef<((data: any) => void)[]>([]);

  const send = useCallback((message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const subscribe = useCallback((listener: (data: any) => void) => {
    listenersRef.current.push(listener);
    return () => {
      listenersRef.current = listenersRef.current.filter((l) => l !== listener);
    };
  }, []);

  useEffect(() => {
    if (!boardId) return;

    const wsURL = import.meta.env.VITE_WS_URL;
    if (!wsURL) {
      console.error("VITE_WS_URL is not configured");
      return;
    }

    const socket = new WebSocket(wsURL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected successfully");
      setConnected(true);
      socket.send(JSON.stringify({ type: "join", boardId }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
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
              const alreadyExists = currentUsers.some(
                (user) => user.name === data.name,
              );
              if (alreadyExists) return currentUsers;
              return [...currentUsers, { name: data.name }];
            });
            break;
          }
          case "leave": {
            setUsers((currentUsers) =>
              currentUsers.filter((user) => user.name !== data.userName),
            );
            break;
          }
          case "error": {
            console.error("WebSocket error:", data.message);
            break;
          }
          default: {
            // Board activity events - notify all subscribers
            listenersRef.current.forEach((listener) => listener(data));
            break;
          }
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
        socket.send(JSON.stringify({ type: "leave" }));
      }
      socket.close();
      socketRef.current = null;
    };
  }, [boardId]);

  return { users, connected, send, subscribe };
}
