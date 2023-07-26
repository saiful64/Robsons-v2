import { useAuth } from "./auth";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
	const auth = useAuth();
	const location = useLocation(); // Add this line to get the location object

	return (
		<>{auth.user ? children : <Navigate to='/' state={{ from: location }} />}</>
	);
}

export default ProtectedRoute;
