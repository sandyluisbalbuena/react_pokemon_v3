import React from 'react';
import { Route } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';


const ProtectedRoute = ({ element: Component, ...rest }) => {
	const { isAuthenticated } = useAuthState(); // Custom hook to get authentication status

	const handleUnauthenticatedAccess = () => {
		window.location.href = '/login';
		console.log(window.location.pathname);
	};

	return isAuthenticated ? (
		<Route {...rest} element={<Component />} />
	) : (
		// <Navigate to="/login" /> // Redirect to login page or any other page for unauthenticated users
		<>
			{/* {()=>handleUnauthenticatedAccess()} */}
		</>
	);
};

export default ProtectedRoute;
