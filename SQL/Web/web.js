const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const requestIp = require("request-ip"); //client IP
const fs = require("fs");
const app = express();

//write user's response to csv file
const logStream = fs.createWriteStream("user_proposition.csv", { flags: "a" });

const config = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "1234",
  database: "relation",
  multipleStatements: true,
};

const db = mysql.createConnection(config);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database " + config.database);
});

global.db = db;

app.set("views", path.join(__dirname, "/views/"));
app.set("view engine", "ejs");

app.use(requestIp.mw());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "/public/")));

//this array will be used to pick a random number for relation_type
const items = [6, 9, 13, 14, 15, 17, 41, 42];
const relationNums2 = items.sort(() => Math.random() - 0.5);
const relationNums1 = items.sort(() => Math.random() - 0.5);
const sample = ["quadrilatère", 9, "4 angles droits", 14, "carré", 6];

app.get("/", (req, res, next) => {
  res.render("index", { page: "Home", menuId: "home", url: "home" });
});

app.get("/transition", (req, res) => {
  let query =
    "select a1.term_1 as nodeA, a1.relation_type as r1, a1.term_2 as nodeB, a2.relation_type as r2, a2.term_2 as nodeC, " +
    "a3.relation_type as r3 " +
    "from relation as a1, relation_2 as a2, relation_3 as a3 " +
    "where a2.term_1 = a1.term_2 and a1.term_1 = a3.term_1 and a2.term_2 = a3.term_2" +
    " and a1.relation_type = " +
    relationNums1[~~(Math.random() * relationNums1.length)] +
    " and a2.relation_type = " +
    relationNums2[~~(Math.random() * relationNums2.length)] +
    " and a3.relation_type != 0" +
    " and a1.weight > 0 and a2.weight > 0 and a3.weight > 0 order by rand() limit 1;";

  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Transition Graph";
    let resArray = [];
    let id = 1;

    //get each element of a json object named row which is in the 1st position of result and bind them to resArray
    const row = results[0] || [];
    let nodeA = row["nodeA"] || sample[0];
    let relation1 = row["r1"] || sample[1];
    let nodeB = row["nodeB"] || sample[2];
    let relation2 = row["r2"] || sample[3];
    let nodeC = row["nodeC"] || sample[4];
    let relation3 = row["r3"] || sample[5];

    //if items in array and variables to be assigned have the same name, eg: nodeA of resArray = variable 'nodeA'
    resArray.push({ id, nodeA, nodeB, nodeC, relation1, relation2, relation3 });
    id++;

    // render UI - ejs
    res.render("index", {
      url: "transition",
      page: "Transition",
      menuId: "transition",
      title: title,
      myResArray: resArray,
    });
  });
});

app.get("/deduction", (req, res) => {
  let query =
    "select a1.term_1 as nodeA, a1.relation_type as r1, a1.term_2 as nodeB, a2.relation_type as r2, a2.term_2 as nodeC " +
    "from relation as a1, relation_2 as a2 " +
    "where a2.term_1 = a1.term_2 " +
    "and a1.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a2.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a1.weight > 0 and a2.weight > 0 order by rand() limit 1;";
  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Deduction Graph ";
    let resArray = [];
    let id = 1;

    const row = results[0] || [];
    let nodeA = row["nodeA"] || sample[0];
    let relation1 = row["r1"] || sample[1];
    let nodeB = row["nodeB"] || sample[2];
    let relation2 = row["r2"] || sample[3];
    let nodeC = row["nodeC"] || sample[4];

    resArray.push({ id, nodeA, nodeB, nodeC, relation1, relation2 });

    // console.log(resArray);
    id++;
    res.render("index", {
      url: "deduction",
      page: "Deduction",
      menuId: "deduction",
      title: title,
      myResArray: resArray,
    });
  });
});

