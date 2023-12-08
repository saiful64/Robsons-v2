import { con } from '../database/Database.js';


export const register = (req, res) => {
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
  }

  export const login = (req, res) => {
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
        const department = results[0].department;
        res.json({ role, department });
      }
    );
  }