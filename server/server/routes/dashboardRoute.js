import express from "express";
import { dashboard } from '../controller/dashboardController.js';
const route = express.Router();


export const Dashboard = route.get('/api/dashboard', dashboard)


