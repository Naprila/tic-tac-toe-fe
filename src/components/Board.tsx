import { useEffect, useState } from "react";
import { BoardType, checkWinner } from "../utils/winner";
import useWebSocket from "../utils/useWebSocket";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../constant";

export const Board = () => {
  const { webSocket } = useWebSocket();
  const { id } = useParams();
  // console.log(id);
  const [turn, setTurn] = useState("");

  const [winner, setWinner] = useState(false);
  const [winnerName, setWinnerName] = useState("");
  const [tie, setTie] = useState(false);

  const [countX, setCountX] = useState(0);
  const [countY, setCountY] = useState(0);
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);
  const navigate = useNavigate();

  // const sign = turn === localStorage.getItem("User_Email") ? "X" : "O";
  const sign = localStorage.getItem("User_Move");
  // console.log(`TURN:  ${turn} -> ${sign}`);

  const updateGameAsUnLive = async (gameId: string) => {
    try {
      const res = await fetch(`${serverUrl}/game/updatelive/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUpdate: false,
        }),
      });
      if (res.status === 200) {
        console.log("GAME marked as unlive");
      }
    } catch (error) {
      console.log("Error sending request for updating game as unlive");
    }
  };

  const deleteGame = async (gameId: string) => {
    try {
      const res = await fetch(`${serverUrl}/game/deletegame/${gameId}`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.status === 200) {
        console.log(json.msg);
      } else {
        console.log(json.msg);
      }
    } catch (error) {
      console.log("Error sending request for updating game as unlive");
    }
  };

  const handleLeaveRoom = () => {
    try {
      updateGameAsUnLive(id!);
      navigate("/");
      // deleteGame(id);
    } catch (error) {
      console.log("Error in handling Leaving Room Logic");
    }
  };

  function updateBoardWithX(
    board: BoardType,
    sign: string,
    x: number,
    y: number
  ) {
    const updatedBoard = [...board];
    // if (x === 0) {
    //   updatedBoard[0] = [...board[0]];
    // } else if (x === 1) {
    //   updatedBoard[1] = [...board[1]];
    // } else if (x === 2) {
    //   updatedBoard[2] = [...board[2]];
    // }
    updatedBoard[x][y] = sign;
    // console.log(updatedBoard);
    return updatedBoard;
  }

  const handleClick = async (x: number, y: number) => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(
        JSON.stringify({
          type: "put",
          payload: {
            x: x,
            y: y,
            move: sign,
          },
        })
      );
    } else {
      console.log("WebSocket not open");
    }

    try {
      const res = await fetch(
        `${serverUrl}/game/toggleturn/${id}/${localStorage.getItem(
          "User_Email"
        )}`,
        {
          method: "POST",
        }
      );
      const json = await res.json();
      console.log("UPDATED GAME:", json.turn);
      // setTurnUpdate((prevTurnUpdate) => !prevTurnUpdate);
      // setTurn(json.turn);
    } catch (error) {
      console.log("Error Togglling tunr");
    }
  };

  const updateTurn = async () => {
    try {
      const res = await fetch(`${serverUrl}/game/${id}`, {
        method: "GET",
      });
      const turn = await res.json();
      // console.log("TT:", turn);
      setTurn(turn.game.myturn);
      // console.log("Updated Tunr");
    } catch (error) {
      console.log("Error updating Turn");
    }
  };

  const updateUserStart = async () => {
    try {
      const res = await fetch(
        `${serverUrl}/game/updatestart/${localStorage.getItem("User_Email")}`,
        {
          method: "PUT",
        }
      );
      const json = await res.json();
      if (res.status === 200) {
        console.log("START:", json.msg);
      } else {
        console.log(json.msg, json.error);
      }
    } catch (error) {
      console.log("Error updating start");
    }
  };

  const checkGameStatus = async (gameId: string) => {
    try {
      const res = await fetch(`${serverUrl}/game/${gameId}`, {
        method: "GET",
      });
      if (res.status === 200) {
        const json = await res.json();
        if (json.game.live === false) {
          deleteGame(id!);
          navigate("/");
        }
      } else {
        console.log("Error in getting game status");
      }
    } catch (error) {
      console.log("ERROR sending request for checking game Status");
    }
  };

  useEffect(() => {
    const intervalID = setInterval(() => {
      checkGameStatus(id!);
    }, 3 * 1000);

    return () => {
      clearInterval(intervalID);
    };
  });

  useEffect(() => {
    updateUserStart();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      updateTurn();
    }, 1 * 1000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    if (webSocket) {
      webSocket.onopen = () => {
        webSocket.send(
          JSON.stringify({
            type: "join",
            payload: {
              roomId: id,
            },
          })
        );
      };
    }
  }, [webSocket]);

  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = function (event) {
        const m = JSON.parse(event.data);

        // console.log("Received: ", m.payload);
        if (m.type === "put") {
          const x = m.payload.xy.x;
          const y = m.payload.xy.y;
          const move = m.payload.xy.move;
          setBoard(updateBoardWithX(board, move, x, y));
        }

        if (m.type === "finished") {
          const winnerSymbol = m.payload.winner;
          console.log("WINNER: ", winnerSymbol);
          if (winnerSymbol.winnr === "X") {
            setCountX((prevCount) => prevCount + 1);
          } else {
            setCountY((prevCount) => prevCount + 1);
          }
          setBoard([
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
          ]);
          setWinner(true);
          setWinnerName(winnerSymbol.winnr);
          {
            setTimeout(() => {
              setWinner(false);
              setWinnerName("");
            }, 3 * 1000);
          }
          return;
        }
      };
    }

    // console.log("RES:", checkWinner(board, sign));
    if (checkWinner(board, sign) === 1) {
      console.log("ITS WIN");
      if (webSocket && webSocket.readyState === WebSocket.OPEN) {
        webSocket.send(
          JSON.stringify({
            type: "finished",
            payload: {
              winnr: sign,
            },
          })
        );
      }
    } else if (checkWinner(board, sign) === 2) {
      console.log("ITS TIE");
      setBoard([
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ]);
      setTie(true);
      {
        setTimeout(() => {
          setTie(false);
        }, 3 * 1000);
      }
      return;
      // setWinner(true);
      // setWinnerName(sign);

      // return;
    }

    return () => {
      updateUserStart();
      // if (webSocket) {
      //   console.log("ws close");
      //   webSocket.close();
      // }
    };
  }, [board, webSocket]);

  return (
    <>
      <div className=" flex justify-between">
        <div className=" bg-lime-500 text-white p-5 h-10 mt-2 flex items-center justify-center rounded-r-2xl ">
          {countX}
        </div>
        <div className="">
          {winner ? (
            <div className=" flex justify-center items-center mt-10">
              <span
                className={`${
                  winnerName === "X" ? "text-lime-400" : "text-orange-400"
                }  text-2xl font-bold mr-2`}
              >
                {winnerName}
              </span>
              <p className=" font-semibold">wins the game</p>
            </div>
          ) : tie ? (
            <div className="flex justify-center items-center mt-10 text-2xl text-red-400">
              It's a tie
            </div>
          ) : turn !== localStorage.getItem("User_Email") ? (
            <div className="flex justify-center items-center mt-10 text-2xl text-gray-500">
              Your turn
            </div>
          ) : (
            <div className="mt-10 text-2xl text-gray-500">
              {" "}
              Wait, it's Opp turn &#160;{" "}
            </div>
          )}
          <div className="flex mt-36 gap-5 w-full justify-center h-16 z-10">
            <button
              className={`${
                sign === "X" ? "text-lime-400" : "text-orange-400"
              } border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16`}
              onClick={() => handleClick(0, 0)}
              disabled={
                board[0][0].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[0][0]}
            </button>
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(0, 1)}
              disabled={
                board[0][1].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[0][1]}
            </button>
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(0, 2)}
              disabled={
                board[0][2].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[0][2]}
            </button>
          </div>
          <div className="flex mt-10 gap-5 w-full m-auto justify-center h-16">
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(1, 0)}
              disabled={
                board[1][0].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[1][0]}
            </button>
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(1, 1)}
              disabled={
                board[1][1].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[1][1]}
            </button>
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(1, 2)}
              disabled={
                board[1][2].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[1][2]}
            </button>
          </div>
          <div className="flex mt-10 gap-5 w-full m-auto justify-center h-16">
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(2, 0)}
              disabled={
                board[2][0].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[2][0]}
            </button>
            <button
              className="border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(2, 1)}
              disabled={
                board[2][1].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[2][1]}
            </button>
            <button
              className=" border-2 py-5 px-6 rounded-md hover:bg-slate-200 shadow-md text-lg w-16"
              onClick={() => handleClick(2, 2)}
              disabled={
                board[2][2].length > 0 ||
                localStorage.getItem("User_Email") === turn
              }
            >
              {board[2][2]}
            </button>
          </div>
        </div>
        <div className=" bg-orange-400 text-white p-5 h-10 mt-2 flex items-center justify-center rounded-l-2xl ">
          {countY}
        </div>

        {/* <input
        className=" border bg-slate-50"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      /> */}
      </div>
      <button
        className=" bg-red-600 rounded-lg px-3 text-white flex m-auto mt-20 hover:bg-red-700"
        onClick={() => handleLeaveRoom()}
      >
        Leave room
      </button>
    </>
  );
};

export default Board;
