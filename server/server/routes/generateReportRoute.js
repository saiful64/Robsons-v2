import express from "express";
import { generateReport,generateReportOne } from '../controller/generateReportController.js';
const route = express.Router();


route.get('/api/generate-report', generateReport)
route.get('/api/generate-report-one', generateReportOne)


export default route;