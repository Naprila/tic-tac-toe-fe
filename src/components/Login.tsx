import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../constant";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch(`${serverUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      toast.error("Invalid username or password!", {
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

    // setUser(json.username);
    localStorage.setItem("User_Email", json.email);
    navigate("/");
  };

  return (
    <div className="bg-gray-100 shadow-lg max-w-md m-auto text-center items-center relative top-1/4 rounded-md p-4">
      <h1 className=" font-semibold text-xl text-lime-500">Welcome back!</h1>
      <h2 className=" font-thin text-md">Let's get you signed in</h2>
      <div className=" flex flex-col mt-3 ">
        <input
          value={email}
          className="px-2 py-1 border m-4 rounded-sm  focus:border-lime-500 outline-none"
          type="text"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <div className="w-full  p-4 mr-3">
          <input
            value={password}
            className="px-2 py-1 border w-full rounded-sm  focus:border-lime-500 outline-none"
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
          <p className="text-xs text-lime-600 font-thin absolute left-9">
            atleast 8 chars
          </p>
        </div>
        <button
          className=" bg-green-500 mt-3 hover:bg-green-600 border-lime-600 text-white px-3 py-1 rounded-md w-16 m-auto mb-4"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
      <Link
        to="/signup"
        className="  text-sm text-lime-500 absolute bottom-3 left-5 hover:text-lime-600"
      >
        Signup
      </Link>
      <ToastContainer />
    </div>
  );
};

export default Login;
