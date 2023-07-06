import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
	const auth = useAuth();
	return (
		<>
			{auth.user ? (
				children
			) : (
				<Navigate to='/' state={{ from: location }} />
			)}
		</>
	);
}
export default ProtectedRoute;
