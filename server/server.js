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
// const constants = require('./constants/constants.cjs');

const app = express();
const totalGroupList = [
	"group 1",
	"group 2",
	"group 3",
	"group 4",
	"group 5",
	"group 6",
	"group 7",
	"group 8",
	"group 9",
	"group 10",
];
app.use(bodyParser.json());
app.use(cors());
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "robsonclassification",
});

con.connect((err) => {
	if (!err) console.log("connection successful");
	else console.log("connection failed" + JSON.stringify(err));
});

// app.get('/getdata',(req,res)=>{
//     con.query(`SELECT * FROM attendance`,(error,rows,fields)=>{
//         if(!error)
//         res.send(rows);
//         else
//         console.log(error)
//     })
// })

app.get("/api/form-data", (req, res) => {
	res.status(200).send(formData);
});
// Calculate the percentage of match between two objects
function calculatePercentageMatch(obj1, obj2) {
	const values1 = _.values(obj1);
	const values2 = _.values(obj2);
	const matchingValues = _.intersection(values1, values2);
	return (matchingValues.length / values1.length) * 100;
}

// // Find the object with the most percentage of match
// let highestMatch = { percentage: 0 };
// array.forEach(obj => {
//   const percentage = calculatePercentageMatch(object, obj);
//   if (percentage > highestMatch.percentage) {
//     highestMatch = { object: obj, percentage: percentage };
//   }
// });
app.post("/submit-form", (req, res) => {
	let data = req.body;
	let actualPreviousCesarean = req.body.previous_cesarean;
	// we need to change it back to the actual form after condition checked
	data.previous_cesarean = Number(data.previous_cesarean) > 0 ? ">0" : "0";
	let highestMatchedGroup = { percentage: 0 };
	_.forEach(groupLogics, (logics) => {
		_.forEach(logics, (thisGroupLogic) => {
			const percentage = calculatePercentageMatch(
				data,
				thisGroupLogic.conditions
			);
			if (percentage > highestMatchedGroup.percentage) {
				highestMatchedGroup = {
					groupId: thisGroupLogic.id,
					percentage: percentage,
				};
			}
		});
	});

	let group = highestMatchedGroup.groupId;
	const sql = `
    INSERT INTO robosonsdata ( obs_index, weeks, pog, single_twins, previous_cesarean, present, Labour, delivery, indeovp, IndeCS, Stage, BabyDetails, date_of_birth, time_of_birth, weight, apgar, outcome, indication, final_outcome, ripening, group_name, created_by, created_on
    ) VALUES ( "${data.obs_index}", "${data.weeks}", "${data.pog}", "${
		data.single_twins
	}", "${actualPreviousCesarean}", "${data.present}", ${
		data.Labour ? `"${data.Labour}"` : "null"
	}, ${data.delivery ? `"${data.delivery}"` : "null"}, "${data.indeovp}", "${
		data.IndeCS
	}", "${data.Stage}", "${data.BabyDetails}", ${
		data.date_of_birth ? `"${data.date_of_birth}"` : "null"
	}, ${data.time_of_birth ? `"${data.time_of_birth}"` : "null"}, "${
		data.weight
	}", "${data.apgar}", "${data.outcome}", "${data.indication}", "${
		data.final_outcome
	}", ${data.ripening ? `"${data.ripening}"` : "null"}, "${group}", "${
		data.created_by
	}", NOW()
    )
  `;
	con.query(sql, (err, result) => {
		if (err) {
			console.error("Error while inserting data: ", err);
			res.status(400).send({ message: "Error while inserting data" });
			return;
		}
		let robsonsId = result.insertId;
		const groupQuery = `INSERT INTO \`groups\` (group_name, created_by, created_on, dataId) VALUES ("${group}", "${data.created_by}", NOW(), "${robsonsId}")`;
		con.query(groupQuery, (err, result) => {
			if (err) {
				console.error("Error while inserting data INTO GROUPS: ", err);
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
	// console.log(req.body)
	let formId = req.body.formId;
	let indicationForInduction = req.body.indicationForInduction;
	let sql = `UPDATE robosonsdata SET indication_for_induction = '${indicationForInduction}' WHERE id = ${formId}`;
	con.query(sql, (err, result) => {
		if (err) {
			console.error("Error while updating status: ", err);
			res.status(400).send({ message: "Error while updating status" });
			return;
		}

		res.status(200).send({ message: "Status updated successfully" });
	});
});

// function for checking User Authentication and send back role
app.post("/auth-login", (req, res) => {
	// console.log(req.body)
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
			// console.log(role)
			res.send(role);
		}
	);
});

// function for generating report
app.get("/api/generate-report", (req, res) => {
	let { startDate, endDate } = req.query;
	startDate = moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
	endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
	console.log(startDate, endDate);
	con.query(
		`SELECT * FROM robosonsdata WHERE created_on BETWEEN '${startDate}' AND '${endDate}'`,
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
					obs_index: !_.isEmpty(thisRobsonData.obs_index)
						? thisRobsonData.obs_index
						: "",
					weeks: !_.isEmpty(thisRobsonData.weeks) ? thisRobsonData.weeks : "",
					pog: !_.isEmpty(thisRobsonData.pog) ? thisRobsonData.pog : "",
					single_twins: !_.isEmpty(thisRobsonData.single_twins)
						? thisRobsonData.single_twins
						: "",
					previous_cesarean: !_.isEmpty(thisRobsonData.previous_cesarean)
						? thisRobsonData.previous_cesarean
						: "",
					present: !_.isEmpty(thisRobsonData.present)
						? thisRobsonData.present
						: "",
					Labour: !_.isEmpty(thisRobsonData.Labour)
						? thisRobsonData.Labour
						: "",
					delivery: !_.isEmpty(thisRobsonData.delivery)
						? thisRobsonData.delivery
						: "",
					indeovp: !_.isEmpty(thisRobsonData.indeovp)
						? thisRobsonData.indeovp
						: "",
					IndeCS: !_.isEmpty(thisRobsonData.IndeCS)
						? thisRobsonData.IndeCS
						: "",
					Stage: !_.isEmpty(thisRobsonData.Stage) ? thisRobsonData.Stage : "",
					BabyDetails: !_.isEmpty(thisRobsonData.BabyDetails)
						? thisRobsonData.BabyDetails
						: "",
					date_of_birth: moment(thisRobsonData.date_of_birth).format(
						"ddd D MMM YYYY"
					),
					time_of_birth: !_.isEmpty(thisRobsonData.time_of_birth)
						? thisRobsonData.time_of_birth
						: "",
					weight: !_.isEmpty(thisRobsonData.weight)
						? thisRobsonData.weight
						: "",
					apgar: !_.isEmpty(thisRobsonData.apgar) ? thisRobsonData.apgar : "",
					outcome: !_.isEmpty(thisRobsonData.outcome)
						? thisRobsonData.outcome
						: "",
					indication: !_.isEmpty(thisRobsonData.indication)
						? thisRobsonData.indication
						: "",
					final_outcome: !_.isEmpty(thisRobsonData.final_outcome)
						? thisRobsonData.final_outcome
						: "",
					ripening: !_.isEmpty(thisRobsonData.ripening)
						? thisRobsonData.ripening
						: "",
					group_name: !_.isEmpty(thisRobsonData.group_name)
						? thisRobsonData.group_name
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
				"Obs Index",
				"Weeks",
				"POG",
				"Single/Twins",
				"Previous Cesarean",
				"Present",
				"Labour Type",
				"Delivery",
				"IndeOVP",
				"IndeCS",
				"Stage",
				"Baby Details",
				"Date of Birth",
				"Time of Birth",
				"Weight",
				"APGAR",
				"Outcome",
				"Indication",
				"Final Outcome",
				"Ripening",
				"Group",
				"Created By",
				"Created On",
			];
			let fields = [
				"obs_index",
				"weeks",
				"pog",
				"single_twins",
				"previous_cesarean",
				"present",
				"Labour",
				"delivery",
				"indeovp",
				"IndeCS",
				"Stage",
				"BabyDetails",
				"date_of_birth",
				"time_of_birth",
				"weight",
				"apgar",
				"outcome",
				"indication",
				"final_outcome",
				"ripening",
				"group_name",
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
						return value === undefined ? "NA" : value;
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

// function to calculate Relative Group Size For Each Group
const calculateRelativeGroupSize = (groupsList, count_total) => {
	let relativeGroupSize = [];
	_.forEach(totalGroupList, (thisGroup) => {
		let count = _.filter(groupsList, { group_name: thisGroup }).length;
		let percentage = (count / count_total) * 100;
		relativeGroupSize.push({
			group_name: thisGroup,
			count: count,
			relativeGroupSize: percentage,
		});
	});
	return relativeGroupSize;
};

// function to calculate CS rate for Each group
const calculateCSRateForEachGroup = async (
	groupsList,
	dateRangeOptions,
	res,
	relativeGroupSize
) => {
	try {
		let csRateForEachGroup = [];
		let currentCalculation = _.cloneDeep(relativeGroupSize);
		_.forEach(totalGroupList, async (thisGroup, index) => {
			let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE date_of_birth >= '${dateRangeOptions.startDate}' AND date_of_birth <= '${dateRangeOptions.endDate}' AND group_name = '${thisGroup}' AND delivery='CS'`;
			con.query(robsonsQuery, async (error, result, fields) => {
				if (error) {
					console.error(error);
					res.status(500).send({
						message: "Internal Server Error calculateCSRateForEachGroup",
					});
					return;
				}
				let thisGroupCsCount = await result[0]["COUNT"];
				let thisGroupCount = currentCalculation[index].count;
				let CsRate =
					thisGroupCsCount || thisGroupCount
						? (thisGroupCsCount / thisGroupCount) * 100
						: 0;
				currentCalculation[index].csRate = CsRate;
				currentCalculation[index].groupCsCount = thisGroupCsCount;
				csRateForEachGroup.push(currentCalculation[index]);
			});
		});

		return csRateForEachGroup;
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.send({ message: "Internal Server Error calculateCSRateForEachGroup" });
		return;
	}
};

// function to calculate CS rate for Each group
const calculateRelativeCsRate = async (
	groupsList,
	dateRangeOptions,
	res,
	relativeGroupSize
) => {
	try {
		let csRateForEachGroup = [];
		let currentCalculation = _.cloneDeep(relativeGroupSize);
		_.forEach(totalGroupList, async (thisGroup, index) => {
			let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE date_of_birth >= '${dateRangeOptions.startDate}' AND date_of_birth <= '${dateRangeOptions.endDate}' AND group_name = '${thisGroup}' AND delivery='CS'`;
			con.query(robsonsQuery, async (error, result, fields) => {
				if (error) {
					console.error(error);
					res
						.status(500)
						.send({ message: "Internal Server Error calculateRelativeCsRate" });
					return;
				}
				let thisGroupCsCount = await result[0]["COUNT"];
				let thisGroupCount = currentCalculation[index].count;
				let CsRate =
					thisGroupCsCount || thisGroupCount
						? (thisGroupCsCount / thisGroupCount) * 100
						: 0;
				currentCalculation[index].csRate = CsRate;
				currentCalculation[index].groupCsCount = thisGroupCsCount;
				csRateForEachGroup.push(currentCalculation[index]);
			});
		});

		return csRateForEachGroup;
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.send({ message: "Internal Server Error calculateCSRateForEachGroup" });
		return;
	}
};

app.get("/api/generate-status-init", async (req, res) => {
	try {
		let statusData = {};
		let groupsQuery = `SELECT * FROM \`groups\``;
		con.query(groupsQuery, async (error, result) => {
			if (error) {
				console.error(error);
				res
					.status(500)
					.send({ message: "Internal Server Error generate-status-init" });
				return;
			}
			let groupsList = result;
			// console.log(groupsList);
			if (_.isEmpty(groupsList)) {
				res.status(400).send({ message: "No data Available" });
				return;
			}
			let count_total = groupsList.length;
			// Calculate relative Group Size
			let relativeGroupSize = await calculateRelativeGroupSize(
				groupsList,
				count_total
			);
			console.log("284", relativeGroupSize);
			const sanitizedStatus = relativeGroupSize.map((obj) =>
				_.omit(obj, "count")
			);
			console.log(sanitizedStatus);
			let columns = Object.keys(sanitizedStatus[0]).map((key) => ({
				Header: key,
				accessor: key,
			}));
			statusData["columns"] = columns;
			statusData["data"] = sanitizedStatus;
			// Calculate CS rate for Each group
			// let dateRangeOptions = { startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'), endDate: moment().format('YYYY-MM-DD') };
			// let csRateForEachGroup = await calculateCSRateForEachGroup (groupsList, dateRangeOptions, res, relativeGroupSize);
			// console.log("288",csRateForEachGroup)

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

// Assuming you are using Express.js

app.post("/register", (req, res) => {
	console.log("register");
	const { username, role, password } = req.body;

	// Validate the input here if needed

	// Insert the user data into the database
	const sql =
		"INSERT INTO loginauth (user_name, role, password) VALUES (?, ?, ?)";
	const values = [username, role, password];

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
