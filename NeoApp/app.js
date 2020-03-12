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

app.get('/graphe_transition', function(req,res){
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0  return p SKIP '+ Math.floor(Math.random() * 100) + ' LIMIT 300 ;';
    session.run(query)
            .then(function(result){
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeC = record._fields[0].segments[2].start.properties.label;
                    var r3 = record._fields[0].segments[2].relationship.type;
                    var nodeD = record._fields[0].segments[2].end.properties.label;
                    console.log(nodeA + '-[' + r1 + ']->' + nodeB + '-[' + r2 + ']->' + nodeC + '<-[' + r3 + ']-' + nodeD);
                });
            })
            .catch(function(err){
                console.log(err);
            });
    res.send('Ok');
});

app.listen(3000);

console.log('Server started on Port 3000');

module.exports = app;