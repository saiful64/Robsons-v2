import { con } from "../database/Database.js"
import formData from "../constants/formData.json" assert { type: "json" }
import moment from "moment"

export const formdata = (req, res) => {
  res.status(200).send(formData)
}

export const submitForm = (req, res) => {
  let data = req.body
  let actualPreviousCesarean = req.body.previous_cesarean

  data.previous_cesarean = Number(data.previous_cesarean) > 0 ? "true" : "false"

  let pog
  if (data.weeks < 36) {
    pog = "<36"
  } else {
    pog = ">36"
  }
  let group

  if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 1"
  } else if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Pre Labour" || data.labour === "Induction of Labor") &&
    pog === ">36"
  ) {
    group = "Group 2"
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 3"
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Induction of Labor" || data.labour === "Pre Labour") &&
    pog === ">36"
  ) {
    group = "Group 4"
  } else if (
    data.previous_cesarean === "true" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === ">36"
  ) {
    group = "Group 5"
  } else if (
    data.obs_index === "Primi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 6"
  } else if (
    data.obs_index === "Multi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 7"
  } else if (data.fetus_type === "Twins") {
    group = "Group 8"
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Transverse"
  ) {
    group = "Group 9"
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === "<36"
  ) {
    group = "Group 10"
  } else {
    let err = true
    console.error("Error in group logics")
    res.status(400).send({ message: "Group Logic Error" })
    return
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
          indication_cesarean,
          Stage,
          B1Gender,
          B1Weight,
          B2Gender,
          B2Weight,
          b1apgar1,
          b1apgar5,
      b2apgar1,
          b2apgar5,
      b1outcome,
      b2outcome,
          indication,
          b1final_outcome,
      b2final_outcome,
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
          ${data.b1_weight ? `"${data.b1_weight}"` : null},
          ${data.b2_gender ? `"${data.b2_gender}"` : null},
          ${data.b2_weight ? `"${data.b2_weight}"` : null},
          ${data.b1apgar1 ? `"${data.b1apgar1}"` : null},
          ${data.b1apgar5 ? `"${data.b1apgar5}"` : null},
          ${data.b1outcome ? `"${data.b1outcome}"` : null},
      ${data.b2apgar1 ? `"${data.b2apgar1}"` : null},
          ${data.b2apgar5 ? `"${data.b2apgar5}"` : null},
          ${data.b2outcome ? `"${data.b2outcome}"` : null},
          ${data.indication ? `"${data.indication}"` : null},
          ${data.b1final_outcome ? `"${data.b1final_outcome}"` : null},
      ${data.b2final_outcome ? `"${data.b2final_outcome}"` : null},
          ${
            data.indication_for_induction
              ? `"${data.indication_for_induction}"`
              : null
          },
          ${data.b1_date_of_birth ? `"${data.b1_date_of_birth}"` : null},
          ${data.b1_time_of_birth ? `"${data.b1_time_of_birth}"` : null},
          ${data.b2_date_of_birth ? `"${data.b2_date_of_birth}"` : null},
          ${data.b2_time_of_birth ? `"${data.b2_time_of_birth}"` : null},
          ${group ? `"${group}"` : null},
          ${data.created_by ? `"${data.created_by}"` : null},
          NOW(),
          ${data.review ? `"${data.review}"` : null},
          ${data.department ? `"${data.department}"` : null}
          );`

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error while inserting data: ", err)
      res.status(400).send({ message: "Error while inserting data" })
      return
    }
    let robsonsId = data.patient_id

    const groupQuery = `INSERT INTO \`groups\` (group_name, created_by, created_on, patient_id,department) VALUES ("${group}", "${data.created_by}", NOW(), "${robsonsId}", "${data.department}")`
    con.query(groupQuery, (err, result) => {
      if (err) {
        console.log("Error while inserting data INTO GROUPS: ", err)
        res
          .status(400)
          .send({ message: "Error while inserting data in groups" })
        return
      }
    })
    let responseData = {
      message: "Data inserted successfully",
      group: group,
      formId: robsonsId,
    }
    res.status(200).send(responseData)
  })
}

