import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../constant";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch(`${serverUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        email: email,
      }),
    });

    const json = await res.json();
    console.log(json);
    if (json.err && !json.err.success) {
      toast.info("Invalid input!", {
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

    if (res.status !== 200) {
      console.log("User already register");
      toast.info("Username already exist!", {
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
    // localStorage.setItem("token", json.token);
    localStorage.setItem("User_Email", json.email);

    navigate("/");
  };

  return (
    <div className=" bg-gray-100 shadow-lg max-w-md m-auto text-center items-center relative top-1/4 rounded-md p-4">
      <h1 className=" font-semibold text-xl text-lime-500">Welcome !</h1>
      <h2 className=" font-thin text-md">Let's get you signed up</h2>

      <div className=" flex flex-col mt-3">
        <div className=" w-full mt-3 mr-3">
          <input
            className="px-2 py-1 border rounded-sm w-full focus:border-lime-500 outline-none"
            value={username}
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
          <p className=" text-xs text-lime-600 font-thin absolute left-5">
            username must be atleast 5 characters and max 20 chars
          </p>
        </div>
        <div className=" w-full mt-7 mr-3">
          <input
            className="px-2 py-1 border rounded-sm w-full focus:border-lime-500 outline-none"
            value={password}
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <p className="text-xs text-lime-600 font-thin absolute left-5">
            atleast 8 chars
          </p>
        </div>
        <div className=" w-full mt-7 mr-3">
          <input
            className="px-2 py-1 border rounded-sm w-full focus:border-lime-500 outline-none"
            value={email}
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <button
          className=" bg-green-500 hover:bg-green-600 border-lime-600 text-white px-3 py-1 rounded-md m-auto mb-2 mt-8 relative"
          onClick={handleRegister}
        >
          Register
        </button>
      </div>
      <Link
        to="/signin"
        className="text-sm text-lime-500 absolute left-5 bottom-3 hover:text-lime-600"
      >
        Signin
      </Link>
      <ToastContainer />
    </div>
  );
};

export default Signup;