app.get("/induction", (req, res) => {
  let query =
    "select a1.term_2 as nodeA, a1.relation_type as r1, a1.term_1 as nodeB, a2.relation_type as r2, a2.term_2 as nodeC " +
    "from relation as a1, relation_2 as a2 " +
    "where a1.term_2 != a2.term_2 and a1.term_1 = a2.term_1 " +
    "and a1.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a2.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a1.weight > 0 and a2.weight > 0 order by rand() limit 1;";
  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Induction Graph ";
    let resArray = [];
    let id = 1;

    const row = results[0] || [];
    let nodeA = row["nodeA"] || sample[0];
    let relation1 = row["r1"] || sample[1];
    let nodeB = row["nodeB"] || sample[2];
    let relation2 = row["r2"] || sample[3];
    let nodeC = row["nodeC"] || sample[4];

    resArray.push({ id, nodeA, nodeB, nodeC, relation1, relation2 });

    id++;
    res.render("index", {
      url: "induction",
      page: "Induction",
      menuId: "induction",
      title: title,
      myResArray: resArray,
    });
  });
});

app.get("/abduction", (req, res) => {
  let query =
    "select a1.term_1 as nodeA, a1.relation_type as r1, a1.term_2 as nodeB, a2.relation_type as r2, a2.term_1 as nodeC " +
    "from relation as a1, relation_2 as a2 " +
    "where a1.term_1 != a2.term_1 and a1.term_2 = a2.term_2 " +
    "and a1.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a2.relation_type = " +
    items[~~(Math.random() * items.length)] +
    " and a1.weight > 0 and a2.weight > 0 order by rand() limit 1;";
  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Induction Graph ";
    let resArray = [];
    let id = 1;

    const row = results[0] || [];
    let nodeA = row["nodeA"] || sample[0];
    let relation1 = row["r1"] || sample[1];
    let nodeB = row["nodeB"] || sample[2];
    let relation2 = row["r2"] || sample[3];
    let nodeC = row["nodeC"] || sample[4];

    resArray.push({ id, nodeA, nodeB, nodeC, relation1, relation2 });

    // console.log(results);
    // console.log(resArray);
    id++;
    res.render("index", {
      url: "abduction",
      page: "Abduction",
      menuId: "abduction",
      title: title,
      myResArray: resArray,
    });
  });
});

app.post("/user_input", (req, res) => {
  //ip receives ::1 for localhost + ipv6
  var ip = req.clientIp;
  var node1 = req.body.nodeA;
  var node2 = req.body.nodeC;
  var relation = req.body.relation;
  var page = req.body.page;

  //write to file
  logStream.write(node1 + "," + node2 + "," + relation + "," + ip + "\n");

  res.redirect(page);
});