export const updateForm = (req, res) => {
  const { pid } = req.params

  let data = req.body

  let actualPreviousCesarean

  actualPreviousCesarean = req.body.previous_cesarean

  data.previous_cesarean = Number(data.previous_cesarean) > 0 ? "true" : "false"

  let pog
  if (data.weeks < 36) {
    pog = "<36"
  } else {
    pog = ">36"
  }

  let group

  if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 1"
  } else if (
    data.obs_index === "Primi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Pre Labour" || data.labour === "Induction of Labor") &&
    pog === ">36"
  ) {
    group = "Group 2"
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    data.labour === "Spontaneous" &&
    pog === ">36"
  ) {
    group = "Group 3"
  } else if (
    data.obs_index === "Multi" &&
    data.previous_cesarean === "false" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    (data.labour === "Induction of Labor" || data.labour === "Pre Labour") &&
    pog === ">36"
  ) {
    group = "Group 4"
  } else if (
    data.previous_cesarean === "true" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === ">36"
  ) {
    group = "Group 5"
  } else if (
    data.obs_index === "Primi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 6"
  } else if (
    data.obs_index === "Multi" &&
    data.fetus_type === "Single" &&
    data.presentation_single === "Breech"
  ) {
    group = "Group 7"
  } else if (data.fetus_type === "Twins") {
    group = "Group 8"
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Transverse"
  ) {
    group = "Group 9"
  } else if (
    data.fetus_type === "Single" &&
    data.presentation_single === "Cephalic" &&
    pog === "<36"
  ) {
    group = "Group 10"
  } else {
    let err = true
    console.error("Error in group logics")
    res.status(400).send({ message: "Group Logic Error" })
    return
  }

  const sql = `UPDATE robsonsdata
      SET
      obs_index = ${data.obs_index ? `"${data.obs_index}"` : null},
      weeks = ${data.weeks ? `"${data.weeks}"` : null},
      pog = ${pog ? `"${pog}"` : null},
      previous_cesarean = ${
        actualPreviousCesarean ? `"${actualPreviousCesarean}"` : null
      },
      fetus_type = ${data.fetus_type ? `"${data.fetus_type}"` : null},
      presentation_single = ${
        data.presentation_single ? `"${data.presentation_single}"` : null
      },
      presentation_twin = ${
        data.presentation_twin ? `"${data.presentation_twin}"` : null
      },
      Labour = ${data.labour ? `"${data.labour}"` : null},
      ripening = ${data.ripening ? `"${data.ripening}"` : null},
      induced_augmented = ${
        data.induced_augmented ? `"${data.induced_augmented}"` : null
      },
      delivery = ${data.delivery ? `"${data.delivery}"` : null},
      indication_ovd = ${
        data.indication_ovd ? `"${data.indication_ovd}"` : null
      },
      indication_cesarean = ${
        data.indication_cesarean ? `"${data.indication_cesarean}"` : null
      },
      Stage = ${data.stage ? `"${data.stage}"` : null},
      B1Gender = ${data.b1_gender ? `"${data.b1_gender}"` : null},
      B1Weight = ${data.b1_weight ? `"${data.b1_weight}"` : null},
      B2Gender = ${data.b2_gender ? `"${data.b2_gender}"` : null},
      B2Weight = ${data.b2_weight ? `"${data.b2_weight}"` : null},
      b1apgar1 = ${data.b1apgar1 ? `"${data.b1apgar1}"` : null},
      b1apgar5 = ${data.b1apgar5 ? `"${data.b1apgar5}"` : null},
      b1outcome = ${data.b1outcome ? `"${data.b1outcome}"` : null},
      b2apgar1 = ${data.b2apgar1 ? `"${data.b2apgar1}"` : null},
      b2apgar5 = ${data.b2apgar5 ? `"${data.b2apgar5}"` : null},
      b2outcome = ${data.b2outcome ? `"${data.b2outcome}"` : null},
      indication = ${data.indication ? `"${data.indication}"` : null},
      b1final_outcome = ${
        data.b1final_outcome ? `"${data.b1final_outcome}"` : null
      },
      b2final_outcome = ${
        data.b2final_outcome ? `"${data.b2final_outcome}"` : null
      },
      indication_for_induction = ${
        data.indication_for_induction
          ? `"${data.indication_for_induction}"`
          : null
      },
      b1_date_of_birth = ${
        data.b1_date_of_birth
          ? `"${moment(data.b1_date_of_birth).format("YYYY-MM-DD")}"`
          : null
      },
      b1_time_of_birth = ${
        data.b1_time_of_birth ? `"${data.b1_time_of_birth}"` : null
      },
      b2_date_of_birth = ${
        data.b2_date_of_birth
          ? `"${moment(data.b2_date_of_birth).format("YYYY-MM-DD")}"`
          : null
      },
      b2_time_of_birth = ${
        data.b2_time_of_birth ? `"${data.b2_time_of_birth}"` : null
      },
      group_name = ${group ? `"${group}"` : group},
      created_by = ${data.created_by ? `"${data.created_by}"` : null},
      review = ${data.review ? `"${data.review}"` : null},
      department = ${data.department ? `"${data.department}"` : null}
  WHERE patient_id = "${pid}";`

  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error while inserting data: ", err)
      res.status(400).send({ message: "Error while inserting data" })
      return
    }
    let robsonsId = pid

    const groupQuery = `UPDATE groups
    SET
        group_name = "${group}",
        created_by = "${data.created_by}",
        created_on = NOW(),
        patient_id = "${robsonsId}"
    WHERE patient_id = "${robsonsId}";`

    con.query(groupQuery, (err, result) => {
      if (err) {
        console.log("Error while inserting data INTO GROUPS: ", err)
        res
          .status(400)
          .send({ message: "Error while inserting data in groups" })
        return
      }
    })
    let responseData = {
      message: "Data Updated successfully",
      group: group,
      formId: robsonsId,
    }
    res.status(200).send(responseData)
  })
}
