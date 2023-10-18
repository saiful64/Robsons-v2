import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


const Landing = () => {
  const navigate = useNavigate();
  
  const text =
    "JANANAM";
  const [typedText, setTypedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < text.length) {
        setTypedText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    }, 150); // Adjust the delay between characters (typing speed) as needed.
    const cursorTimer = setInterval(() => {
        setCursorVisible((prevCursorVisible) => !prevCursorVisible);
      }, 500);
    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
    
  }, [currentIndex, text]);
  return (
    <>
    <div className="min-h-screen">
      <div className="h-screen md:flex">
        <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-[#00828E] to-[#003152]  justify-around items-center hidden">
        <div className="rounded-full overflow-hidden border-slate-100 border-4 w-48 h-48 absolute top-6 left-4">
              <img src="assets/logo.png" alt="Robson Logo" />
            </div>
          <div>
            <h1 className="text-white text-4xl font-sans p-4">{typedText}<span className={`cursor ${cursorVisible ? "visible" : "hidden"}`}>|</span></h1>
            <div className="wrapper"><div className="typing-demo"><p className="text-white p-4 mt-1">Streamline obstetric care with our <b>Robson Classification app</b>. JANANAM classifies women into 10 exclusive categories, derived from 5 essential obstetric factors, enhancing maternity care. </p>
            </div>
            </div>
          </div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        </div>
        <div className="flex h-screen sm:w-full md:w-1/2 bg-slate-50 justify-center py-10 items-center">
          <div className="lg:hidden md:hidden bg-gradient-to-r from- rounded-full overflow-hidden  border-2 w-32 h-32 absolute top-6 left-8">
          <img src="assets/logo.png" alt="Robson Logo" />
          </div>
            <div className="bg-slate-50 w-3/4">
              <h1 className="text-gray-800 font-bold text-2xl mb-1 bg-gradient-to-tr from-[#00828E] to-[#003152] bg-clip-text text-transparent ">Get Started!</h1>
              <p className="text-sm font-normal text-gray-600 mb-7">Welcome Back</p>
              <div className="">
                <button
                  className="w-full h-12 px-6 text-white transition-colors duration-150 bg-gradient-to-r from-[#00828E] to-[#003152] hover:from-teal-600 hover:to-blue-900 rounded-lg hover:shadow-xl shadow-md focus:shadow-outline text-2xl hover:bg-indigo-800" onClick={() => navigate("/login")}
                >
                  Login as Doctor 👩‍⚕️
                </button>
                <button
                  className="w-full h-12 px-6 text-gray-800 transition-colors duration-150 bg-gray-50 rounded-lg focus:shadow-outline text-2xl shadow-md hover:shadow-xl hover:bg-gray-200 mt-8" onClick={() => navigate("/login")}
                >
                  Login as Student 🧑‍🎓
                </button>

                <footer className="absolute bottom-0  p-4 ">Developed with 💚 by Pondicherry University in collaboration with JIPMER.</footer>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
    </>
  );
};

export default Landing;
