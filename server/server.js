import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import groupLogics from "./constants/groupLogics.json" assert { type: "json" };
import cors from "cors";
import formData from "./constants/formData.json" assert { type: "json" };
import _ from "lodash";
import moment from "moment";
import excel from "node-excel-export";
import styles from "./constants/constants.js";
import util from "util";
import { log } from "console";
import multer from "multer";
import xlsx from "xlsx";
import ExcelJS from "exceljs";
import xlsx_style from "xlsx-style";

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

const app = express();
const totalGroupList = [
  "Group 1",
  "Group 2",
  "Group 3",
  "Group 4",
  "Group 5",
  "Group 6",
  "Group 7",
  "Group 8",
  "Group 9",
  "Group 10",
];

const totalMonthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
app.use(bodyParser.json());

app.use(cors());
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "robsonclassification",
  multipleStatements: true,
});

con.connect((err) => {
  if (!err) console.log("connection successful");
  else console.log("connection failed" + JSON.stringify(err));
});

//const query11 = util.promisify(con.query).bind(con);

//FOR IP ADDRESS
app.get("/get-client-ip", (req, res) => {
  const fullIpAddress = req.ip;

  const ipv4Address = fullIpAddress.includes("::ffff:")
    ? fullIpAddress.split("::ffff:")[1]
    : fullIpAddress;

  res.send(`Client IPv4 Address: ${ipv4Address}`);
});

const department = null;

app.get("/api/form-data", (req, res) => {
  res.status(200).send(formData);
});

app.get("/api/check_id/:patientId", (req, res) => {
  const { patientId } = req.params;

  const query = `SELECT COUNT(*) AS count FROM robsonsdata WHERE patient_id = ?`;

  con.query(query, [patientId], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const exists = results[0].count > 0;

      if (exists) {
        // Send a response indicating that the patient ID exists
        res.json({ exists: true });
      } else {
        // Send a response indicating that the patient ID does not exist
        res.json({ exists: false });
      }
    }
  });
});

app.get("/api/patients", (req, res) => {
  // Query the database to fetch patient IDs from the robsonsdata table
  console.log(department);
  con.query(
    "SELECT patient_id,created_on FROM robsonsdata WHERE department = ?",
    [department],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      // Send the patient IDs as JSON
      console.log(results);
      res.json(results);
    }
  );
});

app.get("/api/patient-details/:patient_id", (req, res) => {
  const { patient_id } = req.params;

  const sql =
    "SELECT patient_id,obs_index,weeks,pog,previous_cesarean,fetus_type,presentation_single,presentation_twin,Labour,ripening,induced_augmented,delivery,indication_ovd,indication_caesarean,Stage,B1Gender,B1Weight,B2Gender,B2Weight,apgar1,apgar5,outcome,indication,final_outcome,indication_for_induction,b1_date_of_birth,b1_time_of_birth,b2_date_of_birth,b2_time_of_birth,group_name,created_by,created_on,review FROM robsonsdata WHERE patient_id = ?";

  con.query(sql, [patient_id], (err, results) => {
    if (err) {
      console.error("Error retrieving patient details:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Patient not found" });
      } else {
        res.json(results[0]); // Send the first row (assuming patient_id is unique)
      }
    }
  });
});

app.delete("/api/patients/:id", (req, res) => {
  const patientId = req.params.id;

  // Query the database to delete the patient by ID from the robsonsdata table
  con.query(
    "DELETE FROM robsonsdata WHERE patient_id = ?",
    [patientId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      // Check if any rows were affected (patient was found and deleted)
      if (results.affectedRows === 1) {
        // Patient deleted successfully
        res.status(200).json({ message: "Patient deleted successfully" });
      } else {
        // Patient not found (no rows were affected)
        res.status(404).json({ error: "Patient not found" });
      }
    }
  );
});

