import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");
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
