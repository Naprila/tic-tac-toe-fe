import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const URL =
      process.env.NODE_ENV === "production"
        ? "https://tic-tac-toe-server-tre2.onrender.com"
        : "ws://localhost:3000";
    const ws = new WebSocket(URL);
    setWebSocket(ws);
    console.log("ws connected");

    // ws.send("HI FIRST MSG");

    return () => {
      //   ws.close();
      if (ws.readyState === WebSocket.OPEN) {
        console.log("CLOSING");
        ws.close();
      }
    };
  }, []);

  return { webSocket };
};

export default useWebSocket;