app.post("/submit-form", (req, res) => {
  let data = req.body;
  let actualPreviousCesarean = req.body.previous_cesarean;

  data.previous_cesarean =
    Number(data.previous_cesarean) > 0 ? "true" : "false";

  let pog;
  if (data.weeks < 36) {
    pog = "<36";
  } else {
    pog = ">36";
  }
  let group;

  if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 1";
  } else if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Pre Labour" || data.labour === "Induction of Labor") &&
    pog === ">36"
  ) {
    group = "Group 2";
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 3";
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Induction of Labor" || data.labour === "Pre Labour") &&
    pog === ">36"
  ) {
    group = "Group 4";
  } else if (
    data.previous_cesarean === "true" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === ">36"
  ) {
    group = "Group 5";
  } else if (
    data.obs_index === "Primi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 6";
  } else if (
    data.obs_index === "Multi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 7";
  } else if (data.fetus_type === "Twins") {
    group = "Group 8";
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Transverse"
  ) {
    group = "Group 9";
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === "<36"
  ) {
    group = "Group 10";
  } else {
    let err = true;
    console.error("Error in group logics");
    res.status(400).send({ message: "Group Logic Error" });
    return;
  }

  const sql = `
    INSERT INTO robsonsdata (
		patient_id,
		obs_index,
		weeks,
		pog,
		previous_cesarean,
		fetus_type,
		presentation_single,
		presentation_twin,
		Labour,
		ripening,
		induced_augmented,
		delivery,
		indication_ovd,
		indication_caesarean,
		Stage,
		B1Gender,
		B1Weight,
		B2Gender,
		B2Weight,
		apgar1,
		apgar5,
		outcome,
		indication,
		final_outcome,
		indication_for_induction,
		b1_date_of_birth,
		b1_time_of_birth,
		b2_date_of_birth,
		b2_time_of_birth,
		group_name,
		created_by,
		created_on,
		review,
		department
		) VALUES (
		${data.patient_id ? `"${data.patient_id}"` : null},
		${data.obs_index ? `"${data.obs_index}"` : null},
		${data.weeks ? `"${data.weeks}"` : null},
		${pog ? `"${pog}"` : null},
		${actualPreviousCesarean ? `"${actualPreviousCesarean}"` : null},
		${data.fetus_type ? `"${data.fetus_type}"` : null},
		${data.presentation_single ? `"${data.presentation_single}"` : null},
		${data.presentation_twin ? `"${data.presentation_twin}"` : null},
		${data.labour ? `"${data.labour}"` : null},
		${data.ripening ? `"${data.ripening}"` : null},
		${data.induced_augmented ? `"${data.induced_augmented}"` : null},
		${data.delivery ? `"${data.delivery}"` : null},
		${data.indication_ovd ? `"${data.indication_ovd}"` : null},
		${data.indication_cesarean ? `"${data.indication_cesarean}"` : null},
		${data.stage ? `"${data.stage}"` : null},
		${data.b1_gender ? `"${data.b1_gender}"` : null},
		${data.b1_weight ? `"${data.b1_weight} kg"` : null},
		${data.b2_gender ? `"${data.b2_gender}"` : null},
		${data.b2_weight ? `"${data.b2_weight} kg"` : null},
		${data.apgar1 ? `"${data.apgar1}"` : null},
		${data.apgar5 ? `"${data.apgar5}"` : null},
		${data.outcome ? `"${data.outcome}"` : null},
		${data.indication ? `"${data.indication}"` : null},
		${data.final_outcome ? `"${data.final_outcome}"` : null},
		${data.indication_for_induction ? `"${data.indication_for_induction}"` : null},
		${data.b1_date_of_birth ? `"${data.b1_date_of_birth}"` : null},
		${data.b1_time_of_birth ? `"${data.b1_time_of_birth}"` : null},
		${data.b2_date_of_birth ? `"${data.b2_date_of_birth}"` : null},
		${data.b2_time_of_birth ? `"${data.b2_time_of_birth}"` : null},
		${group ? `"${group}"` : null},
		${data.created_by ? `"${data.created_by}"` : null},
		NOW(),
		${data.review ? `"${data.review}"` : null},
		${department ? `"${department}"` : null}
		);`;

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error while inserting data: ", err);
      res.status(400).send({ message: "Error while inserting data" });
      return;
    }
    let robsonsId = data.patient_id;

    const groupQuery = `INSERT INTO \`groups\` (group_name, created_by, created_on, patient_id) VALUES ("${group}", "${data.created_by}", NOW(), "${robsonsId}")`;
    con.query(groupQuery, (err, result) => {
      if (err) {
        console.log("Error while inserting data INTO GROUPS: ", err);
        res
          .status(400)
          .send({ message: "Error while inserting data in groups" });
        return;
      }
    });
    let responseData = {
      message: "Data inserted successfully",
      group: group,
      formId: robsonsId,
    };
    res.status(200).send(responseData);
  });
});

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

app.post("/auth-login", (req, res) => {
  const { username, password } = req.body;

  // query the database to get the user with the matching username and password
  con.query(
    `SELECT * FROM loginauth WHERE user_name='${username}' AND password='${password}'`,
    (error, results, fields) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (results.length === 0) {
        // if no matching user found, return an error message
        res.status(401).send("Invalid credentials");
        return;
      }

      // if a matching user is found, extract the role from the database and send it back as a response
      const role = results[0].role;
      department = results[0].department;
      console.log(department);
      res.send(role);
    }
  );
});

