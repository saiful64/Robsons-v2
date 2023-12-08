import { con } from "../database/Database.js"
import _ from "lodash"

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
]

export const generateStatus = async (req, res) => {
  try {
    const department = req.query.department
    const startMonth = req.query.startMonth
    const endMonth = req.query.endMonth
    let statusData = {}
    console.log(startMonth)

    const query = `
          SELECT * FROM \`groups\` WHERE MONTH(created_on) BETWEEN ${startMonth} AND ${endMonth} AND department='${department}';
          SELECT * FROM robsonsdata WHERE delivery='Cesarean' AND  MONTH(created_on) BETWEEN ${startMonth} AND ${endMonth} AND department='${department}';
        `
    con.query(query, async (error, result) => {
      if (error) {
        console.error(error)
        res
          .status(500)
          .send({ message: "Internal Server Error generate-status-init" })
        return
      }
      let groupsList = result[0]

      let CS_total = result[1].length
      // console.log(CS_total);
      if (_.isEmpty(groupsList)) {
        res.status(400).send({ message: "No data Available" })
        return
      }
      let count_total = groupsList.length
      console.log(count_total)
      let relativeGroupSize = await calculateRelativeGroupSize(
        groupsList,
        count_total
      )

      const relativeGroupSizeData = relativeGroupSize.map((obj) =>
        _.omit(obj, "count")
      )

      let csRateForEachGroup = await calculateCSRateForEachGroup(
        groupsList,
        //dateRangeOptions,
        res,
        relativeGroupSize,
        department,
        startMonth,
        endMonth
      )

      const csRateData = csRateForEachGroup.map((obj) => _.omit(obj, "count"))

      let absoluteCsRateData = await calculateAbsoluteCSRate(
        groupsList,

        res,
        count_total,
        department,
        startMonth,
        endMonth
      )

      let relativeCsRateData = await calculateRelativeCsRate(
        groupsList,
        res,
        CS_total,
        department,
        startMonth,
        endMonth
      )

      const mergedData = relativeGroupSizeData.map((relativeGroupSizeItem) => {
        const csRateItem = csRateData.find(
          (csRateItem) =>
            csRateItem.group_name === relativeGroupSizeItem.group_name
        )
        const relativeCsRateItem = relativeCsRateData.find(
          (relativeCsRateItem) =>
            relativeCsRateItem.group_name === relativeGroupSizeItem.group_name
        )
        const absoluteCsRateItem = absoluteCsRateData.find(
          (absoluteCsRateItem) =>
            absoluteCsRateItem.group_name === relativeGroupSizeItem.group_name
        )
        return {
          ...relativeGroupSizeItem,
          ...csRateItem,
          ...relativeCsRateItem,
          ...absoluteCsRateItem,
        }
      })

      let columns = Object.keys(mergedData[0]).map((key) => ({
        Header: key,
        accessor: key,
      }))
      statusData["columns"] = columns
      statusData["data"] = mergedData

      res.status(200).send(statusData)
    })
    console.log(statusData)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: "Internal Server Error generate-status-init" })
    return
  }
}

// function to calculate Relative Group Size For Each Group
const calculateRelativeGroupSize = async (groupsList, count_total) => {
  let relativeGroupSize = []
  _.forEach(totalGroupList, (thisGroup) => {
    let count = _.filter(groupsList, { group_name: thisGroup }).length
    let percentage = (count / count_total) * 100
    relativeGroupSize.push({
      group_name: thisGroup,
      count: count,
      relativeGroupSize: percentage.toFixed(2),
    })
  })

  return relativeGroupSize
}

