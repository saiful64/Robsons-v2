import React from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import LoginAuthView from "../components/loginAuthView";
import Register from "../components/Register";
import ConsultantHomeView from "./home-view";
import JrHomeView from './JrHomeView';
import ObsIndexForm from "../components/form1";

const RoutesModules = () => {
	return (
		<Router>
			<Routes>
				{/* <Route exact path='/register' component={Register} /> */}
				<Route exact path='/' component={LoginAuthView} userType='value1' />
				<Route exact path='/home-view' component={ConsultantHomeView} />
				{/* <Route exact path='/jr-home-view' component={JrHomeView} /> */}
				<Route exact path='/forms' component={ObsIndexForm} />
			</Routes>
		</Router>
	);
};

export default RoutesModules;