// function for generating report
app.get("/api/generate-report", (req, res) => {

  let { startDate, endDate } = req.query;
  startDate = moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
 console.log(department);
  con.query(
    `SELECT * FROM robsonsdata WHERE created_on BETWEEN '${startDate}' AND '${endDate}' AND department = '${department}'`,
    (error, robsonsDataList) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (_.isEmpty(robsonsDataList)) {
        res.status(400).send({ message: "No data Available" });
        return;
      }

      let santizedRobsonsDataList = [];
      _.forEach(robsonsDataList, (thisRobsonData) => {
        let tmpObject = {
          patient_id: !_.isEmpty(thisRobsonData.patient_id)
            ? thisRobsonData.patient_id
            : "",
          obs_index: !_.isEmpty(thisRobsonData.obs_index)
            ? thisRobsonData.obs_index
            : "",
          weeks: !_.isEmpty(thisRobsonData.weeks) ? thisRobsonData.weeks : "",
          pog: !_.isEmpty(thisRobsonData.pog) ? thisRobsonData.pog : "",

          previous_cesarean: !_.isEmpty(thisRobsonData.previous_cesarean)
            ? thisRobsonData.previous_cesarean
            : "",
          fetus_type: !_.isEmpty(thisRobsonData.fetus_type)
            ? thisRobsonData.fetus_type
            : "",
          presentation_single: !_.isEmpty(thisRobsonData.presentation_single)
            ? thisRobsonData.presentation_single
            : "",
          presentation_twin: !_.isEmpty(thisRobsonData.presentation_twin)
            ? thisRobsonData.presentation_twin
            : "",
          Labour: !_.isEmpty(thisRobsonData.Labour)
            ? thisRobsonData.Labour
            : "",
          delivery: !_.isEmpty(thisRobsonData.delivery)
            ? thisRobsonData.delivery
            : "",

          Stage: !_.isEmpty(thisRobsonData.Stage) ? thisRobsonData.Stage : "",
          B1Gender: !_.isEmpty(thisRobsonData.B1Gender)
            ? thisRobsonData.B1Gender
            : "",
          b1_date_of_birth: moment(thisRobsonData.b1_date_of_birth).format(
            "ddd D MMM YYYY"
          ),
          b1_time_of_birth: !_.isEmpty(thisRobsonData.b1_time_of_birth)
            ? thisRobsonData.b1_time_of_birth
            : "",
          B1Weight: !_.isEmpty(thisRobsonData.B1Weight)
            ? thisRobsonData.B1Weight
            : "",
          B2Gender: !_.isEmpty(thisRobsonData.B2Gender)
            ? thisRobsonData.B2Gender
            : "",
          b2_date_of_birth: !_.isEmpty(thisRobsonData.b2_date_of_birth)
            ? moment(thisRobsonData.b2_date_of_birth).format("ddd D MMM YYYY")
            : "",
          b2_time_of_birth: !_.isEmpty(thisRobsonData.b2_time_of_birth)
            ? thisRobsonData.b2_time_of_birth
            : "",
          B2Weight: !_.isEmpty(thisRobsonData.B2Weight)
            ? thisRobsonData.B2Weight
            : "",
          apgar1: !_.isEmpty(thisRobsonData.apgar1)
            ? thisRobsonData.apgar1
            : "",
          apgar5: !_.isEmpty(thisRobsonData.apgar5)
            ? thisRobsonData.apgar5
            : "",
          outcome: !_.isEmpty(thisRobsonData.outcome)
            ? thisRobsonData.outcome
            : "",
          indication_ovd: !_.isEmpty(thisRobsonData.indication_ovd)
            ? thisRobsonData.indication_ovd
            : "",
          indication_caesarean: !_.isEmpty(thisRobsonData.indication_caesarean)
            ? thisRobsonData.indication_caesarean
            : "",
          indication: !_.isEmpty(thisRobsonData.indication)
            ? thisRobsonData.indication
            : "",
          final_outcome: !_.isEmpty(thisRobsonData.final_outcome)
            ? thisRobsonData.final_outcome
            : "",
          indication_for_induction: !_.isEmpty(
            thisRobsonData.indication_for_induction
          )
            ? thisRobsonData.indication_for_induction
            : "",
          ripening: !_.isEmpty(thisRobsonData.ripening)
            ? thisRobsonData.ripening
            : "",
          induced_augmented: !_.isEmpty(thisRobsonData.induced_augmented)
            ? thisRobsonData.induced_augmented
            : "",
          group_name: !_.isEmpty(thisRobsonData.group_name)
            ? thisRobsonData.group_name
            : "",
          review: !_.isEmpty(thisRobsonData.review)
            ? thisRobsonData.review
            : "",
          created_by: !_.isEmpty(thisRobsonData.created_by)
            ? thisRobsonData.created_by
            : "",
          created_on: moment(thisRobsonData.created_on).format(
            "ddd D MMM YYYY"
          ),
        };
        santizedRobsonsDataList.push(tmpObject);
      });

      let fieldNames = [
        "Patient ID",
        "Obs Index",
        "Weeks",
        "POG",
        "Previous Cesarean",
        "Fetus Type",
        "Presentation Single",
        "Presentation Twin",
        "Labour Type",
        "Delivery",
        "Stage",
        "Baby 1 Gender",
        "Baby 1 Date of Birth",
        "Baby 1 Time of Birth",
        "Baby 1 Weight",
        "Baby 2 Gender",
        "Baby 2 Date of Birth",
        "Baby 2 Time of Birth",
        "Baby 2 Weight",
        "APGAR1",
        "APGAR5",
        "Outcome",
        "Indication OVD",
        "Indication Caesarean",
        "Indication",
        "Final Outcome",
        "Indication for Indication",
        "Ripening",
        "Induced Augmented",
        "Group",
        "Review",
        "Created By",
        "Created On",
      ];
      let fields = [
        "patient_id",
        "obs_index",
        "weeks",
        "pog",
        "previous_cesarean",
        "fetus_type",
        "presentation_single",
        "presentation_twin",
        "Labour",
        "delivery",
        "Stage",
        "B1Gender",
        "b1_date_of_birth",
        "b1_time_of_birth",
        "B1Weight",
        "B2Gender",
        "b2_date_of_birth",
        "b2_time_of_birth",
        "B2Weight",
        "apgar1",
        "apgar5",
        "outcome",
        "indication_ovd",
        "indication_caesarean",
        "indication",
        "final_outcome",
        "indication_for_induction",
        "ripening",
        "induced_augmented",
        "group_name",
        "review",
        "created_by",
        "created_on",
      ];
      let groupSpecification = {};
      _.forEach(fields, function (item, index) {
        groupSpecification[item] = {
          // <- the key should match the actual data key
          displayName: fieldNames[index], // <- Here you specify the column header
          headerStyle: styles.headerDark, // <- Header style
          cellStyle: styles.cellStyle, // <- Cell style
          width: 120, // <- width in pixels
          cellFormat: function (value, row) {
            // <- Renderer function, you can access also any row.property
           
            return value === null ? "NA" : value;
          },
        };
      });

      let projectDetailsHeading = [
        [{ value: "Robsons Data Report", style: styles.cellGray }],
      ];
      let sheets = [];
      sheets.push({
        name: "Robsons Data Report", // <- Specify sheet name (optional)
        heading: projectDetailsHeading, // <- Raw heading array (optional)
        specification: groupSpecification, // <- group specification
        data: santizedRobsonsDataList, // <-- Report data
      });
      let finalReport = excel.buildExport(sheets);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      return res.end(finalReport, "binary");
    }
  );
});

