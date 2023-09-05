import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";
import { VscEye, VscEyeClosed} from 'react-icons/vsc'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "./config"

function LoginAuthView(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState) => !prevState);
  }
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
			.post(`${API_BASE_URL}/auth-login`, body)
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
					toast.error("Invalid Credentials", {
						autoClose: 1000,
					});
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
          <div className="mb-4 relative">
            <label
              className="block font-bold text-gray-700 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border border-gray-400 p-2 w-full rounded-md"
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
              
            />
            <div className="absolute hover:cursor-pointer right-4 top-11" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? <VscEye /> : <VscEyeClosed />}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-[#393c41] hover:bg-[#cbd5e1] hover:text-black hover:shadow-lg focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500  text-white font-bold py-2 px-4 rounded-md"
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
