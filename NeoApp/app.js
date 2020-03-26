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
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE r2.poids > 0 AND r1.poids > 0 AND r3.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\' AND type(r3) <> \'0\' return p SKIP '+ Math.floor(Math.random() * 1000) + ' LIMIT 1 ;';
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
                    page:'Transition', menuId:'transition',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.post('/transition_avec_param', async function(req, res){
    var nodeA =  req.body.nodeA;
    var nodeB = req.body.nodeB;
    var nodeC = req.body.nodeC;
    var relation1 = req.body.relation1;
    var relation2 = req.body.relation2;
    var relation3 = req.body.relation3;
    if(nodeA != "" || !typeof nodeA === undefined){
        nodeA = " AND a.label = \'" + nodeA + "\' ";
    }else{
        nodeA = "";
    }
    if(nodeB != "" || !typeof nodeB === undefined){
        nodeB = " AND b.label = \'" + nodeB + "\' ";
    }else{
        nodeB = "";
    }
    if(nodeC != "" || !typeof nodeC === undefined){
        nodeC = " AND c.label = \'" + nodeC + "\' ";
    }else{
        nodeC = "";
    }
    if(relation1 != "" || !typeof relation1 === undefined){
        relation1 = " AND type(r1) =\'" + relation1 + "\' ";
    }
    else{
        relation1 = "AND type(r1) <> \'0\'";
    }
    if(relation2 != "" || !typeof relation2 === undefined){
        relation2 = " AND type(r2) = \'" + relation2 + "\' ";
    }else{
        relation2 = "AND type(r2) <> \'0\'";
    }
    if(relation3 != "" || !typeof relation3 === undefined){
        relation3 = " AND type(r3) = \'" + relation3 + "\' ";
    }else{
        relation3 = "";
    }
    
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c)<-[r3]-(a) WHERE r2.poids > 0 AND r1.poids > 0 ' + nodeA + nodeB + nodeC + relation1 + relation2 + relation3 + 'return p  LIMIT 1 ;';
    console.log(query);
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
                    console.log(record)
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
                message="";
                if(resArray.length == 0){
                    message = 'Aucuns couples de relations ont été trouvé !'
                }
                res.render('index', {
                    url : "transition",
                    page:'Transition', menuId:'transition',
                    titre : titre,
                    message: message,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_deduction',async function(req,res){
    query = 'MATCH p=(a)-[r1]->(b)-[r2]->(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\'  return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Abduction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "deduction",
                    page:'Deduction', menuId:'deduction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_abduction',async function(req,res){
    query = 'MATCH p=(a)-[r1]->(b)<-[r2]-(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\'  return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Abduction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "abduction",
                    page:'Abduction', menuId:'abduction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/graphe_induction',async function(req,res){
    query = 'MATCH p=(a)<-[r1]-(b)-[r2]->(c) WHERE r2.poids > 0 AND r1.poids > 0 AND type(r1) <> \'0\' AND type(r2) <> \'0\' return p SKIP '+ Math.floor(Math.random() * 500000) + ' LIMIT 1 ;';
    await session.run(query)
            .then(function(result){
                var titre = "Graphe Induction";
                var resArray = [];
                var id = 1;
                result.records.forEach(function(record){
                    var nodeA = record._fields[0].segments[0].start.properties.label;
                    var r1 = record._fields[0].segments[0].relationship.type;
                    var nodeB = record._fields[0].segments[0].end.properties.label;
                    var nodeC = record._fields[0].segments[1].start.properties.label;
                    var r2 = record._fields[0].segments[1].relationship.type;
                    var nodeD = record._fields[0].segments[1].end.properties.label;
                    resArray.push({
                        id : id, 
                        nodeA: nodeA,
                        nodeB: nodeB,
                        nodeC : nodeC,
                        nodeD : nodeD,
                        relation1 : r1,
                        relation2 : r2, 
                    });
                    id++;
                });
                res.render('index', {
                    url : "induction",
                    page:'Induction', menuId:'induction',
                    titre : titre,
                    myResArray : resArray
                });
            })
            .catch(function(err){
                console.log(err);
            });
});

app.get('/up', function(req, res, next){

});

app.listen(3000);

console.log('Server started on Port 3000');

module.exports = app;