//Generate Report for Specific data

app.get("/api/generate-report-one", (req, res) => {
  let { startDate, endDate } = req.query;
  startDate = moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
  endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");

  con.query(
    `SELECT 
		patient_id,
		obs_index,
		weeks,
		pog,
		previous_cesarean,
		fetus_type,
		presentation_single,
		presentation_twin,
		Labour,
		B1Gender,
		b1_date_of_birth,
		b1_time_of_birth,
		B1Weight,
		B2Gender,
		b2_date_of_birth,
		b2_time_of_birth,
		B2Weight
	  FROM robsonsdata WHERE created_on BETWEEN '${startDate}' AND '${endDate}' AND department = '${department}' `,
    (error, robsonsDataList) => {
      if (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
        return;
      }

      if (_.isEmpty(robsonsDataList)) {
        res.status(400).send({ message: "No data Available" });
        return;
      }

      let santizedRobsonsDataList = [];
      _.forEach(robsonsDataList, (thisRobsonData) => {
        let tmpObject = {
          patient_id: !_.isEmpty(thisRobsonData.patient_id)
            ? thisRobsonData.patient_id
            : "",
          obs_index: !_.isEmpty(thisRobsonData.obs_index)
            ? thisRobsonData.obs_index
            : "",
          weeks: !_.isEmpty(thisRobsonData.weeks) ? thisRobsonData.weeks : "",
          pog: !_.isEmpty(thisRobsonData.pog) ? thisRobsonData.pog : "",

          previous_cesarean: !_.isEmpty(thisRobsonData.previous_cesarean)
            ? thisRobsonData.previous_cesarean
            : "",
          fetus_type: !_.isEmpty(thisRobsonData.fetus_type)
            ? thisRobsonData.fetus_type
            : "",
          presentation_single: !_.isEmpty(thisRobsonData.presentation_single)
            ? thisRobsonData.presentation_single
            : "",
          presentation_twin: !_.isEmpty(thisRobsonData.presentation_twin)
            ? thisRobsonData.presentation_twin
            : "",
          Labour: !_.isEmpty(thisRobsonData.Labour)
            ? thisRobsonData.Labour
            : "",
          B1Gender: !_.isEmpty(thisRobsonData.B1Gender)
            ? thisRobsonData.B1Gender
            : "",
          b1_date_of_birth: moment(thisRobsonData.b1_date_of_birth).format(
            "ddd D MMM YYYY"
          ),
          b1_time_of_birth: !_.isEmpty(thisRobsonData.b1_time_of_birth)
            ? thisRobsonData.b1_time_of_birth
            : "",
          B1Weight: !_.isEmpty(thisRobsonData.B1Weight)
            ? thisRobsonData.B1Weight
            : "",
          B2Gender: !_.isEmpty(thisRobsonData.B2Gender)
            ? thisRobsonData.B2Gender
            : "",
          b2_date_of_birth: moment(thisRobsonData.b2_date_of_birth).format(
            "ddd D MMM YYYY"
          )
            ? thisRobsonData.b2_date_of_birth
            : "",
          b2_time_of_birth: !_.isEmpty(thisRobsonData.b2_time_of_birth)
            ? thisRobsonData.b2_time_of_birth
            : "",
          B2Weight: !_.isEmpty(thisRobsonData.B2Weight)
            ? thisRobsonData.B2Weight
            : "",
        };
        santizedRobsonsDataList.push(tmpObject);
      });

      let fieldNames = [
        "Patient ID",
        "Obs Index",
        "Weeks",
        "POG",
        "Previous Cesarean",
        "Fetus Type",
        "Presentation Single",
        "Presentation Twin",
        "Labour Type",
        "Baby 1 Gender",
        "Baby 1 Date of Birth",
        "Baby 1 Time of Birth",
        "Baby 1 Weight",
        "Baby 2 Gender",
        "Baby 2 Date of Birth",
        "Baby 2 Time of Birth",
        "Baby 2 Weight",
      ];
      let fields = [
        "patient_id",
        "obs_index",
        "weeks",
        "pog",
        "previous_cesarean",
        "fetus_type",
        "presentation_single",
        "presentation_twin",
        "Labour",
        "B1Gender",
        "b1_date_of_birth",
        "b1_time_of_birth",
        "B1Weight",
        "B2Gender",
        "b2_date_of_birth",
        "b2_time_of_birth",
        "B2Weight",
      ];
      let groupSpecification = {};
      _.forEach(fields, function (item, index) {
        groupSpecification[item] = {
          displayName: fieldNames[index],
          headerStyle: styles.headerDark,
          cellStyle: styles.cellStyle,
          width: 120,
          cellFormat: function (value, row) {
            return value === undefined ? "NA" : value;
          },
        };
      });

      let projectDetailsHeading = [
        [{ value: "Robsons Data Report", style: styles.cellGray }],
      ];
      let sheets = [];
      sheets.push({
        name: "Robsons Data Report",
        heading: projectDetailsHeading,
        specification: groupSpecification,
        data: santizedRobsonsDataList,
      });
      let finalReport = excel.buildExport(sheets);
      res.setHeader("Content-Type", "application/vnd.openxmlformats");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=robsons_report.xlsx"
      );
      return res.end(finalReport, "binary");
    }
  );
});

