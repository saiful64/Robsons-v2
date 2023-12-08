import express from "express";
import { login, register } from '../controller/authController.js';
const route = express.Router();


route.post('/register', register)
route.post('/auth-login', login)



export default route;