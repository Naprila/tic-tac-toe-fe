import { useEffect } from "react";
import Board from "./components/Board";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Todo from "./components/Todo";

const App = () => {
  // const { webSocket } = useWebSocket();
  // const [text, setText] = useState("");

  // const sendMsg = () => {
  //   console.log("Sending text");
  //   if (webSocket.readyState === WebSocket.OPEN) {
  //     webSocket.send(text);
  //   } else {
  //     console.log("WS NOT OPEND");
  //   }
  // };

  useEffect(() => {
    // if (webSocket) {
    //   webSocket.onmessage = function (event) {
    //     console.log("Received: ", event.data);
    //   };
    // }
    // return () => {
    //   if (webSocket) {
    //     console.log("ws close");
    //     webSocket.close();
    //   }
    // };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:id" element={<Board />} />
        <Route path="/todo" element={<Todo />} />
      </Routes>
    </BrowserRouter>
    // <div className="w-full ">
    //   <Board player="player" />
    // </div>
  );
};

export default App;
