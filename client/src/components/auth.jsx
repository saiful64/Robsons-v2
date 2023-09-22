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

	// Add a timer to automatically log out after 1 hour of inactivity
	let logoutTimer;

	const startLogoutTimer = () => {
		logoutTimer = setTimeout(() => {
			logout();
		}, 60 * 60 * 1000); // 1 hour in milliseconds
	};

	const resetLogoutTimer = () => {
		clearTimeout(logoutTimer);
		startLogoutTimer();
	};

	// Call resetLogoutTimer whenever there is user activity
	useEffect(() => {
		if (user) {
			resetLogoutTimer();
		}
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
