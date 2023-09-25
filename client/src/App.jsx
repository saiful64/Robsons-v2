import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginAuthView from "../src/components/loginAuthView";
import HomeView from "./components/home-view";
import Register from "./components/Register";
import ObsIndexForm from "../src/components/form1";
import GenerateExcelSheet from "../src/components/generate-report-view";
import GenerateStatus from "../src/components/generate-status-view";
import LineChartComponent from "../src/components/lineChart";
import UploadXlsx from "../src/components/uploadXlsx";
import GraphContainer from "./components/dashboard";
import MyChartComponent from "./components/barchart";
import { AuthProvider } from "../src/components/auth";
import ProtectedRoute from "../src/components/requiredAuth";
import "react-datetime/css/react-datetime.css";
import "react-date-range/dist/styles.css"; // main css file for date-range
import "react-date-range/dist/theme/default.css"; // theme css file date-range
import PatientLog from "./components/PatientLog";
import PatientDetails from "./components/PatientDetails";
function App() {
	const [count, setCount] = useState("");

	return (
		<AuthProvider>
			<div className='relative flex max-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12'>
				<img
					src='..//assets/beams.jpg'
					alt=''
					className='absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2'
					width='1308'
				/>
				<div className='absolute inset-0 bg-[url(/assets/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]'></div>
				<div className='relative'>
					<Router>
						<Routes>
							{/* <Route exact path='/register' element={<Register />} /> */}
							<Route exact path='/' element={<LoginAuthView />} />
							<Route
								exact
								path='/home-view'
								element={
									<ProtectedRoute>
										<HomeView />
									</ProtectedRoute>
								}
							/>
							<Route
								exact
								path='/forms'
								element={
									<ProtectedRoute>
										<ObsIndexForm />
									</ProtectedRoute>
								}
							/>
							<Route
								exact
								path='/generate-excel-sheet'
								element={
									<ProtectedRoute>
										<GenerateExcelSheet />
									</ProtectedRoute>
								}
							/>
							<Route
								exact
								path='/generate-status'
								element={
									<ProtectedRoute>
										<GenerateStatus />
									</ProtectedRoute>
								}
							/>
							<Route
								exact
								path='/bar-chart'
								element={
									<ProtectedRoute>
										<MyChartComponent />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/line-chart'
								element={
									<ProtectedRoute>
										<LineChartComponent />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/dashboard'
								element={
									<ProtectedRoute>
										<GraphContainer />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/upload-xlsx'
								element={
									<ProtectedRoute>
										<UploadXlsx />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/patientlog'
								element={
									<ProtectedRoute>
										<PatientLog />
									</ProtectedRoute>
								}
							/>
							<Route
								path='/patient-details'
								element={
									<ProtectedRoute>
										<PatientDetails />
									</ProtectedRoute>
								}
							/>{" "}
						</Routes>
					</Router>
				</div>
			</div>
		</AuthProvider>
	);
}

export default App;
