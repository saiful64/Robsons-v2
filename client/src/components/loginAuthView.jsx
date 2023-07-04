import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginAuthView() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let body = {
      username: username,
      password: password,
    };
    axios
      .post("http://localhost:3050/auth-login", body)
      .then((response) => {
        if (response.data === "consultant") {
          auth.login("consultant");
          navigate("/home-view");
        } else if (response.data === "junior_dr") {
          auth.login("junior_dr");
          navigate("/home-view");
        } else {
          alert("Invalid Credentials");
        }
      })
      .catch((error) => {
        if (error) {
          toast.error("Invalid Credentials");
        }
      });
  };

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <ToastContainer />
      <div className="bg-white p-6 rounded-xl shadow-xl   w-full sm:w-96">
        <h1 className="text-center hover:cursor-pointer  font-bold text-3xl mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-bold text-gray-700 mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="border border-gray-400 p-2 w-full rounded-md"
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-bold text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border border-gray-400 p-2 w-full rounded-md"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-[#393c41] hover:bg-[#cbd5e1] hover:text-black hover:shadow-md  text-white font-bold py-2 px-4 rounded-md"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginAuthView;
