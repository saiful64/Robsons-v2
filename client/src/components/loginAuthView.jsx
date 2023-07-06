import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function LoginAuthView(props) {
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
        if (response.data === "student") {
          auth.login("student");
          navigate("/home-view");
        } else if (response.data === "doctor") {
          auth.login("doctor");
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

  const footerData = [
    { key: "mainText", displayText: "@ 2023 JIPMER, O & G  Dept." },
    { key: "subText", displayText: "Made with 🧡 by MCA students" },
  ];

  return (
    <div className="flex flex-col justify-center items-center h-screen overflow-hidden">
      <ToastContainer />
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
      <div className="flex flex-col bottom-[4%] font-light absolute inset-x-0 mt-10 animate-pulse items-center justify-center">
        {footerData.map((item) => (
          <p key={item.key} className="text-md">
            {item.displayText}
          </p>
        ))}
      </div>
    </div>
  );
}
export default LoginAuthView;
