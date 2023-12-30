import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../constant";
import msgImg from "../assets/msg.png";

interface RequestItem {
  sender: string;
}

const NavBar = () => {
  const [req, setReq] = useState<RequestItem[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleRequest = async (opp_email: string) => {
    const email = localStorage.getItem("User_Email");
    const res = await fetch(
      `${serverUrl}/delete_request/${email}/${opp_email}`,
      {
        method: "POST",
      }
    );
    const json = await res.json();
    console.log(json);
    // check if the user is online

    try {
      const user_res = await fetch(`${serverUrl}/me/${opp_email}`, {
        method: "GET",
      });
      const user_json = await user_res.json();
      console.log("USER:", user_json.user);
      if (user_json.user.status === true) {
        console.log("USER IS ONLINE");
        try {
          const assign_res = await fetch(
            `${serverUrl}/game/assignturn/${json.gameId}/${email}`,
            {
              method: "POST",
            }
          );
          const jsonres = await assign_res.json();
          console.log(jsonres);
          localStorage.setItem("User_Move", "O");
          navigate(`/game/${json.gameId}`);
        } catch (error) {
          console.log("Error in assigning the turn", error);
        }
      } else {
        toast.error("User is offline !", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("error");
        return;
      }
    } catch (error) {
      console.log("Error in fetching user details", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("User_Email");
    navigate("/signin");
  };

  useEffect(() => {
    const intervalID = setInterval(async () => {
      const email = localStorage.getItem("User_Email");
      const userDetails = await fetch(`${serverUrl}/me/${email}`, {
        method: "GET",
      });
      const json = await userDetails.json();
      console.log("REQUEST:", json.user.request);
      setReq(json.user.request);
    }, 2000);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  return (
    <div className="flex bg-cyan-100 justify-between items-center px-3 shadow-sm">
      <div className="p-3 relative flex">
        <div className="flex">
          <img src={msgImg} className="w-8 h-8 cursor" />
          <span
            className="px-1 text-white rounded-md bg-red-500 hover:bg-red-700 cursor-pointer absolute right-0 top-2"
            onClick={handleDropdownToggle}
          >
            {req.length}
          </span>
        </div>

        {dropdownVisible && req.length > 0 && (
          <div className="absolute top-10  bg-white p-2 border border-gray-300 rounded-md shadow-md">
            {req.map((item: RequestItem, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between mb-3"
              >
                <span className="mr-2 text-xs">{item.sender}</span>
                <button
                  className="px-2 py-1 text-xs bg-green-500 text-white rounded-md hover:bg-green-600"
                  onClick={() => handleRequest(item.sender)}
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className=" px-1 flex  items-center rounded-md mr-2 ">
        <Link to="/todo">todos...</Link>
      </div>
      <ToastContainer />
      <div
        className="px-2  text-xs bg-green-500 text-white rounded-md hover:bg-green-600 justify-center flex cursor-pointer h-6 items-center "
        onClick={handleLogout}
      >
        Logout
      </div>
    </div>
  );
};

export default NavBar;