// function to calculate CS rate for Each group
const calculateCSRateForEachGroup = async (
  groupsList,

  res,
  relativeGroupSize,
  department,
  startMonth,
  endMonth
) => {
  try {
    return new Promise((resolve, reject) => {
      let csRateForEachGroup = []
      let currentCalculation = _.cloneDeep(relativeGroupSize)
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE group_name = '${thisGroup}' AND delivery='Cesarean' AND MONTH(created_on) BETWEEN ${startMonth} AND ${endMonth} AND department='${department}'`
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error)
            reject({
              message: "Internal Server Error calculateCSRateForEachGroup",
              status: 500,
            })
            return
          }
          let thisGroupCsCount = await result[0]["COUNT"]
          let thisGroupCount = currentCalculation[index].count
          let CsRate =
            thisGroupCsCount && thisGroupCount
              ? (thisGroupCsCount / thisGroupCount) * 100
              : 0
          let d = (currentCalculation[index].csRate = CsRate)
          let c = (currentCalculation[index].groupCsCount = thisGroupCsCount)
          csRateForEachGroup.push({
            group_name: thisGroup,
            count: c,
            csRateForEachGroup: d.toFixed(2),
          })

          if (csRateForEachGroup.length === totalGroupList.length) {
            resolve(csRateForEachGroup)
          }
        })
      })
    })
  } catch (error) {
    console.error(error)
    throw {
      message: "Internal Server Error calculateCSRateForEachGroup",
      status: 500,
    }
  }
}

// function to calculate CS rate for Each group
const calculateAbsoluteCSRate = async (
  groupsList,

  res,
  count_total,
  department,
  startMonth,
  endMonth
) => {
  try {
    return new Promise((resolve, reject) => {
      let AbsolutecsRate = []
      //let currentCalculation = _.cloneDeep(relativeGroupSize);
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE group_name = '${thisGroup}' AND delivery='Cesarean' AND MONTH(created_on) BETWEEN ${startMonth} AND ${endMonth} AND department='${department}'`
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error)
            reject({
              message: "Internal Server Error calculateCSRateForEachGroup",
              status: 500,
            })
            return
          }
          let thisGroupCsCount = await result[0]["COUNT"]

          let AbsoluteCsRate =
            thisGroupCsCount && count_total
              ? (thisGroupCsCount / count_total) * 100
              : 0

          AbsolutecsRate.push({
            group_name: thisGroup,
            AbsolutecsRate: AbsoluteCsRate.toFixed(2),
          })

          if (AbsolutecsRate.length === totalGroupList.length) {
            resolve(AbsolutecsRate)
          }
        })
      })
    })
  } catch (error) {
    console.error(error)
    throw {
      message: "Internal Server Error calculateCSRateForEachGroup",
      status: 500,
    }
  }
}

// function to calculate Relative CS rate for Each group
const calculateRelativeCsRate = async (
  groupsList,
  res,
  CS_total,
  department,
  startMonth,
  endMonth
) => {
  try {
    return new Promise((resolve, reject) => {
      let RelativecsRate = []
      _.forEach(totalGroupList, async (thisGroup, index) => {
        let robsonsQuery = `SELECT COUNT(*) as COUNT FROM robsonsdata WHERE delivery='Cesarean' AND group_name = '${thisGroup}' AND MONTH(created_on) BETWEEN ${startMonth} AND ${endMonth} AND department='${department}'`
        con.query(robsonsQuery, async (error, result, fields) => {
          if (error) {
            console.error(error)
            res.status(500).send({
              message: "Internal Server Error calculateRelativeCsRate",
            })
            return
          }
          let thisGroupCsCount = await result[0]["COUNT"]

          let thisGroupCount = CS_total

          let CsRate =
            thisGroupCsCount && thisGroupCount
              ? (thisGroupCsCount / thisGroupCount) * 100
              : 0

          let d = CsRate

          RelativecsRate.push({
            group_name: thisGroup,
            RelativecsRate: d.toFixed(2),
          })

          if (RelativecsRate.length === totalGroupList.length) {
            resolve(RelativecsRate)
          }
        })
      })
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ message: "Internal Server Error calculateCSRateForEachGroup" })
    return
  }
}
