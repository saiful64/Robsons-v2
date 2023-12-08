import mysql from "mysql2";

export const con = mysql.createConnection({
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