import { con } from '../database/Database.js';

export const patientCheck =  (req, res) => {
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
  };

 export const allPatient = (req, res) => {
    // Query the database to fetch patient IDs from the robsonsdata table
    const department = req.query.department;
    con.query(
      `SELECT patient_id,created_on FROM robsonsdata WHERE department = '${department}'`,
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }
        // Send the patient IDs as JSON
       
        res.json(results);
      }
    );
  };

 export const onePatientDetail =  (req, res) => {
    const { patient_id } = req.params;
  
    const sql =
      "SELECT patient_id,obs_index,weeks,pog,previous_cesarean,fetus_type,presentation_single,presentation_twin,Labour,ripening,induced_augmented,delivery,indication_ovd,indication_cesarean,Stage,B1Gender,B1Weight,B2Gender,B2Weight,b1apgar1,b1apgar5,b2apgar1,b2apgar5,b1outcome,b2outcome,indication,b1final_outcome,b2final_outcome,indication_for_induction,b1_date_of_birth,b1_time_of_birth,b2_date_of_birth,b2_time_of_birth,group_name,created_by,created_on,review FROM robsonsdata WHERE patient_id = ?";
  
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
  };

  export const deletePatient = (req, res) => {
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
  };