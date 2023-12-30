import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../constant";
import Lottie from "lottie-react";
import tictactoeAnimation from "../assets/game.json";

interface GameIDType {
  gameId: string;
}

const HomePage = () => {
  const [oppEmail, setOppEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    setOppEmail("");

    const sender_email = localStorage.getItem("User_Email");
    if (!sender_email) navigate("/signin");
    console.log(sender_email);
    const res = await fetch(`${serverUrl}/send_request`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sender_email,
      },
      body: JSON.stringify({
        sender_email,
        oppEmail,
      }),
    });

    if (res.status !== 200) {
      console.log("Error: seems like user email haven't registered yet");
      toast.error("User doesn't exist!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    localStorage.setItem("User_Move", "X");
    const json = await res.json();
    console.log(json);
  };

  const updateGameAsLive = async (gameId: GameIDType) => {
    try {
      const res = await fetch(`${serverUrl}/game/updatelive/${gameId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toUpdate: true,
        }),
      });
      if (res.status === 200) {
        console.log("GAME marked as live");
      }
    } catch (error) {
      console.log("Error sending request for updating game as live");
    }
  };

  // mark user as online
  useEffect(() => {
    const email = localStorage.getItem("User_Email");
    if (email === null) return;
    fetch(`${serverUrl}/update_status/${email}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: true,
      }),
    });
    console.log("User is online");

    return () => {
      // update user status to offline
    };
  }, []);

  useEffect(() => {
    const intervalID = setInterval(async () => {
      const email = localStorage.getItem("User_Email");
      console.log("EMAIL: ", email);
      if (email === null) navigate("/signin");
      const res = await fetch(`${serverUrl}/me/${email}`, {
        method: "GET",
      });

      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
        if (json.user.start !== undefined && json.user.start !== null) {
          // mark the game as live when both user have joined
          updateGameAsLive(json.user.start);
          navigate(`/game/${json.user.start}`);
        }
      }
    }, 3 * 1000);

    return () => {
      clearInterval(intervalID);
      console.log("IN CLEAR INTERVAL1");
    };
  }, []);

  return (
    <div>
      <NavBar />
      <Lottie
        animationData={tictactoeAnimation}
        className="w-1/4 opacity-70 absolute left-1/3 top-56 "
      />
      <div className="flex justify-center mt-20 gap-3 z-10">
        <input
          className="px-2 py-1 border rounded-sm border-blue-500 outline-none w-1/4 focus:border-2"
          value={oppEmail}
          type="text"
          placeholder="Opponent email"
          onChange={(e) => setOppEmail(e.target.value)}
        ></input>
        <button
          className=" bg-blue-500 hover:bg-blue-600 border-lime-600 text-white px-3 py-1 rounded-md text-xs"
          onClick={handleRegister}
        >
          Request match
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
