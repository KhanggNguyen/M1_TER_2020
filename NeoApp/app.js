var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver');

var app = express();

//View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', '1234567'));
var session = driver.session();

app.get('/', function(req,res,next){
    res.render('index', {page:'Home', menuId:'home', url: "home"});
});

app.get('/graphe_transition',async function(req,res){
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0  return p SKIP '+ Math.floor(Math.random() * 100) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe transition";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    var nodeE = record._fields[0].segments[2].start.properties.label;
                    var r3 = record._fields[0].segments[2].relationship.type;
                    var nodeF = record._fields[0].segments[2].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        nodeE : nodeE,
                        nodeF : nodeF,
                        relation1 : r1,
                        relation2 : r2, 
                        relation3 : r3,
                    });
                    //console.log(resArray);
                    id++;
                });
                res.render('index', {
                    url : "transition",
                    page:'Home', menuId:'home',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_inference',async function(req,res){
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c) WHERE r2.poids > 0 AND r1.poids > 0  return p SKIP '+ Math.floor(Math.random() * 100) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe transition";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    console.log(record._fields[0].segments[0].start);
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeC = record._fields[0].segments[1].end.properties.label;
                    var res = nodeA + '-[' + r1 + ']->' + nodeB + '-[' + r2 + ']->' + nodeC;
                    resArray.push({
                        id : id, res :res
                    });
                    id++;
                });
                res.render('index', {
                    url : "inference",
                    page:'Home', menuId:'home',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.listen(3000);

console.log('Server started on Port 3000');

module.exports = app;