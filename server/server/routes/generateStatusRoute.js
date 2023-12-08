import express from "express";
import { generateStatus } from '../controller/generateStatusController.js';
const route = express.Router();


route.get('/api/generate-status-init', generateStatus)

export default route;