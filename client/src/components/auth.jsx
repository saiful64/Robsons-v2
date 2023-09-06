import { useState, useContext, createContext, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem("user");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const login = (user) => {
		localStorage.setItem("user", JSON.stringify(user));
		setUser(user);
		resetLogoutTimer();
	};

	const logout = () => {
		localStorage.removeItem("user");
		setUser(null);
	};

	const timeoutDuration = 10 * 60 * 1000; // 1 minute in milliseconds

	const resetLogoutTimer = () => {
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}

		const timer = setTimeout(() => {
			logout();
		}, timeoutDuration);

		setLogoutTimer(timer);
	};

	// Reset the timer whenever the component mounts or the user interacts
	useEffect(() => {
		const resetTimerOnInteraction = () => {
			resetLogoutTimer();
		};

		window.addEventListener("mousemove", resetTimerOnInteraction);
		window.addEventListener("keydown", resetTimerOnInteraction);

		return () => {
			window.removeEventListener("mousemove", resetTimerOnInteraction);
			window.removeEventListener("keydown", resetTimerOnInteraction);
		};
	}, []);

	const [logoutTimer, setLogoutTimer] = useState(null);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
