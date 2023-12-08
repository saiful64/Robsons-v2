
import _ from "lodash";
import { con } from '../database/Database.js';

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

export const dashboard = async (req, res) => {
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
  };


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
  

