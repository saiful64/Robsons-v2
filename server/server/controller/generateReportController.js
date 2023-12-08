import _ from "lodash";
import excel from "node-excel-export";
import styles from "../constants/constants.js";
import { con } from '../database/Database.js';
import moment from "moment";


export const generateReport = (req, res) => {
    let { startDate, endDate, department } = req.query;
    startDate = moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
    endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
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
            b1apgar1: !_.isEmpty(thisRobsonData.b1apgar1)
              ? thisRobsonData.b1apgar1
              : "",
            b1apgar5: !_.isEmpty(thisRobsonData.b1apgar5)
              ? thisRobsonData.b1apgar5
              : "",
            b1outcome: !_.isEmpty(thisRobsonData.b1outcome)
              ? thisRobsonData.b1outcome
              : "",
            b2apgar1: !_.isEmpty(thisRobsonData.b2apgar1)
              ? thisRobsonData.b2apgar1
              : "",
            b2apgar5: !_.isEmpty(thisRobsonData.b2apgar5)
              ? thisRobsonData.b2apgar5
              : "",
            b2outcome: !_.isEmpty(thisRobsonData.b2outcome)
              ? thisRobsonData.b2outcome
              : "",
            indication_ovd: !_.isEmpty(thisRobsonData.indication_ovd)
              ? thisRobsonData.indication_ovd
              : "",
            indication_cesarean: !_.isEmpty(thisRobsonData.indication_cesarean)
              ? thisRobsonData.indication_cesarean
              : "",
            indication: !_.isEmpty(thisRobsonData.indication)
              ? thisRobsonData.indication
              : "",
            b1final_outcome: !_.isEmpty(thisRobsonData.b1final_outcome)
              ? thisRobsonData.b1final_outcome
              : "",
            b2final_outcome: !_.isEmpty(thisRobsonData.b2final_outcome)
              ? thisRobsonData.b2final_outcome
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
          "Baby 1 APGAR1",
          "Baby 1 APGAR5",
          "Baby 1 Outcome",
          "Baby 2 APGAR1",
          "Baby 2 APGAR5",
          "Baby 2 Outcome",
          "Indication OVD",
          "Indication Caesarean",
          "Indication",
          "Baby 1 Final Outcome",
          "Baby 2 Final Outcome",
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
          "b1apgar1",
          "b1apgar5",
          "b1outcome",
          "b2apgar1",
          "b2apgar5",
          "b2outcome",
          "indication_ovd",
          "indication_cesarean",
          "indication",
          "b1final_outcome",
          "b2final_outcome",
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
  }

  export const generateReportOne = (req, res) => {
    let { startDate, endDate, department } = req.query;
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
  }

 