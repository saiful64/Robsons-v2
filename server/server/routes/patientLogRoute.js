import express from "express";
import { patientCheck,allPatient,onePatientDetail,deletePatient } from '../controller/patientLogController.js';
const route = express.Router();


route.get('/api/check_id/:patientId', patientCheck)
route.get('/api/patients', allPatient)
route.get('/api/patient-details/:patient_id', onePatientDetail)
route.delete('/api/patients/:id', deletePatient)


export default route;