// function to calculate Relative Group Size For Each Group
const calculateRelativeGroupSize = async (groupsList, count_total) => {
  let relativeGroupSize = [];
  _.forEach(totalGroupList, (thisGroup) => {
    let count = _.filter(groupsList, { group_name: thisGroup }).length;
    let percentage = (count / count_total) * 100;
    relativeGroupSize.push({
      group_name: thisGroup,
      count: count,
      relativeGroupSize: percentage.toFixed(2),
    });
  });

  return relativeGroupSize;
};

// function to calculate CS rate for Each group
const calculateCSRateForEachGroup = async (
  groupsList,

  res,
  relativeGroupSize
) => {
  try {
    return new Promise((resolve, reject) => {
      let csRateForEachGroup = [];
      let currentCalculation = _.cloneDeep(relativeGroupSize);
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE group_name = '${thisGroup}' AND delivery='Cesarean'`;
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error);
            reject({
              message: "Internal Server Error calculateCSRateForEachGroup",
              status: 500,
            });
            return;
          }
          let thisGroupCsCount = await result[0]["COUNT"];
          let thisGroupCount = currentCalculation[index].count;
          let CsRate =
            thisGroupCsCount && thisGroupCount
              ? (thisGroupCsCount / thisGroupCount) * 100
              : 0;
          let d = (currentCalculation[index].csRate = CsRate);
          let c = (currentCalculation[index].groupCsCount = thisGroupCsCount);
          csRateForEachGroup.push({
            group_name: thisGroup,
            count: c,
            csRateForEachGroup: d.toFixed(2),
          });

          if (csRateForEachGroup.length === totalGroupList.length) {
            resolve(csRateForEachGroup);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    throw {
      message: "Internal Server Error calculateCSRateForEachGroup",
      status: 500,
    };
  }
};

// function to calculate Relative CS rate for Each group
const calculateRelativeCsRate = async (groupsList, res, CS_total) => {
  try {
    return new Promise((resolve, reject) => {
      let RelativecsRate = [];
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE delivery='Cesarean' AND group_name = '${thisGroup}'`;
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error);
            res.status(500).send({
              message: "Internal Server Error calculateRelativeCsRate",
            });
            return;
          }
          let thisGroupCsCount = await result[0]["COUNT"];

          let thisGroupCount = CS_total;

          let CsRate =
            thisGroupCsCount && thisGroupCount
              ? (thisGroupCsCount / thisGroupCount) * 100
              : 0;

          let d = CsRate;

          RelativecsRate.push({
            group_name: thisGroup,
            RelativecsRate: d.toFixed(2),
          });

          if (RelativecsRate.length === totalGroupList.length) {
            resolve(RelativecsRate);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error calculateCSRateForEachGroup" });
    return;
  }
};

// function to calculate CS rate for Each group
const calculateAbsoluteCSRate = async (
  groupsList,

  res,
  count_total
) => {
  try {
    return new Promise((resolve, reject) => {
      let AbsolutecsRate = [];
      //let currentCalculation = _.cloneDeep(relativeGroupSize);
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE group_name = '${thisGroup}' AND delivery='Cesarean'`;
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error);
            reject({
              message: "Internal Server Error calculateCSRateForEachGroup",
              status: 500,
            });
            return;
          }
          let thisGroupCsCount = await result[0]["COUNT"];

          let AbsoluteCsRate =
            thisGroupCsCount && count_total
              ? (thisGroupCsCount / count_total) * 100
              : 0;

          AbsolutecsRate.push({
            group_name: thisGroup,
            AbsolutecsRate: AbsoluteCsRate.toFixed(2),
          });

          if (AbsolutecsRate.length === totalGroupList.length) {
            resolve(AbsolutecsRate);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    throw {
      message: "Internal Server Error calculateCSRateForEachGroup",
      status: 500,
    };
  }
};
// function to calculate precentage of CSrate-Line chart
const calculateCsRate = async (res) => {
  try {
    return new Promise((resolve, reject) => {
      let csRate1 = [];

      let robsonsQuery = `SELECT * FROM robsonsdata WHERE delivery='Cesarean';
								SELECT * FROM robsonsdata`;
      con.query(robsonsQuery, async (error, result, fields) => {
        if (error) {
          console.error(error);
          res
            .status(500)
            .send({ message: "Internal Server Error calculateRelativeCsRate" });
          return;
        }

        if (error) {
          console.error("Error executing totalcount:", error);
          res.status(500).send({
            message: "Internal Server Error calculateRelativeCsRate",
          });
          return;
        }
        let totalCsCount = result[0].length;
        let totalcount = result[1].length;

        let CsRate =
          totalCsCount && totalcount ? (totalCsCount / totalcount) * 100 : 0;
        //console.log(CsRate);
        csRate1.push({
          csRate1: CsRate,
        });

        //if (RelativecsRate.length === totalGroupList.length) {
        resolve(csRate1);
        //	}
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error calculateCSRateForEachGroup" });
    return;
  }
};
// function to calculate count of BarChart
const calculateBarChart = async (groupsList1, count_total) => {
  let BarChart = [];
  _.forEach(totalGroupList, (thisGroup) => {
    let count = _.filter(groupsList1, { group_name: thisGroup }).length;
    let percentage = (count / count_total) * 100;
    BarChart.push({
      group_name: thisGroup,
      count: count,
      BarChart: percentage,
    });
  });

  return BarChart;
};

//Generate Status of Cesarean Delivery
app.get("/api/generate-status-init", async (req, res) => {
  try {
    let statusData = {};

    const query = `
		SELECT * FROM \`groups\`;
		SELECT * FROM robsonsdata WHERE delivery="Cesarean";
	  `;
    con.query(query, async (error, result) => {
      if (error) {
        console.error(error);
        res
          .status(500)
          .send({ message: "Internal Server Error generate-status-init" });
        return;
      }
      let groupsList = result[0];
      let CS_total = result[1].length;

      if (_.isEmpty(groupsList)) {
        res.status(400).send({ message: "No data Available" });
        return;
      }
      let count_total = groupsList.length;

      let relativeGroupSize = await calculateRelativeGroupSize(
        groupsList,
        count_total
      );

      const relativeGroupSizeData = relativeGroupSize.map((obj) =>
        _.omit(obj, "count")
      );

      let csRateForEachGroup = await calculateCSRateForEachGroup(
        groupsList,
        //dateRangeOptions,
        res,
        relativeGroupSize
      );

      const csRateData = csRateForEachGroup.map((obj) => _.omit(obj, "count"));

      let absoluteCsRateData = await calculateAbsoluteCSRate(
        groupsList,

        res,
        count_total
      );

      let relativeCsRateData = await calculateRelativeCsRate(
        groupsList,
        res,
        CS_total
      );

      const mergedData = relativeGroupSizeData.map((relativeGroupSizeItem) => {
        const csRateItem = csRateData.find(
          (csRateItem) =>
            csRateItem.group_name === relativeGroupSizeItem.group_name
        );
        const relativeCsRateItem = relativeCsRateData.find(
          (relativeCsRateItem) =>
            relativeCsRateItem.group_name === relativeGroupSizeItem.group_name
        );
        const absoluteCsRateItem = absoluteCsRateData.find(
          (absoluteCsRateItem) =>
            absoluteCsRateItem.group_name === relativeGroupSizeItem.group_name
        );
        return {
          ...relativeGroupSizeItem,
          ...csRateItem,
          ...relativeCsRateItem,
          ...absoluteCsRateItem,
        };
      });

      let columns = Object.keys(mergedData[0]).map((key) => ({
        Header: key,
        accessor: key,
      }));
      statusData["columns"] = columns;
      statusData["data"] = mergedData;

      res.status(200).send(statusData);
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error generate-status-init" });
    return;
  }
});

const calculateCesareanDel = async (CesareanDel, count_CSDel) => {
  try {
    return new Promise((resolve, reject) => {
      let CesareanDelivery = [];
      //let currentCalculation = _.cloneDeep(relativeGroupSize);
      _.forEach(totalMonthList, async (month, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE MONTHNAME(created_on) = '${month}' AND delivery='Cesarean'`;
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error);
            reject({
              message: "Internal Server Error calculateCSRateForEachGroup",
              status: 500,
            });
            return;
          }
          let thisMonthCsCount = await result[0]["COUNT"];

          CesareanDelivery.push({
            month_name: month,
            csCount: thisMonthCsCount,
          });

          if (CesareanDelivery.length === totalMonthList.length) {
            resolve(CesareanDelivery);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    throw {
      message: "Internal Server Error calculateCesareanDelivery",
      status: 500,
    };
  }
};
const calculateTotalDel = async (totalDel, count_totalDel) => {
  try {
    return new Promise((resolve, reject) => {
      let TotalDelivery = [];

      _.forEach(totalMonthList, async (month, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE MONTHNAME(created_on) = '${month}'`;
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error);
            reject({
              message: "Internal Server Error calculateTotalDelivery",
              status: 500,
            });
            return;
          }
          let thisMonthCsCount = await result[0]["COUNT"];

          TotalDelivery.push({
            month_name: month,
            totalCount: thisMonthCsCount,
          });

          if (TotalDelivery.length === totalMonthList.length) {
            resolve(TotalDelivery);
          }
        });
      });
    });
  } catch (error) {
    console.error(error);
    throw {
      message: "Internal Server Error calculateTotalDelivery",
      status: 500,
    };
  }
};
app.get("/api/dashboard", async (req, res) => {
  try {
    //let statusData = {};
    const groupsQuery = `
		SELECT * FROM robsonsdata WHERE delivery='Cesarean';
		SELECT * FROM robsonsdata ;
		SELECT DISTINCT * FROM \`groups\` WHERE MONTH(created_on) BETWEEN 1 AND 3;
		SELECT * FROM \`groups\` WHERE MONTH(created_on) BETWEEN 4 AND 8;
		SELECT * FROM \`groups\` WHERE MONTH(created_on) BETWEEN 9 AND 12;
	`;

    con.query(groupsQuery, async (error, result) => {
      if (error) {
        console.error(error);

        res.status(500).send({ message: "Internal Server Error line chart" });
        return;
      }
      // Total Delivery and Cesarean Delivery
      let CesareanDel = result[0];
      let totalDel = result[1];

      let count_CSDel = CesareanDel.length;
      let count_totalDel = totalDel.length;

      // Three month Cesarean Delivery
      let groupsList1 = result[2];
      let groupsList2 = result[3];
      let groupsList3 = result[4];

      let count_total1 = groupsList1.length;
      let count_total2 = groupsList2.length;
      let count_total3 = groupsList3.length;

      if (
        _.isEmpty(CesareanDel, totalDel, groupsList1, groupsList2, groupsList3)
      ) {
        res.status(400).send({ message: "No data Available" });
        return;
      }
      // Total Delivery and Cesarean Delivery
      let CesareanDelivery = await calculateCesareanDel(
        CesareanDel,
        count_CSDel
      );

      let TotalDelivery = await calculateTotalDel(totalDel, count_totalDel);

      // Three month Cesarean Delivery
      let relativeGroupSize1 = await calculateBarChart(
        groupsList1,
        count_total1
      );
      let relativeGroupSize2 = await calculateBarChart(
        groupsList2,
        count_total2
      );
      let relativeGroupSize3 = await calculateBarChart(
        groupsList3,
        count_total3
      );
      console.log(relativeGroupSize3);
      var relativeGroupSizeData1 = relativeGroupSize1.map((obj) =>
        _.omit(obj, "BarChart")
      );
      var relativeGroupSizeData2 = relativeGroupSize2.map((obj) =>
        _.omit(obj, "BarChart")
      );
      var relativeGroupSizeData3 = relativeGroupSize3.map((obj) =>
        _.omit(obj, "BarChart")
      );

      const combinedData = {
        data1: CesareanDelivery,
        data2: TotalDelivery,
        data3: relativeGroupSizeData1,
        data4: relativeGroupSizeData2,
        data5: relativeGroupSizeData3,
      };
      //	console.log(combinedData);
      res.status(200).send(combinedData);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error Dashboard" });
    return;
  }
});
app.get("/api/line-chart", async (req, res) => {
  try {
    //let statusData = {};
    const groupsQuery = `
		SELECT * FROM robsonsdata WHERE delivery='Cesarean';
		SELECT * FROM robsonsdata ;
	`;

    con.query(groupsQuery, async (error, result) => {
      if (error) {
        console.error(error);

        res.status(500).send({ message: "Internal Server Error line chart" });
        return;
      }

      let CesareanDel = result[0];
      let totalDel = result[1];

      let count_CSDel = CesareanDel.length;
      let count_totalDel = totalDel.length;

      if (_.isEmpty(CesareanDel, totalDel)) {
        res.status(400).send({ message: "No data Available" });
        return;
      }

      let CesareanDelivery = await calculateCesareanDel(
        CesareanDel,
        count_CSDel
      );

      let TotalDelivery = await calculateTotalDel(totalDel, count_totalDel);

      const combinedData = {
        data1: CesareanDelivery,
        data2: TotalDelivery,
      };

      res.status(200).send(combinedData);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error line chart" });
    return;
  }
});
app.get("/api/barchart", async (req, res) => {
  try {
    //let statusData = {};
    const groupsQuery = `
		SELECT DISTINCT * FROM  groups WHERE MONTH(created_on) BETWEEN 1 AND 3;
		SELECT * FROM \`groups\`WHERE MONTH(created_on) BETWEEN 4 AND 8;
		SELECT * FROM \`groups\`WHERE MONTH(created_on) BETWEEN 9 AND 12;
	`;

    con.query(groupsQuery, async (error, result) => {
      if (error) {
        console.error(error);

        res
          .status(500)
          .send({ message: "Internal Server Error generate-status-init" });
        return;
      }

      let groupsList1 = result[0];
      let groupsList2 = result[1];
      let groupsList3 = result[2];

      if (_.isEmpty(groupsList1, groupsList2, groupsList3)) {
        res.status(400).send({ message: "No data Available" });
        return;
      }
      let count_total1 = groupsList1.length;
      let count_total2 = groupsList2.length;
      let count_total3 = groupsList3.length;

      let relativeGroupSize1 = await calculateBarChart(
        groupsList1,
        count_total1
      );
      let relativeGroupSize2 = await calculateBarChart(
        groupsList2,
        count_total2
      );
      let relativeGroupSize3 = await calculateBarChart(
        groupsList3,
        count_total3
      );

      var relativeGroupSizeData1 = relativeGroupSize1.map((obj) =>
        _.omit(obj, "BarChart")
      );
      var relativeGroupSizeData2 = relativeGroupSize2.map((obj) =>
        _.omit(obj, "BarChart")
      );
      var relativeGroupSizeData3 = relativeGroupSize3.map((obj) =>
        _.omit(obj, "BarChart")
      );

      let CSrate = await calculateCsRate(res);

      const CSrateData = CSrate.map((obj) =>
        _.omit(obj, [
          "group_name",
          "relativeGroupSize",
          "relativeGroupSize",
          "csRateForEachGroup",
          "AbsolutecsRate",
        ])
      );

      res.status(200).send({
        data1: relativeGroupSizeData1,
        data2: relativeGroupSizeData2,
        data3: relativeGroupSizeData3,
      });
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Internal Server Error generate-status-init" });
    return;
  }
});

//Calculate robson data belongs to which group

app.post("/api/upload", upload.single("file"), (req, res) => {
  // Access the uploaded file in req.file.buffer
  const fileBuffer = req.file.buffer;

  // Process the XLSX file using the 'xlsx' library
  const workbook = xlsx.read(fileBuffer, { type: "buffer" });

  // Assuming the XLSX file has a single worksheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Convert worksheet data to JSON
  //const range = xlsx.utils.sheet_to_json(worksheet);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  //Get the range of cells in the sheet
  const range = xlsx.utils.decode_range(sheet["!ref"]);

  // Initialize an array to store column names
  const columnNames = [];

  // Iterate through the first row to get column names
  for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
    const cellAddress = xlsx.utils.encode_cell({ r: range.s.r, c: colIndex });
    const cellValue = sheet[cellAddress] ? sheet[cellAddress].v : undefined;

    // Add the cell value to the columnNames array
    columnNames.push(cellValue);
  }

  // Iterate through rows and start from the second row to skip the header row

  const data = {};

  let santizedRobsonsDataList = [];

  for (let rowIndex = range.s.r + 1; rowIndex <= range.e.r; rowIndex++) {
    // Iterate through columns and populate the rowData object
    for (let colIndex = range.s.c; colIndex <= range.e.c; colIndex++) {
      const cellAddress = xlsx.utils.encode_cell({ r: rowIndex, c: colIndex });
      const cellValue = sheet[cellAddress]
        ? String(sheet[cellAddress].v).toLowerCase()
        : undefined;
      //console.log(cellValue);
      // Use column name from the header row as the object key
      const columnName = columnNames[colIndex - range.s.c];
      const newColumnName = columnName.toLowerCase().replace(/ /g, "_");
      data[newColumnName] = cellValue;
      //console.log(data[columnName] = cellValue);
    }
    data.previous_cesarean =
      Number(data.previous_cesarean) > 0 ? "true" : "false";

    let pog;
    if (data.weeks < 36) {
      pog = "<36";
    } else {
      pog = ">36";
    }
    let group;
    let patient_id;

    if (
      data.obs_index === "primi" &&
      data.previous_cesarean === "false" &&
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      data.labour_type === "spontaneous" &&
      pog === ">36"
    ) {
      group = "Group 1";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.obs_index === "primi" &&
      data.previous_cesarean === "false" &&
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      (data.labour_type === "pre labour" ||
        data.labour === "induction of labor") &&
      pog === ">36"
    ) {
      group = "Group 2";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.obs_index === "multi" &&
      data.previous_cesarean === "false" &&
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      data.labour_type === "spontaneous" &&
      pog === ">36"
    ) {
      group = "Group 3";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.obs_index === "multi" &&
      data.previous_cesarean === "false" &&
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      (data.labour_type === "induction of labor" ||
        data.labour_type === "pre labour") &&
      pog === ">36"
    ) {
      group = "Group 4";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.previous_cesarean === "true" &&
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      pog === ">36"
    ) {
      group = "Group 5";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.obs_index === "primi" &&
      data.fetus_type === "single" &&
      data.presentation_single === "breech"
    ) {
      group = "Group 6";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.obs_index === "multi" &&
      data.fetus_type === "single" &&
      data.presentation_single === "breech"
    ) {
      group = "Group 7";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (data.fetus_type === "twins") {
      group = "Group 8";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.fetus_type === "single" &&
      data.presentation_single === "transverse"
    ) {
      group = "Group 9";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else if (
      data.fetus_type === "single" &&
      data.presentation_single === "cephalic" &&
      pog === "<36"
    ) {
      group = "Group 10";
      patient_id = data.patient_id.toUpperCase();
      console.log(group);
      let datafield = {
        patient_id: patient_id,
        groupName: group,
      };
      santizedRobsonsDataList.push(datafield);
    } else {
      let err = true;
      console.error("Error in group logics");
    }
  }

  let fieldNames = ["Patient ID", "Group Name"];

  let fields = ["patient_id", "groupName"];

  let groupSpecification = {};
  _.forEach(fields, function (item, index) {
    groupSpecification[item] = {
      // <- the key should match the actual data key
      displayName: fieldNames[index], // <- Here you specify the column header
      headerStyle: styles.headerDark, // <- Header style
      cellStyle: styles.cellStyle, // <- Cell style
      width: 120, // <- width in pixels
    };
  });

  let projectDetailsHeading = [
    [{ value: "Excel Data Report", style: styles.cellGray }],
  ];
  let sheets = [];
  sheets.push({
    name: "Excel Data Report", // <- Specify sheet name (optional)
    heading: projectDetailsHeading, // <- Raw heading array (optional)
    specification: groupSpecification, // <- group specification
    data: santizedRobsonsDataList, // <-- Report data
  });
  let finalReport = excel.buildExport(sheets);
  res.setHeader("Content-Type", "application/vnd.openxmlformats");
  return res.end(finalReport, "binary");
});

/**
 * TODO:  Create a different database idea
 */

// Assuming you are using Express.js

app.post("/register", (req, res) => {
  console.log("register");
  const { username, role, password, department } = req.body;

  // Validate the input here if needed

  // Insert the user data into the database
  const sql =
    "INSERT INTO loginauth (user_name, role, password, department) VALUES (?, ?, ?, ?)";
  const values = [username, role, password, department];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error registering user");
    } else {
      console.log("User registered successfully");
      res.status(200).send("User registered successfully");
    }
  });
});

app.listen(3050, () => {
  console.log("Server is running");
});
