import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {
  LoginAuthView,
  HomeView,
  Register,
  ObsIndexForm,
  GenerateExcelSheet,
  GenerateStatus,
  LineChartComponent,
  UploadXlsx,
  GraphContainer,
  MyChartComponent,
  PatientLog,
  PatientDetails,
  Landing,
} from "./components"

import { AuthProvider } from "./auth/auth"
import ProtectedRoute from "./auth/requiredAuth"

import "./App.css"
import "react-datetime/css/react-datetime.css"
import "react-date-range/dist/styles.css" // main css file for date-range
import "react-date-range/dist/theme/default.css" // theme css file date-range

function App() {
  return (
    <AuthProvider>
      <div className="relative flex max-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
        <img
          src="..//assets/beams.jpg"
          alt=""
          className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
          width="1308"
        />
        <div className="absolute inset-0 bg-[url(/assets/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative">
          <Router>
            <Routes>
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/" element={<Landing />} />
              <Route exact path="/login" element={<LoginAuthView />} />
              <Route
                exact
                path="/home-view"
                element={
                  <ProtectedRoute>
                    <HomeView />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/forms"
                element={
                  <ProtectedRoute>
                    <ObsIndexForm />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/forms/:pid"
                element={
                  <ProtectedRoute>
                    <ObsIndexForm />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/generate-excel-sheet"
                element={
                  <ProtectedRoute>
                    <GenerateExcelSheet />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/generate-status"
                element={
                  <ProtectedRoute>
                    <GenerateStatus />
                  </ProtectedRoute>
                }
              />
              <Route
                exact
                path="/bar-chart"
                element={
                  <ProtectedRoute>
                    <MyChartComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/line-chart"
                element={
                  <ProtectedRoute>
                    <LineChartComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <GraphContainer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upload-xlsx"
                element={
                  <ProtectedRoute>
                    <UploadXlsx />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patientlog"
                element={
                  <ProtectedRoute>
                    <PatientLog />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landing"
                element={
                  <ProtectedRoute>
                    <Landing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-details"
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
  )
}

export default App
