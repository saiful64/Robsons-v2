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

//ip address of server machine
const API_BASE_URL = "localhost";

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
	host: `${API_BASE_URL}`,
	user: "root",
	password: "",
	database: "robsonclassification",
	multipleStatements: true,
});

con.connect((err) => {
	if (!err) console.log("connection successful");
	else console.log("connection failed" + JSON.stringify(err));
});

const query11 = util.promisify(con.query).bind(con);
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

app.post("/submit-form", (req, res) => {
	let data = req.body;
	let actualPreviousCesarean = req.body.previous_cesarean;

	data.previous_cesarean =
		Number(data.previous_cesarean) > 0 ? "true" : "false";

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
	let pog;
	if (data.weeks < 36) {
		pog = "<36";
	} else {
		pog = ">36";
	}
	let group = highestMatchedGroup.groupId;

	const sql = `
    INSERT INTO robosonsdata ( obs_index, weeks,pog,previous_cesarean,fetus_type,presentation_single,presentation_twin,Labour,ripening,induced_augmented,delivery,indication_ovd,indication_caesarean,Stage, BabyDetails,weight, apgar,outcome,indication,final_outcome,indication_for_induction,date_of_birth, time_of_birth, group_name, created_by, created_on,review
    ) VALUES ( "${data.obs_index}", "${
		data.weeks
	}", "${pog}","${actualPreviousCesarean}","${data.fetus_type}","${
		data.presentation_single
	}",
	"${data.presentation_twin}",${data.labour ? `"${data.labour}"` : "null"},${
		data.ripening ? `"${data.ripening}"` : "null"
	},"${data.induced_augmented}",${
		data.delivery ? `"${data.delivery}"` : "null"
	},
	"${data.indication_ovd}","${data.indication_cesarean}",
		"${data.stage}", "${data.baby_details}", "${data.weight}","${data.apgar}","${
		data.outcome
	}", "${data.indication}", "${data.final_outcome}","${
		data.indication_for_induction
	}",${data.date_of_birth ? `"${data.date_of_birth}"` : "null"}, ${
		data.time_of_birth ? `"${data.time_of_birth}"` : "null"
	},   "${group}", "${data.created_by}", NOW(),${
		data.review ? `"${data.review}"` : "null"
	}
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
				"Baby Details",
				"Date of Birth",
				"Time of Birth",
				"Weight",
				"APGAR",
				"Outcome",
				"Indication OVD",
				"Indication Caesarean",
				"Indication",
				"Final Outcome",
				"Indication for Indication",
				"Ripening",
				"Group",
				"Review",
				"Created By",
				"Created On",
			];
			let fields = [
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
				"BabyDetails",
				"date_of_birth",
				"time_of_birth",
				"weight",
				"apgar",
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

app.get("/api/generate-report-one", (req, res) => {
	let { startDate, endDate } = req.query;
	startDate = moment(startDate).startOf("day").format("YYYY-MM-DD HH:mm:ss");
	endDate = moment(endDate).endOf("day").format("YYYY-MM-DD HH:mm:ss");
	console.log(startDate, endDate);
	con.query(
		`SELECT 
		obs_index,
		weeks,
		pog,
		previous_cesarean,
		fetus_type,
		presentation_single,
		presentation_twin,
		Labour,
		delivery,
		Stage,
		BabyDetails,
		date_of_birth,
		time_of_birth,
		weight,
		apgar,
		outcome
	  FROM robosonsdata WHERE created_on BETWEEN '${startDate}' AND '${endDate}'`,
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
				};
				santizedRobsonsDataList.push(tmpObject);
			});

			let fieldNames = [
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
				"Baby Details",
				"Date of Birth",
				"Time of Birth",
				"Weight",
				"APGAR",
				"Outcome",
			];
			let fields = [
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
				"BabyDetails",
				"date_of_birth",
				"time_of_birth",
				"weight",
				"apgar",
				"outcome",
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
const calculateRelativeGroupSize = (groupsList, count_total) => {
	let relativeGroupSize = [];
	//console.log(groupsList);
	_.forEach(totalGroupList, (thisGroup) => {
		let count = _.filter(groupsList, { group_name: thisGroup }).length;
		//console.log(groupsList);
		//console.log(count_total);
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
		return new Promise((resolve, reject) => {
			let csRateForEachGroup = [];
			let currentCalculation = _.cloneDeep(relativeGroupSize);
			_.forEach(totalGroupList, async (thisGroup, index) => {
				//let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE date_of_birth >= '${dateRangeOptions.startDate}' AND date_of_birth <= '${dateRangeOptions.endDate}' AND group_name = '${thisGroup}' AND delivery='CS'`;
				let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE group_name = '${thisGroup}' AND delivery='CS'`;
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
					//console.log(thisGroupCsCount);
					let CsRate =
						thisGroupCsCount && thisGroupCount
							? (thisGroupCsCount / thisGroupCount) * 100
							: 0;
					let d = (currentCalculation[index].csRate = CsRate);
					let c = (currentCalculation[index].groupCsCount = thisGroupCsCount);
					csRateForEachGroup.push({
						group_name: thisGroup,
						count: c,
						csRateForEachGroup: d,
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
			//let currentCalculation = _.cloneDeep(relativeGroupSize);
			_.forEach(totalGroupList, async (thisGroup, index) => {
				let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE delivery='CS' AND group_name = '${thisGroup}'`;
				con.query(robsonsQuery, async (error, result, fields) => {
					if (error) {
						console.error(error);
						res
							.status(500)
							.send({
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
						RelativecsRate: d,
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
	dateRangeOptions,
	res,
	count_total
) => {
	try {
		return new Promise((resolve, reject) => {
			let AbsolutecsRate = [];
			//let currentCalculation = _.cloneDeep(relativeGroupSize);
			_.forEach(totalGroupList, async (thisGroup, index) => {
				let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robosonsdata WHERE group_name = '${thisGroup}' AND delivery='CS'`;
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
						//count: c,
						AbsolutecsRate: AbsoluteCsRate,
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
// function to calculate count of BarChart
const calculateBarChart = (groupsList1, count_total) => {
	let BarChart = [];
	//console.log(groupsList);
	_.forEach(totalGroupList, (thisGroup) => {
		let count = _.filter(groupsList1, { group_name: thisGroup }).length;
		//console.log(groupsList);
		//console.log(count);
		let percentage = (count / count_total) * 100;
		BarChart.push({
			group_name: thisGroup,
			count: count,
			BarChart: percentage,
		});
	});

	return BarChart;
};
app.get("/api/generate-status-init", async (req, res) => {
	try {
		const { startDate, endDate } = req.query;
		//console.log(startDate);
		//console.log(endDate);
		let statusData = {};

		const query = `
		SELECT * FROM \`groups\`;
		SELECT * FROM robosonsdata WHERE delivery="CS";
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
			// console.log(groupsList);
			if (_.isEmpty(groupsList)) {
				res.status(400).send({ message: "No data Available" });
				return;
			}
			let count_total = groupsList.length;

			let relativeGroupSize = await calculateRelativeGroupSize(
				groupsList,
				count_total
			);
			//console.log("284", relativeGroupSize);
			const relativeGroupSizeData = relativeGroupSize.map((obj) =>
				_.omit(obj, "count")
			);

			// CSRateforeach group
			//let dateRangeOptions = { startDate: moment().subtract(7, 'days').format('YY-MM-DD'), endDate: moment().format('YY-MM-DD') };
			let dateRangeOptions = {
				startDate: moment(startDate).startOf("day").format("YYYY-MM-DD"),
				endDate: moment(endDate).endOf("day").format("YYYY-MM-DD"),
			};

			let csRateForEachGroup = await calculateCSRateForEachGroup(
				groupsList,
				dateRangeOptions,
				res,
				relativeGroupSize
			);
			// console.log("288",csRateForEachGroup)
			const csRateData = csRateForEachGroup.map((obj) => _.omit(obj, "count"));

			let absoluteCsRateData = await calculateAbsoluteCSRate(
				groupsList,
				dateRangeOptions,
				res,
				count_total
			);

			let relativeCsRateData = await calculateRelativeCsRate(
				groupsList,
				res,
				CS_total
			);

			//console.log(relativeCsRateData);
			//merge  array

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
			// Calculate CS rate for Each group
			// let dateRangeOptions = { startDate: moment().subtract(7, 'days').format('2023-05-02'), endDate: moment().format('2023-05-24') };

			//console.log(statusData);
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

app.get("/api/line-chart", async (req, res) => {
	try {
		const groupsQuery = `
	  SELECT DISTINCT MONTHNAME(created_on) AS xDataKey, COUNT(*) AS yDataKey1
	  FROM robosonsdata
	  WHERE MONTH(created_on) BETWEEN 1 AND 12 AND delivery='CS'
	  GROUP BY MONTH(created_on)
	`;
		const totalCSQuery = `
		SELECT DISTINCT MONTHNAME(created_on) AS xDataKey, COUNT(*) AS yDataKey2
		FROM robosonsdata
		WHERE MONTH(created_on) BETWEEN 1 AND 12
		GROUP BY MONTH(created_on)
	  `;

		const [groupsList, totalCS] = await Promise.all([
			query11(groupsQuery),
			query11(totalCSQuery),
		]);

		if (_.isEmpty(groupsList) || _.isEmpty(totalCS)) {
			res.status(400).send({ message: "No data Available" });
			return;
		}

		const combinedData = {
			data1: groupsList,
			data2: totalCS,
		};

		res.status(200).json(combinedData);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.send({ message: "Internal Server Error generate-status-init" });
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
			//let groupsList = result;
			let groupsList1 = result[0];
			let groupsList2 = result[1];
			let groupsList3 = result[2];
			//console.log('jan',groupsList1);
			//  console.log('apr',groupsList2);
			//  console.log('jul',groupsList3);
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

			// let relativeGroupSize1 = await calculateBarChart(
			// 	groupsList2,
			// 	count_total
			// );
			// console.log("285", relativeGroupSize1);
			var relativeGroupSizeData1 = relativeGroupSize1.map((obj) =>
				_.omit(obj, "BarChart")
			);
			var relativeGroupSizeData2 = relativeGroupSize2.map((obj) =>
				_.omit(obj, "BarChart")
			);
			var relativeGroupSizeData3 = relativeGroupSize3.map((obj) =>
				_.omit(obj, "BarChart")
			);

			console.log("284", relativeGroupSizeData1);
			console.log("285", relativeGroupSizeData2);
			console.log("286", relativeGroupSizeData3);

			// let CSrate = await calculateCsRate(	res)

			// const CSrateData = CSrate.map((obj) =>
			//   _.omit(obj,["group_name","relativeGroupSize","relativeGroupSize","csRateForEachGroup","AbsolutecsRate"])
			// );

			res
				.status(200)
				.send({
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

/**
 * TODO:  Create a different database idea
 */

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
