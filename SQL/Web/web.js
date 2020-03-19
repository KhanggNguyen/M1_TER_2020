const mysql = require("mysql");
const config = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1234", 
  database: "relation", 
  multipleStatements: true
};

var connection = mysql.createConnection(config);

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

var queryTemp = "create temporary table relation_temp like relation; insert relation_temp select * from relation";
connection.query(queryTemp, (err, results) => {
  if (err) throw err;
  console.log("Table created");
  console.log(results[0]);
  console.log(results[1]);
});

connection.end((err) => {
  if (err) throw err;
  console.log("Closed!");
});

// app.listen(8888);
