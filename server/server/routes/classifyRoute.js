import express from "express";
import { formdata, submitForm , updateForm} from '../controller/classifyController.js';
const route = express.Router();


route.get('/api/form-data', formdata)
route.post('/submit-form', submitForm)
route.post('/update-form/:pid', updateForm)



export default route;