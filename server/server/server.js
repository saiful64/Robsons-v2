import express from "express";
import bodyParser from "body-parser";
import cors from "cors";


import { con } from './database/Database.js';
import { Dashboard } from "./routes/dashboardRoute.js";
import GenerateReport from "./routes/generateReportRoute.js";
import PatientLog from "./routes/patientLogRoute.js";
import Classify from "./routes/classifyRoute.js";
import GenerateStatus from "./routes/generateStatusRoute.js";
import Auth from "./routes/authRoute.js";



const app = express();
app.use(bodyParser.json());
app.use(cors());


//FOR IP ADDRESS
app.get("/get-client-ip", (req, res) => {
  const fullIpAddress = req.ip;

  const ipv4Address = fullIpAddress.includes("::ffff:")
    ? fullIpAddress.split("::ffff:")[1]
    : fullIpAddress;

  res.send(`Client IPv4 Address: ${ipv4Address}`);
});



app.use(Auth)
app.use(PatientLog)
app.use(Classify)
app.use(GenerateReport)
app.use(GenerateStatus)
app.use(Dashboard)


app.post("/api/update-status", (req, res) => {
  let formId = req.body.formId;
  let indicationForInduction = req.body.indicationForInduction;
  let sql = `UPDATE robsonsdata SET indication_for_induction = '${indicationForInduction}' WHERE id = ${formId}`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error while updating status: ", err);
      res.status(400).send({ message: "Error while updating status" });
      return;
    }

    res.status(200).send({ message: "Status updated successfully" });
  });
});


app.listen(3050, () => {
  console.log("Server is running");
});
