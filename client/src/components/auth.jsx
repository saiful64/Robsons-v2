import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [department, setDepartment] = useState("");

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (user, department) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    setDepartment(department);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Track user activity
  let inactivityTimeout;

  const handleUserActivity = () => {
    clearTimeout(inactivityTimeout);
    // Reset the timer whenever there is user activity
    inactivityTimeout = setTimeout(() => {
      logout(); // Log the user out after the specified inactivity period
    }, 600000); // 1 minute inactivity timeout (adjust as needed)
  };

  // Initialize the timer when the component mounts
  useEffect(() => {
    // Start tracking user activity on various events
    document.addEventListener("mousemove", handleUserActivity);
    document.addEventListener("keydown", handleUserActivity);

    // Initialize the timer for the first time
    handleUserActivity();

    // Clean up event listeners and timer when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleUserActivity);
      document.removeEventListener("keydown", handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, department, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
