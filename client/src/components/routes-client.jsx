import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAuthView from "../components/loginAuthView";
import Register from "../components/Register";
import ConsultantHomeView from "./home-view";
import ObsIndexForm from "../components/form1";

const RoutesModules = () => {
	return (
		<Router>
			<Routes>
				{/* <Route exact path='/register' component={Register} /> */}
				<Route exact path='/' component={LoginAuthView} userType='value1' />
				<Route exact path='/home-view' component={ConsultantHomeView} />
				<Route exact path='/forms' component={ObsIndexForm} />
			</Routes>
		</Router>
	);
};

export default RoutesModules;
