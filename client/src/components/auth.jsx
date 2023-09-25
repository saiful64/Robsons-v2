import { useState, createContext, useContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const login = (user) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
	};

	const logout = () => {
		localStorage.removeItem("user");
		setUser(null);
	};

	const inactivityTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
	let inactivityTimer;

	const resetInactivityTimer = () => {
		if (inactivityTimer) {
			clearTimeout(inactivityTimer);
		}

		// Set a new timer to automatically logout the user after inactivity
		inactivityTimer = setTimeout(() => {
			logout();
		}, inactivityTimeout);
	};

	const handleUserActivity = () => {
		// Reset the inactivity timer on user activity
		resetInactivityTimer();
	};

	// Initialize the inactivity timer when the component mounts
	useEffect(() => {
		if (user) {
			resetInactivityTimer();
			// Attach an event listener to the document to handle user activity
			document.addEventListener("mousemove", handleUserActivity);
			document.addEventListener("keydown", handleUserActivity);
		}

		return () => {
			// Clean up event listeners when the component unmounts
			document.removeEventListener("mousemove", handleUserActivity);
			document.removeEventListener("keydown", handleUserActivity);
		};
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