app.post("/custom_transition", (req, res) => {
  let nodeA = req.body.nodeA;
  let nodeB = req.body.nodeB;
  let nodeC = req.body.nodeC;
  let relation1 = req.body.relation1;
  let relation2 = req.body.relation2;
  let relation3 = req.body.relation3;

  nodeA =
    nodeA != "" || !typeof nodeA === undefined
      ? (nodeA = " and a1.term_1 = '" + nodeA + "' ")
      : "";
  nodeB =
    nodeB != "" || !typeof nodeB === undefined
      ? (nodeB = "and a1.term_2 = '" + nodeB + "' ")
      : "";
  ndoeC =
    nodeC != "" || !typeof nodeC === undefined
      ? (nodeC = "and a2.term_2 = '" + nodeC + "' ")
      : "";
  relation1 =
    relation1 != "" || !typeof relation1 === undefined
      ? (relation1 = " and a1.relation_type = " + relation1)
      : (relation1 = items[~~(Math.random() * items.length)]);
  relation2 =
    relation2 != "" || !typeof relation2 === undefined
      ? (relation2 = " and a2.relation_type = " + relation2)
      : (relation2 = items[~~(Math.random() * items.length)]);
  relation3 =
    relation3 != "" || !typeof relation3 === undefined
      ? (relation3 = " and a3.relation_type = " + relation3)
      : (relation3 = " and a3.relation_type != 0");

  let query =
    "select a1.term_1 as nodeA, a1.relation_type as r1, a1.term_2 as nodeB, a2.relation_type as r2, a2.term_2 as nodeC, " +
    "a3.relation_type as r3 " +
    "from relation as a1, relation_2 as a2, relation_3 as a3 " +
    "where a2.term_1 = a1.term_2 and a1.term_1 = a3.term_1 and a2.term_2 = a3.term_2" +
    nodeA +
    nodeB +
    nodeC +
    relation1 +
    relation2 +
    relation3 +
    " and a1.weight > 0 and a2.weight > 0 and a3.weight > 0 order by rand() limit 1;";

  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Transition Graph";
    let resArray = [];
    let id = 1;

    //bind query to resArray
    const row = results[0];
    let nodeA = row["nodeA"];
    let relation1 = row["r1"];
    let nodeB = row["nodeB"];
    let relation2 = row["r2"];
    let nodeC = row["nodeC"];
    let relation3 = row["r3"];

    console.log(results);
    resArray.push({ id, nodeA, nodeB, nodeC, relation1, relation2, relation3 });
    //console.log(resArray);
    id++;

    let message = "";
    if (resArray.length === 0) {
      message = "Relation not found!";
    }
    res.render("index", {
      url: "transition",
      page: "Transition",
      menuId: "transition",
      title: title,
      message: message,
      myResArray: resArray,
    });
  });
});

app.post("/explaination", (req, res) => {
  let nodeA = req.body.nodeA;
  let nodeC = req.body.nodeC;
  let relation3 = req.body.relation3;
  let relation3rd = "Explaination of relation: " + nodeA + " --[ " + relation3 + " ]--> " + nodeC || "";

  nodeA =
    nodeA != "" || !typeof nodeA === undefined
      ? (nodeA = " and a3.term_1 = '" + nodeA + "' ")
      : "";
  ndoeC =
    nodeC != "" || !typeof nodeC === undefined
      ? (nodeC = "and a3.term_2 = '" + nodeC + "' ")
      : "";
  relation3 =
    relation3 != "" || !typeof relation3 === undefined
      ? (relation3 = " and a3.relation_type = " + relation3)
      : (relation3 = " and a3.relation_type != 0");

  let query =
    "select a1.term_1 as nodeA, a1.relation_type as r1, a1.term_2 as nodeB, a2.relation_type as r2, a2.term_2 as nodeC, " +
    "a3.relation_type as r3 " +
    "from relation as a1, relation_2 as a2, relation_3 as a3 " +
    "where a2.term_1 = a1.term_2 and a1.term_1 = a3.term_1 and a2.term_2 = a3.term_2" +
    nodeA + nodeC + relation3 +
    " and a1.relation_type != 0 and a2.relation_type != 0" +
    " and a1.weight > 0 and a2.weight > 0 and a3.weight > 0 order by rand() limit 10;";

  db.query(query, (err, results) => {
    if (err) throw err;

    const title = "Graph Explaination";
    let resArray = [];
    let id = 1;

    //bind query to resArray
    for (let index = 0; index < results.length; index++) {
      const row = results[index];
      let nodeA = row["nodeA"];
      let relation1 = row["r1"];
      let nodeB = row["nodeB"];
      let relation2 = row["r2"];
      let nodeC = row["nodeC"];
      let relation3 = row["r3"];
      resArray.push({id, nodeA, nodeB, nodeC, relation1, relation2, relation3});
      id++;
    }

    let message = "";
    if (resArray.length === 0) {
      message = "Relation not found!";
    }
    res.render("index", {
      url: "transition",
      page: "Explication",
      menuId: "transition",
      title: title,
      message: message,
      relation3rd: relation3rd,
      myResArray: resArray
    });
  });
});

app.get("/up", (req, res, next) => {});
app.get("/down", (req, res, next) => {});

app.listen(8888);
console.log("Server started on port 8888");
module.exports = app;
